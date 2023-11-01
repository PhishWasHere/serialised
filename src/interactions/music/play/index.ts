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

        await distube.play(channel, input, {
            metadata: i,
        });

        const song = distube.getQueue(i.guildId!)!.songs[0];
        
        i.editReply({embeds: [embedBuilder({ title: 'Playing!', desc: `Playing ${song.name}`, success: true })]});

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

