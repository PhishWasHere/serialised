import getError from '../../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import getChapterNumber from '../../../utils/get-chapter-num';
import { mangaArrType } from '../../../utils/types';
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

        if (!userData) {
            return ({ err: 'User not found' });
        }
        const { follow_list, updated_list, not_found_list, not_updated_list, error_list } = userData;

        try { // get latest chapter from manganato
            await Promise.all(follow_list.map(async (manga) => {
                const res: ManganatoManga[] = await scraper.search(manga.title);

                if (!res || res.length === 0) {
                    return not_found_list.push({ title: manga.title });
                }
                const scraperManga = await scraper.getMangaMeta(res[0].url);

                if (scraperManga.chapters[0] && scraperManga.chapters[0].name) {
                    const latestChapter = await getChapterNumber(scraperManga.chapters[0].name);
                    if (latestChapter === null || isNaN(latestChapter)) {
                        console.log(`\x1b[31m> Failed to get chapter number for ${manga.title}\x1b[0m`);
                    } 
                    console.log("Before update:", manga.latest_chapter);
                    manga.latest_chapter = latestChapter || undefined;                    
                    console.log("After update:", manga.latest_chapter);

                    if (manga.md_chapter === null && latestChapter=== null) {
                        not_found_list.push({ title: manga.title });
                    } else if (manga.md_chapter! < latestChapter!) {
                        not_updated_list.push({ title: manga.title, latest_chapter: latestChapter! });
                    } else if (manga.md_chapter! >= latestChapter!) {
                        updated_list.push({ title: manga.title, latest_chapter: latestChapter! });
                    } else {
                        error_list.push({ title: manga.title });
                    }

                    // follow_list.push({ title: manga.title, md_chapter: manga.md_chapter || undefined, latest_chapter: latestChapter || undefined });
                } else {
                    error_list.push({ title: manga.title });
                }
            }));
            
            await userData.save();
        } catch (err) {
            const errMsg = getError(err);
            throw new Error(errMsg);
        }
       
        // try { // compare latest chapter from manganato with mangadex
        //     await Promise.all(follow_list.map(async (manga) => {
        //         if (manga.md_chapter === null && manga.latest_chapter === null) {
        //             not_found_list.push({ title: manga.title });
        //         } else if (manga.md_chapter! < manga.latest_chapter!) {
        //             not_updated_list.push({ title: manga.title, latest_chapter: manga.latest_chapter! });
        //         } else if (manga.md_chapter! >= manga.latest_chapter!) {
        //             updated_list.push({ title: manga.title, latest_chapter: manga.latest_chapter! });
        //         } else {
        //             error_list.push({ title: manga.title });
        //         }
        //     }));
        //     await userData.save();
        // } catch (err) {
        //     const errMsg = getError(err);
        //     throw new Error(errMsg);
        // }

        // return;

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}