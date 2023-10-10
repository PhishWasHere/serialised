import getError from '../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../../utils/get-chapter-num';

const scraper = new Manganato();

export const getFollow = async (username: string, password: string) => {
    try{         
        await MD.login(username, password);

        const mangaArr = (await MD.Manga.getFollowedManga((Infinity))).map((manga) => ({
            title: manga.title,
            latestChapter: manga.lastChapter
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
    latestChapter: string | null,
}[];

type ManganatoManga = {
    title: string;
    url: string;
    authors: string[];
    updatedAt: Date;
    views: string;
    coverImage: string;
}
 
const compareChapter = async (mangaArr: mangaArrType) => {
    try {
        let errArr:string[] = []; // manga that couldnt be found, or contained some err (eg: no latest chapter)
        let returnArr:mangaArrType = []; // manga that could be found
        let resArr: object[] = []; // return object after comparison 


        let test:any[] = [];
        try {
            await Promise.all(mangaArr.map(async (manga) => {
                const res: ManganatoManga[] = await scraper.search(manga.title);
    
                if (!res || res.length === 0) {
                    return errArr.push(manga.title);
                }
            
                const scraperManga = (await scraper.getMangaMeta(res[0].url));

                const title = scraperManga.title.main;
                
                if (scraperManga.chapters[0] && scraperManga.chapters[0].name) {
                    const latestChapter = await getChapterNumber(scraperManga.chapters[0].name);
                    if (!latestChapter) {
                        return errArr.push(manga.title);
                    }
                    returnArr.push({ title, latestChapter });
                } else {
                    return errArr.push(manga.title);
                }
            }));        
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        try {
            await Promise.all(returnArr.map(async (manga) => { 
                switch (true) {
                    case !manga.latestChapter || manga.latestChapter === '' || manga.latestChapter === null:
                        errArr.push(manga.title);
                        return
                    break;
    
                    case manga.latestChapter != null && manga.latestChapter >= manga.latestChapter:
                        resArr.push({title: manga.title, latestChapter: manga.latestChapter, success: true});
                        return;
                    break;
    
                    case manga.latestChapter != null && manga.latestChapter < manga.latestChapter:
                        resArr.push({title: manga.title, latestChapter: manga.latestChapter, warn: true});
                        return;
                    break;
    
                    default:
                        errArr.push(manga.title);
                        return
                    break;
                }
            }));
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }
        
        return {resArr, errArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}