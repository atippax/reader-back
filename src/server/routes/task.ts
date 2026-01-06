
import express from "express";
import { TaskManager } from "../../services/task/task";

export default function taskRoute(taskManager: TaskManager) {
    const app = express();
    const subApp = express()
    subApp.get('/', (req, res) => {
        res.send('it a task controller')
    })
    subApp.get('/:taskId', (req, res) => {
        const { taskId } = req.params
        const task = taskManager.getTaskId(taskId)
        return res.json(task)
    })
    app.use('/task', subApp)
    return app
}
