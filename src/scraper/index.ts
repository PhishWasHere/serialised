import getError from '../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../utils/get-chapter-num';
import { Interaction } from 'discord.js';

const scraper = new Manganato();

export const getSingle = async (interaction: Interaction, title: string) => {    
    try {
        const res = (await scraper.search(title))[0];
        if (!res) {
            return {title: 'Manga not found', description: 'Please check for typos and try again', err: true};
        }
        
        const chapter = (await scraper.getMangaMeta(res.url)).chapters[0].name;
        const scraperNum = await getChapterNumber(chapter);
         
        const mdNum = (await MD.Manga.getByQuery({
            title: title,
            limit: 1,
            availableTranslatedLanguage: ['en'],
        }));
        

        switch (true) {
            case !mdNum.id:
                return {title: 'Manga not found', description: 'The manga was not found on MangaDex. Please check for typos and try again', err: true};
            break;
    
            case mdNum.lastChapter === '':
                return {title: 'Chapter not found', description: 'Cannot get the last chapter.', warn : true};
            break;

            case mdNum.lastChapter == scraperNum:
                return {title: 'Chapter is updated', description: 'This manga is being updated', success: true};
            break;

            case mdNum.lastChapter > scraperNum:
                return {title: 'Chapter is updated', description: 'This manga is being updated', success: true};
            break;

            case mdNum.lastChapter < scraperNum:
                return {title: 'Chapter is not updated', description: 'This manga is not being updated', err: true};
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