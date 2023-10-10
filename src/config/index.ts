import { GatewayIntentBits, Client, Partials} from 'discord.js';
import { SlashCommandStringOption, SlashCommandBuilder } from '@discordjs/builders';
import discordModals, {showModal, TextInputComponent} from 'discord-modals';
import { cmdArr } from './commands';
import getError from '../utils/get-error';
import { getSingle } from '../scraper/get-single';
import embedBuilder from '../utils/discord/embed';
import { modalBuilder } from '../utils/discord/modal';
import { getFollowList } from '../scraper/check-follow';

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
                await interaction.reply({embeds: [embedBuilder('Pong!', 'Pong!')]})
            break;
    
            case 'help':
            break;
    
            case 'updated':
                const title = options.data[0].value?.toString().trim();
                await interaction.reply({embeds: [embedBuilder('Checking...', `Checking for updates on ${title}`)]});
                const res: resType = (await getSingle(title!)) || { title: 'Error', description: 'Something went wrong', err: true };
                
                await interaction.editReply({embeds: [embedBuilder(res.title, res.description, res.image, res.success, res.err, res.warn)]});
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
                await interaction.reply({embeds: [embedBuilder('Error', 'Something went wrong', undefined, undefined, true)]});
            break;
        }
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

client.on('modalSubmit', async (i) => {
    try {
        const timeout = 25000; //25 seconds
        
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(i.editReply({embeds: [embedBuilder('Error', 'Request timed out. (you may have too many follows for the server to keep up)', undefined, undefined, true)]}));
            }, timeout);
        });

        await Promise.race([
            (async () => {
                switch (i.customId) {
                    case 'login':
                        const username = i.components[0].components[0].value.trim();
                        const password = i.components[1].components[0].value.trim();

                        await i.reply({embeds: [embedBuilder('Checking...', `Checking follow list for ${username}. This may take a minute.`)]});

                        await getFollowList(username, password, i);                    
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