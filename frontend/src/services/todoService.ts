import axios from 'axios';
import Todo from '../types/todo';

const baseURL = 'http://localhost:3000/api/todos';


const getTodo = async (id: string) => {
    const response = await axios.get(`${baseURL}/${id}`);
    const data: Todo = await response.data;

    return data;
};

const createTodo = async ({name, taskId}: {name: string, taskId: string | number}) => {
    const response = await axios.post(baseURL, {name, taskId});

    const data: Todo = await response.data;

    return data;
};

const updateTodo = async (id: string | number, updatedTodo: any) => {
    const response = await axios.put(`${baseURL}/${id}`, updatedTodo);

    const data: Todo = await response.data;

    return data;
};

const deleteTodo = async (id: string | number) => {
    await axios.delete(`${baseURL}/${id}`);
}

export default {
    getTodo,
    updateTodo,
    createTodo,
    deleteTodo,
}