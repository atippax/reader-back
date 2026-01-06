
export type TaskStatus = 'success' | 'process' | 'no-work'
class Task<T> {
    private data: T[] = []
    private error: string = ''
    private status: TaskStatus = 'no-work'
    constructor(private id: string) {
    }
    async todos(fns: (() => Promise<T[]>)[]) {
        this.status = 'process'
        try {
            for (const fn of fns) {
                this.data = [...this.data, ...await fn()]
            }
        }
        catch (ex) {
            this.error = `${ex}`
        }
        this.status = 'success'

    }
    setStatus(status: TaskStatus) {
        this.status = status
    }

    getid() {
        return this.id
    }
    setError(error: string) {
        this.error = error
        this.setStatus('success')
    }
    getData() {
        if (this.error != '') throw new Error(this.error)
        return { data: this.data, status: this.status }
    }
}

export class TaskManager {
    private tasks: Task<unknown>[] = []
    spawnNewTask(taskType: string, fns: (() => Promise<unknown[]>)[]) {
        const task = new Task(`${taskType}-${this.tasks.length + 1}`)
        this.tasks.push(task)
        task.todos(fns)
        return task.getid()
    }
    killTask(id: string) {
        const task = this.getTaskId(id)
        this.tasks = this.tasks.filter(f => f != task)
    }
    getTaskId(id: string) {
        const task = this.tasks.find(x => x.getid() == id)
        return task
    }
}