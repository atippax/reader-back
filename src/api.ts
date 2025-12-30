import express, { type Express, type Request, type Response } from 'express';
import multer from 'multer'
import cors from 'cors';
import { getInvestmentJsonFormImage } from './ocr/invest_dime_slip/index.js';
import { getExchangeRate } from './ocr/exchange_rate/index.js';
import type { Log } from './ocr/share-type.js';
import { getDividendJsonFormImage } from './ocr/dividend_dime_screen_shot/index.js';
// import './test.js'
const upload = multer({
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB ต่อไฟล์
}).array('images', 5);
const app: Express = express();
const port: number = 8080;
app.use(cors());
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express with TypeScript!');
});
function imageHelper
    (req: Request, res: Response) {
    return async function (fn: (fs: Express.Multer.File[]) => Promise<Log[]>) {
        try {
            upload(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    console.error('Multer Error:', err.message);
                    return res.status(400).send(`Multer Error: ${err.message}`);
                } else if (err) {
                    console.error('Unknown Error:', err);
                    return res.status(500).send('An unknown error occurred during upload.');
                }
                const files = (req as any).files as Express.Multer.File[]; // Multer จะเพิ่ม 'files' เข้าไปใน Request
                if (!files || files.length === 0) {
                    return res.status(400).send('No files were uploaded.');
                }
                const result = await fn(files)
                res.status(200).json({
                    message: 'Files uploaded successfully!',
                    fileCount: files.length,
                    data: result.sort((x, y) => x.completionDate?.getTime()! - y.completionDate?.getTime()!)
                });
            })
        }
        catch (ex) {
            return res.status(500).send(ex)
        }
    }

}
app.post('/investment', (req: Request, res: Response) => imageHelper(req, res)(async (files) => {
    const result = []
    for (const file of files) {
        const image = file.buffer
        result.push(await getInvestmentJsonFormImage(image))
    }
    return result
}));

app.post('/dividend', (req: Request, res: Response) => imageHelper(req, res)(async (files) => {
    const result = []
    for (const file of files) {
        const image = file.buffer
        result.push(...await getDividendJsonFormImage(image))
    }
    return result
}));

app.post('/exchange-rate', (req: Request, res: Response) => imageHelper(req, res)(async (files) => {
    const result = []
    for (const file of files) {
        const image = file.buffer
        result.push(...await getExchangeRate(image))
    }
    return result
}));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});