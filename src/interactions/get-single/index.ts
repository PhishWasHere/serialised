import getError from '../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../../utils/get-chapter-num';

const scraper = new Manganato();

export const getSingleCmd = async (title: string) => {    
    try {
        const res = (await scraper.search(title))[0]; // returns object with title, url, and image
        
        if (!res) {
            return {title: `${title} not found`, description: 'Please check for typos and try again', err: true};
        }
        
        const manga = (await scraper.getMangaMeta(res.url)).chapters[0].name; // returns the first chapter of the manga
        
        const mangaTitle = (await scraper.getMangaMeta(res.url)).title.main; // returns the title of the manga
        const mangaImage = (await scraper.getMangaMeta(res.url)).coverImage; // returns the image of the manga

        const scraperNum = await getChapterNumber(manga); // helper function to return the chapter number from the chapter name
        
        if (!scraperNum) {
            return {title: `Chapters for ${title} not found`, description: 'Cannot get the latest chapter from Manganato.', warn : true};
        }
         
        const mangaId = (await MD.Manga.getByQuery({ // returns manga id from MangaDex
            title: title,
            limit: 1,
            availableTranslatedLanguage: ['en'],
        })).id;
        
        const mdNum = parseFloat((await MD.Manga.getFeed(mangaId, {translatedLanguage: ['en'], order: {chapter: 'desc'}}))[0].chapter); // returns the latest chapter from MangaDex

        switch (true) {
            case !mangaId:
                return {title: `${mangaTitle} not found`, description: 'The manga was not found on MangaDex. Please check for typos and try again', image: mangaImage, err: true};
            break;
    
            case !mdNum:
                return {title: `Chapters for ${mangaTitle} not found`, description: `The latest chapter is chapter: ${scraperNum}. Cannot get the latest chapter from MangaDex.`, image: mangaImage, warn : true};
            break;

            case mdNum == scraperNum:
                return {title: `${mangaTitle} is updated`, description: `This manga is being updated, the latest chapter is ${mdNum}`, image: mangaImage, success: true};
            break;

            case mdNum > scraperNum:
                return {title: `${mangaTitle} is updated`, description: `This manga is being updated, the latest chapter is ${mdNum}`, image: mangaImage, success: true};
            break;

            case mdNum < scraperNum:
                return {title: `${mangaTitle} is not updated`, description: `This manga is not being updated, the latest chapter is chapter: ${scraperNum}`, image: mangaImage, warn: true};
            break;

            default:
                return {title: 'Error', description: 'Something went wrong', err: true};
            break;
        };
        
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
