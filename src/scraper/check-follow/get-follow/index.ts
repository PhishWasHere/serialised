import getError from '../../../utils/get-error';
import * as MD from 'mangadex-full-api';
import { compareChapter } from '../compare-follow';

export const getFollow = async (username: string, password: string) => {
    try{
        await MD.login(username, password);

        const mangaArr = (await MD.Manga.getFollowedManga((Infinity))).map((manga) => ({
            title: manga.title,
            latestChapter: manga.lastChapter
            })
        );
        const comparedArr = await compareChapter(mangaArr);
        
        return comparedArr;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
