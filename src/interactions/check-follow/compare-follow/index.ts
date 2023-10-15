import getError from '../../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import getChapterNumber from '../../../utils/get-chapter-num';
import fsCheck from '../../../utils/fs-object-check';

const scraper = new Manganato();

type mangaArrType = {
    title: string,
    mdChapter?: number | null;
    latestChapter?: number | null;
}[];

type ManganatoManga = {
    title: string;
    url: string;
    authors: string[];
    updatedAt: Date;
    views: string;
    coverImage: string;
}

export const compareChapter = async (mangaArr: mangaArrType, resErrArr: string[]) => {
    try { 
        let errArr = resErrArr; // manga that couldnt be found, or contained some err (eg: no latest chapter)
        
        let updatedArr: mangaArrType = []; // return object after comparison 
        let notUpdatedArr: mangaArrType = []; // return object after comparison
        let notFoundArr: string[] = []; // manga that couldnt be found

        try { // get latest chapter from manganato
            await Promise.all(mangaArr.map(async (manga) => {
                const res: ManganatoManga[] = await scraper.search(manga.title);
    
                if (!res || res.length === 0) {
                    return notFoundArr.push(manga.title);
                }
                const scraperManga = (await scraper.getMangaMeta(res[0].url));
        
                // const title = scraperManga.title.main;
                
                if (scraperManga.chapters[0] && scraperManga.chapters[0].name) {
                    const latestChapter = await getChapterNumber(scraperManga.chapters[0].name);
                    return mangaArr.push({ title: manga.title, mdChapter: manga.mdChapter, latestChapter: latestChapter || null,});
                } else {
                    return errArr.push(manga.title);
                }
            }));
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

        let t: any[] = [];
       
        try { // compare latest chapter from manganato with mangadex
            await Promise.all(mangaArr.map(async (manga) => {
                if (manga.mdChapter === null && manga.latestChapter === null) {
                    notFoundArr.push(manga.title);
                } else if (typeof manga.mdChapter !== 'undefined' && typeof manga.mdChapter === 'number' && manga.mdChapter < (manga.latestChapter ?? 0)) {
                    notUpdatedArr.push({ title: manga.title, latestChapter: manga.latestChapter });
                } else if (typeof manga.mdChapter !== 'undefined' && typeof manga.mdChapter === 'number' && manga.mdChapter >= (manga.latestChapter ?? 0)) {
                    updatedArr.push({ title: manga.title, latestChapter: manga.latestChapter });
                } else {
                    errArr.push(manga.title);
                }
            }));
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }
        return {updatedArr, notUpdatedArr, errArr, notFoundArr};

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}