import getError from "../get-error";

// returns the chapter number from the chapter name
const getChapterNumber = (async (chapter: string) => {
    try {
        const regex = /\bChapter\s*(\d+(\.\d+)?)\b/i; // matches chapter number, will accept: Chapter 1, Chapter 1.5, Chapter 1.5.1, Manga name really long name Chapter 69, etc.
        const match = chapter.match(regex);
        if (!match) {
            return null
        }

        const chapterNumber = match[1];
        return chapterNumber;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
});

export default getChapterNumber;