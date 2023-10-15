import * as MD from 'mangadex-full-api';
import getError from "../../../../utils/get-error";

type batchType = {
    title: string,
    id: string,
}[];

type mangaArrType = {
    title: string,
    mdChapter: number | null,
    latestChapter: number | null,
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
                    mdChapter: parseFloat(res.chapter),
                    latestChapter: null,
                });
            }
        }));
        
        return {mangaArr, resErrArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

export default processBatch;