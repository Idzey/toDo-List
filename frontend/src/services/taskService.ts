import axios from 'axios';
import Tasks from '../types/tasks';
import Task from '../types/task';

const baseURL = 'http://localhost:3000/api/tasks';

let token: string | null = null;

const setToken = (newToken: string) => {
    token = newToken;
};

const getAll = async () => {
    const response = await axios.get(baseURL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data: Tasks = await response.data;

    return data;
};

const getTask = async (id: string) => {
    const response = await axios.get(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data: Task = await response.data;

    return data;
};

const createTask = async (task: Task) => {
    if (!token) return null;
    const response = await axios.post(baseURL, {...task}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data: Task = await response.data;
 
    return data;
};

const deleteTask = async (id: string | number) => {
    if (!token) return null;
    await axios.delete(`${baseURL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

const updateTask = async (id: string | number, updatedTask: any) => {
    if (!token) return null;
    const response = await axios.put(`${baseURL}/${id}`, updatedTask, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data: Task = await response.data;

    return data;
}

export default {
    getAll,
    getTask,
    createTask,
    deleteTask,
    updateTask,
    setToken
}