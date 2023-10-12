import getError from '../../utils/get-error';
import { ModalSubmitInteraction } from 'discord.js';
import { getFollow } from './get-follow';
import embedBuilder from '../../utils/discord/embed';
import msgSplit from '../../utils/msg-split';

const msgLen = 1800;
export const getFollowCmd = async (username: string, password: string, i: ModalSubmitInteraction) => {
    try{

        const {updatedArr, notUpdatedArr, errArr, notFoundArr} = await getFollow(username, password);

        const count = updatedArr.length + notUpdatedArr.length + errArr.length;

        await i.editReply({embeds: [embedBuilder({ title: 'Done!', desc: `Checked ${count} manga's for updates.` })]})
       
        try { // not updated manga section
            if (notUpdatedArr.length > 0 ) {
                const notUpdatedTitles = notUpdatedArr.map((manga) => `*${manga.title} - Chapter ${manga.latestChapter}* **|**`);
                const notUpdatedMessage = `**The following manga are not updated on MangaDex**: ${notUpdatedTitles.join(' ')}`;
    
                if (notUpdatedMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder({ title:`Not Updated (${notUpdatedArr.length})`, desc: notUpdatedMessage, other: true })]});
    
                } else {
                    const chunks = msgSplit(notUpdatedMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder({ title: `Not Updated (${notUpdatedArr.length})`, desc: chunk, other: true })]});
                    }
                }
            } await i.followUp({embeds: [embedBuilder({ title: 'Mangas Updated', desc: 'All Mangas thay you follow are being updated on MangaDex', success: true })]});
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try { // not found manga section
            if (notFoundArr.length > 0 ) {
                const notFoundTitles = notFoundArr.map((manga) => `*${manga}* **|**`);
                const notFoundMessage = `${notFoundTitles.join(' ')}`;
    
                if (notFoundMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder({ title:`(${notFoundArr.length}) manga not found`, desc: notFoundMessage, warn: true })]});
    
                } else {
                    const chunks = msgSplit(notFoundMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder({ title:`(${notFoundArr.length}) manga not found`, desc: chunk, warn: true })]});
                    }
                }
            }
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try { // error manga section
            if (errArr.length > 0 ) {
                const errTitles = errArr.map((manga) => `*${manga}* **|**`);
                const errMessage = `${errTitles.join(' ')}`;
    
                if (errMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder({ title:`Encountered ${errArr.length} errors (use */help error* for more info).`, desc: errMessage, err: true })]});
    
                } else {
                    const chunks = msgSplit(errMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder({ title:`Encountered ${errArr.length} errors (use */help error* for more info).`, desc: chunk, err: true })]});
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
