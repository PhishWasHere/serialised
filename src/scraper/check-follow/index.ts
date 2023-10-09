import getError from '../../utils/get-error';
import { Manganato } from '@specify_/mangascraper'
import * as MD from 'mangadex-full-api';
import getChapterNumber from '../../utils/get-chapter-num';

const scraper = new Manganato();

export const getFollow = async (title: string) => {
    try{

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}