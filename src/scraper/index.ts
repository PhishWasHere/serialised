import getError from '../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../utils/get-chapter-num';
import { Interaction } from 'discord.js';

const scraper = new Manganato();

const interactionError = (error?: string) => {
    if (error) {
        return {
            title: 'Error',
            description: error,
            color: 'RED',
        };
    };
    return {
        title: 'Manga not found',
        description: 'Please check for typos and try again',
        color: 'RED',
    };
}

export const getSingle = async (interaction: Interaction, title: any) => {
    return console.log(title);
    
    try {
        const res = (await scraper.search(title))[0];
        if (!res) {
            return interactionError();
        }        
        const chapter = (await scraper.getMangaMeta(res.url)).chapters[0].name;
        const scraperNum = await getChapterNumber(chapter);

        const mdNum = (await MD.Manga.getByQuery({
            title: title,
            limit: 1,
            availableTranslatedLanguage: ['en'],
        })).lastChapter;

        switch (true) {
            case !mdNum:
                interactionError('Manga not found on MangaDex')
            break;
    
            case mdNum == scraperNum:

            break;

            case mdNum > scraperNum:

            break;

            case mdNum < scraperNum:

            break;

            default:
            break;
        };
        
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};
