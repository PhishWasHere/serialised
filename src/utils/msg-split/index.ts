import getError from "../get-error";

const msgSplit = (message: string, maxLength: number) => {
    try {
        const chunks = [];
        const parts = message.split('|');
        
        let currentChunk = '';
        for (const part of parts) {
            if ((currentChunk.length + part.length + 1) <= maxLength) {
                // If adding this part doesn't exceed the maxLength, add it to the current chunk
                if (currentChunk.length > 0) {
                    currentChunk += '|'; // Add separator if needed
                }
                currentChunk += part;
            } else {
                // If adding this part exceeds the maxLength, start a new chunk
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk);
                }
                currentChunk = part;
            }
        }
        
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }
        
        return chunks;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}

export default msgSplit;