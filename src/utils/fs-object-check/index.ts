import fs from 'fs';
import path from 'path';
import getError from '../get-error';

const fsCheck = async (index: object) => {
    try {
        console.log('Writing to file');
        console.log(index);
        
        
        const filePath = path.join(__dirname, 'followArr.json');
        const content = JSON.stringify(index, null, 2);
        fs.writeFile(filePath, content , 'utf8', (err) => {
            if (err) {
                const errMsg = getError(err);
                throw new Error(errMsg);
            }
        });
        console.log('File written successfully\n');
    } catch (err) {
        const errMsg = getError(err);
        throw new Error(errMsg);
    }
}

export default fsCheck;

