import multer from "multer";
import express, {
  type Request,
  type Response,
} from "express";
import { parseImageToText } from "../../../services/ocr";
import type { TaskManager } from "../../../services/task/task";



export default function imageProcessRoute(taskManager: TaskManager, doAfterOcr: (text: string) => unknown) {
  const app = express();
  const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
  }).array("images", 5);
  function imageHandler(req: Request, res: Response) {
    return upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err.message);
        return res.status(400).send(`Multer Error: ${err.message}`);
      } else if (err) {
        console.error("Unknown Error:", err);
        return res.status(500).send("An unknown error occurred during upload.");
      }
      const files = (req as any).files as Express.Multer.File[]; // Multer จะเพิ่ม 'files' เข้าไปใน Request
      if (!files || files.length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      console.log('found image file :', files.length)
      const todos: (() => Promise<unknown>)[] = []
      for (const file of files) {
        todos.push(async () => {
          const text = await parseImageToText(file.buffer)
          return doAfterOcr(text)
        })
      }
      const taskId = taskManager.spawnNewTask(req.baseUrl.replace('/', ''), todos)
      res.json({ taskId, ...taskManager.getTaskId(taskId) })
    })

  }
  app.post('/image-process', imageHandler);
  return app
}
