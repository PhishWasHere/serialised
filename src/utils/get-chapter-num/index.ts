import getError from "../get-error";

const getChapterNumber = (async (chapter: string) => {
    try {
        const chapterNum = chapter.split(' ');
        const chapterNumber = chapterNum[1].split('.');
        return chapterNumber[0];
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

export default getChapterNumber;