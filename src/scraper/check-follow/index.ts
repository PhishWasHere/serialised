import getError from '../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../../utils/get-chapter-num';

const scraper = new Manganato();

export const getFollow = async (username: string, password: string) => {
    try{         
        await MD.login(username, password);

        const mangaArr = (await MD.Manga.getFollowedManga()).map((manga) => ({
            title: manga.title,
            lastChapter: manga.lastChapter
            })
        );

        const comparedArr = await compareChapter(mangaArr);

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

type mangaArrType = {
    title: string,
    lastChapter: string,
}[];

type ManganatoManga = {
    title: string;
    url: string;
    authors: string[];
    updatedAt: Date;
    views: string;
    coverImage: string;
}
 
const compareChapter = async (manga: mangaArrType) => {
    try {
        let errArr:string[] = [];
        let returnArr:mangaArrType = [];

        await Promise.all(manga.map(async (manga) => {
            const res: ManganatoManga[] = await scraper.search(manga.title);
            if (!res || res.length === 0) {
                return errArr.push(manga.title);
            }
        
            const scraperManga = (await scraper.getMangaMeta(res[0].url));
            
            const title = scraperManga.title.main;
            const chapterName = scraperManga.chapters[0].name;
        
            returnArr.push({title, lastChapter: chapterName});
        }));

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}