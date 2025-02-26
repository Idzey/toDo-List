import Todo from "./todo";

type Task = {
    id: number | string,
    title: string,
    createdAt: string,
    updatedAt: string,
    todos: Todo[],
    color: string,
    isOpened: boolean,
}

export default Task;