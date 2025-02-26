type Todo = {
    id: number,
    name: string,
    completed: boolean,
    createdAt: string,
    updatedAt: string,
    user: string | number,
    taskId: number | string,
};

export default Todo;