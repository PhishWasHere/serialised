import getError from '../../utils/get-error';
import { ModalSubmitInteraction } from 'discord.js';
import { getFollow } from './get-follow';
import embedBuilder from '../../utils/discord/embed';
import msgSplit from '../../utils/msg-split';
import User from '../../model';

const msgLen = 1800; // max length of a discord message
export const getFollowCmd = async (username: string, password: string, i: ModalSubmitInteraction) => {
    try{
        const user_id = i.user.id;
        await getFollow(username, password, user_id);

        const res = await User.findOne({ user_id });

        if (!res ) {
            return i.editReply({
                embeds: [
                    embedBuilder({
                        title: 'Error!',
                        desc: 'Something went wrong',
                        err: true,
                    }),
                ],
            });
        }

        const { not_updated_list, error_list, not_found_list, follow_list } = res;

        const count = follow_list.length;

        await i.editReply({
            embeds: [
                embedBuilder({
                    title: 'Done!',
                    desc: `Checked ${count} manga's for updates.`,
                }),
            ],
        });
       
        try { // not updated manga section
            if (not_updated_list.length > 0 ) {
                const notUpdatedTitles = not_updated_list.map((manga) => `*${manga.title} - Chapter ${manga.latest_chapter}* |`); // *title - chapter* into string array
                const notUpdatedMessage = `**The following manga are not updated on MangaDex**: ${notUpdatedTitles.join(' ')}`; // join the string array into a single string
    
                if (notUpdatedMessage.length <= msgLen) { // if the string is less than 1800 characters
                    await i.followUp({embeds: [embedBuilder({ title:`Not Updated (${not_updated_list.length})`, desc: notUpdatedMessage, other: true })]}); // send the message
                } else { // else
                    const chunks = msgSplit(notUpdatedMessage, msgLen); // split the string into chunks of 1800 characters
    
                    for (const chunk of chunks) { // for each chunk
                        await i.followUp({embeds: [embedBuilder({ title: `Not Updated (${not_updated_list.length})`, desc: chunk, other: true })]}); // send the message
                    }
                }
            } else {
                await i.followUp({embeds: [embedBuilder({ title: 'Mangas Updated', desc: 'All Mangas thay you follow are being updated on MangaDex', success: true })]});
            }
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try { // not found manga section
            if (not_found_list.length > 0 ) {
                const notFoundTitles = not_found_list.map((manga) => `*${manga.title}* |`);
                const notFoundMessage = `${notFoundTitles.join(' ')}`;
    
                if (notFoundMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder({ title:`(${not_found_list.length}) manga not found`, desc: notFoundMessage, warn: true })]});
    
                } else {
                    const chunks = msgSplit(notFoundMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder({ title:`(${not_found_list.length}) manga not found`, desc: chunk, warn: true })]});
                    }
                }
            }
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try { // error manga section
            if (error_list.length > 0 ) {
                const errTitles = error_list.map((manga) => `*${manga.title}* |`);
                const errMessage = `${errTitles.join(' ')}`;
    
                if (errMessage.length <= msgLen) {
                    await i.followUp({embeds: [embedBuilder({ title:`Encountered ${error_list.length} errors (use */help error* for more info).`, desc: errMessage, err: true })]});
    
                } else {
                    const chunks = msgSplit(errMessage, msgLen);
    
                    for (const chunk of chunks) {
                        await i.followUp({embeds: [embedBuilder({ title:`Encountered ${error_list.length} errors (use */help error* for more info).`, desc: chunk, err: true })]});
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
