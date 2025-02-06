import axios from 'axios';
import Comment from '../types/comment';

const baseURL = 'http://localhost:3000/api/comments';


const getComment = async (id: string) => {
    const response = await axios.get(`${baseURL}/${id}`);
    const data: Comment = await response.data;

    return data;
};

const createComment = async ({content, taskId}: {content: string, taskId: string | number}) => {
    const response = await axios.post(baseURL, {content, taskId});

    const data: Comment = await response.data;

    return data;
};

const deleteComment = async (id: string | number) => {
    await axios.delete(`${baseURL}/${id}`);
}

export default {
    getComment,
    createComment,
    deleteComment
}