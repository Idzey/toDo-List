import axios from 'axios';
import { TCalendarTodo } from '../types/calendar';

const baseURL = `${import.meta.env.VITE_API_URL}/calendar`;

const getAll = async () => {
    const response = await axios.get(baseURL);
    const data: TCalendarTodo[] = await response.data;

    return data;
};

const getCalendar = async (id: string) => {
    const response = await axios.get(`${baseURL}/${id}`);
    const data: TCalendarTodo = await response.data;

    return data;
};

const createCalendar = async ({name, taskId}: {name: string, taskId: string | number}) => {
    const response = await axios.post(baseURL, {name, taskId});

    const data: TCalendarTodo = await response.data;

    return data;
};

const updateCalendar = async (id: string | number, updatedTodo: any) => {
    const response = await axios.put(`${baseURL}/${id}`, updatedTodo);

    const data: TCalendarTodo = await response.data;

    return data;
};

const deleteCalendar = async (id: string | number) => {
    await axios.delete(`${baseURL}/${id}`);
}

export default {
    getAll,
    getCalendar,
    createCalendar,
    updateCalendar,
    deleteCalendar,
}