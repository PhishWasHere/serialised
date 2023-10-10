import getError from '../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import { ModalSubmitInteraction } from 'discord.js';
import { getFollow } from './get-follow';
import embedBuilder from '../../utils/discord/embed';
import msgSplit from '../../utils/msg-split';

const scraper = new Manganato();

export const getFollowList = async (username: string, password: string, i: ModalSubmitInteraction) => {
    try{

        const {updatedArr, notUpdatedArr, errArr} = await getFollow(username, password);

        const count = updatedArr.length + notUpdatedArr.length + errArr.length;

        await i.editReply({embeds: [embedBuilder('Done!', `Checked ${count} manga's for updates.` )]})
        
        // updated manga section
        const updatedTitles = updatedArr.map((manga) => `*${manga.title} - Chapter ${manga.latestChapter}* **|**`);
        const updatedMessage = `${updatedTitles.join(' ')}`;
        
        if (updatedMessage.length <= 1800) {
            await i.followUp({embeds: [embedBuilder('The following manga are updated on MangaDex: ', updatedMessage, null, true)]});

        } else {
            const chunks = msgSplit(updatedMessage, 1800);

            for (const chunk of chunks) {
                await i.followUp({embeds: [embedBuilder('The following manga are updated on MangaDex: ', chunk, null, true)]});
            }
        }

        // not updated manga section
        if (notUpdatedArr.length > 0 ) {
            const notUpdatedTitles = notUpdatedArr.map((manga) => `*${manga.title} - Chapter ${manga.latestChapter}* **|**`);
            const notUpdatedMessage = `**The following manga are not updated on MangaDex**: ${notUpdatedTitles.join(' ')}`;

            if (notUpdatedMessage.length <= 1800) {
                await i.followUp({embeds: [embedBuilder('Not Updated', notUpdatedMessage, null, false, false, true)]});

            } else {
                const chunks = msgSplit(notUpdatedMessage, 1800);

                for (const chunk of chunks) {
                    await i.followUp({embeds: [embedBuilder('Not Updated', chunk, null, false, false, true)]});
                }
            }
        }
        
        // error manga section
        if (errArr.length > 0 ) {
            const errTitles = errArr.map((manga) => `*${manga}* **|**`);
            const errMessage = `${errTitles.join(' ')}`;

            if (errMessage.length <= 1800) {
                await i.followUp({embeds: [embedBuilder('The following manga had an error: ', errMessage, null, false, true)]});

            } else {
                const chunks = msgSplit(errMessage, 1800);

                for (const chunk of chunks) {
                    await i.followUp({embeds: [embedBuilder('The following manga had an error: ', chunk, null, false, true)]});
                }
            }
        }

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
