import axios from "axios";

const baseURL = 'http://localhost:3000/api';

const loginUser = async ({username, password}: {username: string, password: string}) => {
    const response = await axios.post(`${baseURL}/users`, {username, password});

    return response.data;
}

const signupUser = async ({username, token, password}: {token?:string, username?: string, password?: string}) => {
    const response = await axios.post(`${baseURL}/login`, {username, password, token});

    return response.data;
}

export default {
    loginUser,
    signupUser
}