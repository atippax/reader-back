
export type TaskStatus = 'success' | 'process' | 'no-work' | 'waiting'
class Task {
    private data: Record<string, any> = {}
    private error: string = ''
    private status: TaskStatus = 'no-work'
    constructor(private id: string) {
        this.status = 'waiting'
    }
    async todos(fns: (() => Promise<any>)[]) {
        this.status = 'process'
        try {
            for (const fn of fns) {
                const newData = await fn()
                const newKeys = Object.keys(newData);
                for (const newKey of newKeys) {
                    if (!this.data.hasOwnProperty(newKey)) {
                        this.data = { [newKey]: newData[newKey], ...this.data }
                    } else {
                        this.data = { ...this.data, [newKey]: [...newData[newKey], ...this.data[newKey]] }
                    }

                }
            }
        }
        catch (ex) {
            this.error = `${ex}`
        }
        this.status = 'success'

    }
    getid() {
        return this.id
    }
    getData() {
        if (this.error != '') throw new Error(this.error)
        return { data: this.data, status: this.status }
    }
}

export class TaskManager {
    private tasks: Map<string, Task> = new Map()
    private queue: Promise<void> = Promise.resolve();
    private currentQueueIndex = 0
    constructor(private maxTasks: number) { }
    private readonly TTL = 10 * 60 * 2000;
    private getnumberFormId(key: string) {
        const numberOfKey = key.split('-')
        return numberOfKey[numberOfKey.length - 1]!
    }
    private getLastkey() {
        const keys = Array.from(this.tasks.keys());
        const lastkey = keys[keys.length - 1]
        if (!lastkey) {
            return '0'
        }
        return this.getnumberFormId(lastkey)
    }
    spawnNewTask(taskType: string, fns: (() => Promise<unknown>)[]) {
        const lastKey = parseInt(this.getLastkey()!)
        const taskId = `${taskType}-${lastKey + 1}`
        const task = new Task(taskId)
        this.tasks.set(taskId, task)
        if (this.tasks.size >= this.maxTasks) {
            const firstKey = this.tasks.keys().next().value;
            if (firstKey) {
                this.tasks.delete(firstKey);
            }
        }
        this.queue = this.queue.then(async () => {
            this.currentQueueIndex = lastKey
            try {

                await task.todos(fns)
            }
            catch (ex) {
                console.error('background process :\n' + ex)
            }
            setTimeout(() => {
                this.killTask(taskId);
            }, this.TTL);
        });
        return task.getid()
    }
    killTask(id: string) {
        this.tasks.delete(id)
    }
    getTaskId(id: string) {
        const task = this.tasks.get(id)
        if (!task) throw new Error('not found')
        const clientQueue = parseInt(this.getnumberFormId(id))
        if (this.currentQueueIndex >= clientQueue) {
            return { ...task.getData(), waiting: `${0} queues` }
        }
        return { ...task.getData(), waiting: `${clientQueue - this.currentQueueIndex} queues` }
    }
}