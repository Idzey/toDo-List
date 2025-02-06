import axios from 'axios';
import Tasks from '../types/tasks';
import Task from '../types/task';

const baseURL = 'http://localhost:3000/api/tasks';

const getAll = async () => {
    const response = await axios.get(baseURL);
    const data: Tasks = await response.data;

    return data;
};

const getTask = async (id: string) => {
    const response = await axios.get(`${baseURL}/${id}`);
    const data: Task = await response.data;

    return data;
};

const createTask = async (task: Task) => {
    const response = await axios.post(baseURL, {...task});

    const data: Task = await response.data;

    return data;
};

const deleteTask = async (id: string | number) => {
    await axios.delete(`${baseURL}/${id}`);
}

const updateTask = async (id: string | number, updatedTask: any) => {
    const response = await axios.put(`${baseURL}/${id}`, updatedTask);
    const data: Task = await response.data;

    return data;
}

export default {
    getAll,
    getTask,
    createTask,
    deleteTask,
    updateTask
}