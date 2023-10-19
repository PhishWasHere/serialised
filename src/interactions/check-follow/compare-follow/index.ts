import getError from '../../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import getChapterNumber from '../../../utils/get-chapter-num';
import User from '../../../model';

const scraper = new Manganato();

type ManganatoManga = {
    title: string;
    url: string;
    authors: string[];
    updatedAt: Date;
    views: string;
    coverImage: string;
}

export const compareChapter = async (user_id: string) => {
    try { 
        const userData = await User.findOne({ user_id });

        if (!userData) return ({ err: 'User not found' });
        
        const { follow_list, updated_list, not_found_list, not_updated_list, error_list } = userData;

        try { // get latest chapter from manganato
            await Promise.all(follow_list.map(async (manga) => {
                const res: ManganatoManga[] = await scraper.search(manga.title); // search for manga

                if (!res || res.length === 0) {
                    return not_found_list.push({ title: manga.title });
                }
                const scraperManga = await scraper.getMangaMeta(res[0].url); // get manga meta (chapter name)

                if (scraperManga.chapters[0] && scraperManga.chapters[0].name) { // if chapter name exists
                    const latestChapter = await getChapterNumber(scraperManga.chapters[0].name); // get chapter number
                    if (latestChapter === null || isNaN(latestChapter)) {
                        console.error(`\x1b[31m> Failed to get chapter number for ${manga.title}\x1b[0m`);
                    } 

                    if (manga.md_chapter === null && latestChapter=== null) { // sorting statement
                        not_found_list.push({ title: manga.title });
                    } else if (manga.md_chapter! < latestChapter!) {
                        not_updated_list.push({ title: manga.title, latest_chapter: latestChapter! });
                    } else if (manga.md_chapter! >= latestChapter!) {
                        updated_list.push({ title: manga.title, latest_chapter: latestChapter! });
                    } else {
                        error_list.push({ title: manga.title });
                    }
                } else {
                    error_list.push({ title: manga.title });
                }
            }));
            
            await userData.save();
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}