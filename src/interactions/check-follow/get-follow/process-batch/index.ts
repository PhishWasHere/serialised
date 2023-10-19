import * as MD from 'mangadex-full-api';
import getError from "../../../../utils/get-error";
import { mangaArrType } from '../../../../utils/types';
import User from '../../../../model';

type batchType = {
    title: string,
    id: string,
}[];

type resErrArrType = {
    title: string,
}[];

const processBatch = async (batch: batchType, user_id: string) => {
    try {
        let mangaArr: mangaArrType = [];
        let resErrArr: resErrArrType = [];

        await Promise.all(batch.map(async (manga) => {
            const res = (await MD.Manga.getFeed(manga.id, {translatedLanguage: ['en'], order: {chapter: 'desc'}}))[0];

            if (!res || res.chapter === '' || res.chapter === undefined || isNaN(Number(res.chapter))) {
                resErrArr.push({ title: manga.title });                
            } else {                
                mangaArr.push({
                    title: manga.title,
                    md_chapter: parseFloat(res.chapter),
                    latest_chapter: null,
                });
            }
        }));
        
        try {            
            await User.findOneAndUpdate(
                { user_id }, 
                { follow_list: mangaArr, error_list: resErrArr},
            );
        } catch (err) {
            const errMsg = getError(err);
            return ({ err: errMsg });
        }
        return {mangaArr, resErrArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

export default processBatch;