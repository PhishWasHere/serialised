import getError from '../../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import getChapterNumber from '../../../utils/get-chapter-num';
const scraper = new Manganato();

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
 
export const compareChapter = async (mangaArr: mangaArrType) => {
    try {
    
        let errArr:string[] = []; // manga that couldnt be found, or contained some err (eg: no latest chapter)
        let returnArr:mangaArrType = []; // manga that could be found

        let updatedArr: mangaArrType = []; // return object after comparison 
        let notUpdatedArr: mangaArrType = []; // return object after comparison

        try { // get latest chapter from manganato
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

        try { // compare latest chapter from manganato with mangadex
            await Promise.all(returnArr.map(async (manga) => { 
                switch (true) {
                    case !manga.latestChapter || manga.latestChapter === '' || manga.latestChapter === null:
                        errArr.push(manga.title);
                        return
                    break;
    
                    case manga.latestChapter != null && manga.latestChapter >= manga.latestChapter:
                        updatedArr.push({title: manga.title, latestChapter: manga.latestChapter});
                        return;
                    break;
    
                    case manga.latestChapter != null && manga.latestChapter < manga.latestChapter:
                        notUpdatedArr.push({title: manga.title, latestChapter: manga.latestChapter});
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
        
        return {updatedArr, notUpdatedArr, errArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}