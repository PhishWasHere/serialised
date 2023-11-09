import { GatewayIntentBits, Client, Partials, Collection, InteractionType, GuildMember } from 'discord.js';
import { SlashCommandStringOption, SlashCommandBuilder } from '@discordjs/builders';
import { cmdArr } from './commands';
import getError from '../../utils/get-error';
import embedBuilder from '../../utils/discord/embed';
import loginModalBuilder from '../../utils/discord/modal';
import { getFollowCmd, getSingleCmd, helpCmd, play, stop } from '../../interactions';
import User from '../../model';
import DisTube from 'distube';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel, Partials.Message],
});

interface CustomClient extends Client {
    modals?: Collection<string, any>;
}

const distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    // leaveOnFinish: true,
    leaveOnStop: true,
    searchCooldown: 5,
    searchSongs: 3,
});
distube.setMaxListeners(0);

distube.on('finish', (queue) => { // when song finishes, leave channel (leaveOnFinish doesn't work)
    distube.stop(queue);
})

export const clientStart = async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
        (client as CustomClient).modals = new Collection();
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

type cmdType = {
    name: string,
    description: string,
    options?: SlashCommandStringOption[],
};

const commandBuilder = (cmdArr: cmdType[]) => { // builds commands
    const cmdArrBuilder: SlashCommandBuilder[] = [];
    for (const command of cmdArr) { // loops through commands
        const cmd = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);
        if (command.options) {
            for (const option of command.options) {
                cmd.addStringOption((option as unknown) as SlashCommandStringOption);
            }
        }
        cmdArrBuilder.push(cmd);
    }
    return cmdArrBuilder;
};


client.once('ready', async () => {
    console.log(`\x1b[35m> Ready!\x1b[0m Logged in as ${client.user?.tag}`);
    try {
        const commands = await client.application?.commands.fetch();//gets commands, then deletes them on start
        commands?.forEach(async (cmd) => {
            console.log(`\x1b[31m> Deleting\x1b[0m: ${cmd.name}`);
            await client.application?.commands.delete(cmd);
        });

        commandBuilder(cmdArr).forEach(async (cmd) => { //creates commands
            console.log(`\x1b[94m> Creating\x1b[0m: ${cmd.name}`);
            await client.application?.commands.create(cmd);
        });

        console.log(`\x1b[35m> Ready!\x1b[0m Commands created`)

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

type resType = {
    title: string,
    description: string,
    image?: string | undefined,
    success?: boolean | undefined,
    err?: boolean | undefined,
    warn?: boolean | undefined,
    other?: boolean | undefined,
}


client.on('interactionCreate', async (interaction) => { // slash command interaction
    try {
        if (!interaction.isCommand() || !interaction.isModalSubmit ) return;

        const { commandName, options } = interaction;
        const member = interaction.member as GuildMember;
        const channel = member!.voice.channel;

        switch (commandName) {
            case 'help':
                await helpCmd(interaction);
            break;
    
            case 'updated':
                const title = options.data[0].value?.toString().trim();
                await interaction.reply({embeds: [embedBuilder({ title: 'Checking...', desc: `Checking for updates on ${title}`})]});
                const res: resType = (await getSingleCmd(title!)) || { title: 'Error', description: 'Something went wrong', err: true };
                
                await interaction.editReply({embeds: [embedBuilder({ title: res.title, desc: res.description, image: res.image, success: res.success, err: res.err, warn: res.warn })]});
            break;
    
            case 'check-follow':
                const modal = loginModalBuilder(interaction);

                await interaction.showModal(modal);
            break;

            case 'play':
                await play(interaction, distube, channel);
            break;

            case 'stop':
                await stop(interaction, distube);
            break
    
            default:
                await interaction.reply({embeds: [embedBuilder({title: 'Error', desc: 'Something went wrong', err: true })]});
            break;
        }
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});


client.on('interactionCreate', async (i) => { // modal submit interaction
    if (i.type != InteractionType.ModalSubmit) return;

    const timeout = 300000; // 5 minutes

    let isTimedOut = true;

    const timeoutPromise = new Promise((resolve, reject) => { // timeout function, if discord command takes too long to complete, returns timeout err
        setTimeout(async () => {
            if (isTimedOut) {
                await i.editReply({embeds: [embedBuilder({title: 'Error', desc: 'Request timed out. (you may have too many follows for the server to keep up)', err: true })]});
                reject(new Error('temp res'));
            }
        }, timeout);
    });

    await Promise.race([ // runs both functions, if discord command takes too long to complete, returns timeout err
        (async () => {
            try {
       
            switch (i.customId) {
                    case 'login':
                        const username = i.fields.getTextInputValue('username');
                        const password = i.fields.getTextInputValue('password');

                        await i.reply({embeds: [embedBuilder({ title: 'Checking...', desc: `Checking follow list for ${username}. This may take a minute.` })]});
                        try {
                            const userData = new User({
                                user_id: i.user.id, 
                            });
        
                            await userData.save();
        
                            await getFollowCmd(username, password, i);

                            await User.findOneAndDelete({ user_id: i.user.id });
                            
                        } catch (err) {
                            isTimedOut = false;
                            const errMsg = getError(err);
                            return i.editReply({embeds: [embedBuilder({ title: 'Error', desc: errMsg, err: true })]});
                        }
                        
                        await User.findOneAndDelete({ user_id: i.user.id });

                        isTimedOut = false;
                    break;
                }

            } catch (err) {
                isTimedOut = false;
                const errMsg = getError(err);
                throw new Error(errMsg);
            }   
        })(),
        timeoutPromise
    ]).catch((err) => {
        const errMsg = getError(err);
        throw new Error(errMsg);
    });
});


export default client;