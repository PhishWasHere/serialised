import getError from "../get-error";

const msgSplit = (message: string, maxLength: number) => {
    try {
        const chunks = [];
        while (message.length > maxLength) {
            const chunk = message.substring(0, maxLength);
            chunks.push(chunk);
            message = message.substring(maxLength);
        }
        
        chunks.push(message); 
        return chunks;
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}

export default msgSplit;