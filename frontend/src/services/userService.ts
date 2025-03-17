import axios from "axios";

const baseURL = 'http://localhost:3000/api/users';

const signupUser = async ({ username, password, email }: { username: string, email: string, password: string }) => {
    const response = await axios.post(`${baseURL}/signup`, { username, email, password });

    return response.data;
}

const loginUser = async ({ email, password }: { email: string, password: string }) => {
    const response = await axios.post(`${baseURL}/login`, { email, password });
    return response.data;
}

const loginUserForToken = async () => {
    const response = await axios.get(`${baseURL}/loginToken`);

    return response.data;
}

const verifyEmail = async (token: string) => {
    await axios.get(`${baseURL}/verifyEmail/${token}`);
};

const logoutUser = async () => {
    await axios.get(`${baseURL}/logout`);
};

const refreshUserToken = async () => {
    try {
        await axios.get(`${baseURL}/refresh`);
        return true;
    } catch {
        return false
    }
};

export default {
    loginUser,
    signupUser,
    loginUserForToken,
    logoutUser,
    verifyEmail,
    refreshUserToken
}