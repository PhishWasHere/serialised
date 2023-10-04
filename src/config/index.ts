import { GatewayIntentBits, Client, Partials} from 'discord.js';
import { SlashCommandStringOption, SlashCommandBuilder } from '@discordjs/builders';
import { cmdArr } from './commands';
import getError from '../utils/get-error';

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

const commandBuilder = (cmdArr: any[]) => {    
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
        commandBuilder(cmdArr).forEach(async (cmd) => {
            await client.application?.commands.create(cmd);
        });
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

export default client;