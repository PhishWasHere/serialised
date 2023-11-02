import getError from '../../../utils/get-error';
import { CommandInteraction, VoiceBasedChannel } from 'discord.js';
import DisTube from 'distube';
import embedBuilder from '../../../utils/discord/embed';

export const play = async (i: CommandInteraction, distube: DisTube, channel: VoiceBasedChannel | null) => {
    try {
        const input = i.options.get('title')?.value?.toString().trim();

        if (!input) {
            return i.reply({embeds: [embedBuilder({ title: 'Error', desc: 'No input provided', err: true })]});
        }

        if (!channel) {
            return i.reply({embeds: [embedBuilder({ title: 'Error', desc: 'You must be in a voice channel to use this command', err: true })]});
        }

        await i.reply({embeds: [embedBuilder({ title: 'Searching...', desc: `Searching for ${input}` })]});

        distube.play(channel, input, { // might need to remove the await
            metadata: i,
        });

        distube.on('playSong', (queue, song) => {
            i.editReply({embeds: [embedBuilder({ title: 'Playing!', desc: `Playing ${song.name}`, image: song.thumbnail, success: true })]});   
        });

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
