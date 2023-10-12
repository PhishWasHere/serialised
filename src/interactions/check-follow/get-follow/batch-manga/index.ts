import getError from "../../../../utils/get-error";
import fsCheck from "../../../../utils/fs-object-check";

type dataArrType = {
    title: string,
    id: string,
}[];

type batchType = {
    title: string,
    id: string,
}[];

const batchManga = async (dataArr: dataArrType) => {
    try {
        const batchSize = 30;

        let batches: batchType = [];

        let i = 0, len = dataArr.length;
        
        while (i < len) {
            const batch = dataArr.slice(i, i + batchSize);
            batches.push(...batch); // spread the batch array into batches
            i += batchSize;
        }

        return batches;

    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
};

export default batchManga;