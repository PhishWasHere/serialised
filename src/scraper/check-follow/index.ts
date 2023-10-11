import getError from '../../utils/get-error';
import { ModalSubmitInteraction } from 'discord.js';
import { getFollow } from './get-follow';
import embedBuilder from '../../utils/discord/embed';
import msgSplit from '../../utils/msg-split';

const msgLen = 1800;
export const getFollowList = async (username: string, password: string, i: ModalSubmitInteraction) => {
    try{

        const {updatedArr, notUpdatedArr, errArr} = await getFollow(username, password);

        const count = updatedArr.length + notUpdatedArr.length + errArr.length;

        await i.editReply({embeds: [embedBuilder('Done!', `Checked ${count} manga's for updates.` )]})
       
        try { // not updated manga section
            if (notUpdatedArr.length > 0 ) {
                const notUpdatedTitles = notUpdatedArr.map((manga) => `*${manga.title} - Chapter ${manga.latestChapter}* **|**`);
                const notUpdatedMessage = `**The following manga are not updated on MangaDex**: ${notUpdatedTitles.join(' ')}`;
    
                if (notUpdatedMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder(`Not Updated (${notUpdatedArr.length})`, notUpdatedMessage, null, false, false, true)]});
    
                } else {
                    const chunks = msgSplit(notUpdatedMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder(`Not Updated (${notUpdatedArr.length})`, chunk, null, false, false, true)]});
                    }
                }
            } await i.followUp({embeds: [embedBuilder('Mangas Updated', 'All Mangas thay you follow are being updated on MangaDex', null, true)]});
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try { // error manga section
            if (errArr.length > 0 ) {
                const errTitles = errArr.map((manga) => `*${manga}* **|**`);
                const errMessage = `${errTitles.join(' ')}`;
    
                if (errMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder(`Encountered ${errArr.length}errors (use */help error* for more info).`, errMessage, null, false, true)]});
    
                } else {
                    const chunks = msgSplit(errMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder(`Encountered ${errArr.length} errors (use */help error* for more info).`, chunk, null, false, true)]});
                    }
                }
            }
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
