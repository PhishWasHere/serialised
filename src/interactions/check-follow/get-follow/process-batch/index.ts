import * as MD from 'mangadex-full-api';
import getError from "../../../../utils/get-error";
import fsCheck from "../../../../utils/fs-object-check";

type batchType = {
    title: string,
    id: string,
}[];

type mangaArrType = {
    title: string,
    latestChapter: number,
}[];

const processBatch = async (batch: batchType) => {
    try {
        let mangaArr: mangaArrType = [];
        let resErrArr: string[] = [];

        await Promise.all(batch.map(async (manga) => {
            const res = (await MD.Manga.getFeed(manga.id, {translatedLanguage: ['en'], order: {chapter: 'desc'}}))[0];

            if (!res || res.chapter === '' || res.chapter === undefined) {
                resErrArr.push(manga.title);
            } else {
                mangaArr.push({
                    title: manga.title,
                    latestChapter: parseFloat(res.chapter),
                });
            }
        }));
        //await fsCheck(resErrArr);
        return {mangaArr, resErrArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

export default processBatch;