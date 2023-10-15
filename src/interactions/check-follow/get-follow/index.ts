import getError from '../../../utils/get-error';
import * as MD from 'mangadex-full-api';
import { compareChapter } from '../compare-follow';
import batchManga from './batch-manga';
import processBatch from './process-batch';
import fsCheck from '../../../utils/fs-object-check';


type mangaArrType = {
    title: string,
    mdChapter: number | null,
    latestChapter: number | null,
}[];

export const getFollow= async (username: string, password: string) => {
    try{
        try{
            await MD.login(username, password);
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        // const t = (await MD.Manga.getFollowedManga((Infinity))
        // );
        // await fsCheck(t);
        const dataArr = (await MD.Manga.getFollowedManga((Infinity))).map((manga) => ({
            title: manga.title,
            id: manga.id,
            })
        );
        const batches = await batchManga(dataArr);

        const { mangaArr, resErrArr } = await processBatch(batches);

        const comparedArr = await compareChapter(mangaArr, resErrArr);

        return comparedArr;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};