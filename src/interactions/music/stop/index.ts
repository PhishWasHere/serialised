import { CommandInteraction } from 'discord.js';
import DisTube from 'distube';
import embedBuilder from '../../../utils/discord/embed';
import getError from '../../../utils/get-error';

export const stop = async (i: CommandInteraction, distube: DisTube) => {
    try {
        const queue = distube.getQueue(i.guildId!);
        if (!queue) {
            return i.reply({embeds: [embedBuilder({ title: 'Error', desc: 'There is nothing in the queue', err: true })]});
        }
        distube.stop(i.guildId!);
        i.reply({embeds: [embedBuilder({ title: 'Stopped!', desc: `Stopped playing music`, warn: true })]});
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}