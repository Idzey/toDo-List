import Comment from "./comment";

type Task = {
    id: number,
    title: string,
    completed: boolean,
    createdAt: string,
    updatedAt: string,
    comments: Comment[],
    date: Date
}

export default Task;