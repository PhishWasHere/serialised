import { GatewayIntentBits, Client, Partials} from 'discord.js';
import { SlashCommandStringOption, SlashCommandBuilder } from '@discordjs/builders';
import discordModals, {showModal } from 'discord-modals';
import { cmdArr } from './commands';
import getError from '../../utils/get-error';
import embedBuilder from '../../utils/discord/embed';
import modalBuilder from '../../utils/discord/modal';
import { getFollowCmd, getSingleCmd, helpCmd } from '../../interactions';
import User from '../../model';


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.Message],
});

export const clientStart = async () => {
    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
discordModals(client);

type cmdType = {
    name: string,
    description: string,
    options?: SlashCommandStringOption[],
};

const commandBuilder = (cmdArr: cmdType[]) => {    
    const cmdArrBuilder: SlashCommandBuilder[] = [];
    for (const command of cmdArr) {
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
        // commands?.forEach(async (cmd) => {
        //     console.log(`\x1b[31m> Deleting\x1b[0m: ${cmd.name}`);
        //     await client.application?.commands.delete(cmd);
        // });

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

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isCommand() || !interaction.isModalSubmit) return;
    
        const { commandName, options } = interaction;
        
        switch (commandName) {
            case 'ping':
                await interaction.reply({embeds: [embedBuilder({title: 'Pong!', desc: 'Pong!'})]})
            break;
    
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
                const modal = await modalBuilder(interaction);

                showModal(modal, {
                    client: interaction.client,
                    interaction: interaction,
                })
            break;

            case 'check-list':
            break;
    
            default:
                await interaction.reply({embeds: [embedBuilder({title: 'Error', desc: 'Something went wrong', err: true })]});
            break;
        }
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

client.on('modalSubmit', async (i) => {
    try {
        const timeout = 210000; // 3.5 minutes 

        let isTimedOut = true;
    
        const timeoutPromise = new Promise((resolve, reject) => { // timeout function, if discord command takes too long to complete, returns timeout err
            setTimeout(() => {
                if (isTimedOut) {
                    reject(i.editReply({embeds: [embedBuilder({title: 'Error', desc: 'Request timed out. (you may have too many follows for the server to keep up)', err: true })]}));
                }
            }, timeout);
        });

        await Promise.race([ // runs both functions, if discord command takes too long to complete, returns timeout err
            (async () => {
                switch (i.customId) {
                    case 'login':
                        
                        const username = i.components[0].components[0].value.trim();
                        const password = i.components[1].components[0].value.trim();       
                        
                        await i.reply({embeds: [embedBuilder({ title: 'Checking...', desc: `Checking follow list for ${username}. This may take a minute.` })]});
                        
                        try {
                            const userData = new User({
                                user_id: i.user.id, 
                            });
    
                            await userData.save();
                        } catch (err) {
                            const errMsg = getError(err);
                            return i.editReply({embeds: [embedBuilder({ title: 'Error', desc: errMsg, err: true })]});
                        }

                        await getFollowCmd(username, password, i);        
                        
                        // await User.findOneAndDelete({ user_id: i.user.id });

                        isTimedOut = false; // marks function as completed, doesnt run timeout func
                    break;

                }
            })(),
            timeoutPromise
        ]);

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

export default client;