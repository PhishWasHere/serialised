import getError from '../../../utils/get-error';
import * as MD from 'mangadex-full-api';
import { compareChapter } from '../compare-follow';
import batchManga from './batch-manga';
import processBatch from './process-batch';
import User from '../../../model';

export const getFollow= async (username: string, password: string, user_id: string) => {
    try{
        try{ // if login fails, return an error
            await MD.login(username, password);      
        } catch (err) {
            return await User.findOneAndUpdate({user_id}, { error: 'Failed to login to MangaDex' });
        }
        
        const dataArr = (await MD.Manga.getFollowedManga((300))).map((manga) => ({ // limited to 300 manga
            title: manga.title,
            id: manga.id,
            })
        );
        const batches = await batchManga(dataArr);

        await processBatch(batches, user_id);

        const comparedArr = await compareChapter(user_id);

        return comparedArr;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
