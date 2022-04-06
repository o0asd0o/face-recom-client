import axios from "axios";
import { toast } from "react-toastify";

export const post = (endpoint: string, body: Record<string, any>) => {
    return axios
        .post(`${import.meta.env.VITE_CLOUD_FUNCTION_URL}${endpoint}`, body)
        .catch((e) => {
            toast.error(
                e.message ?? 'Encountered error while processing the request'
            );
            throw e;
        });
};

export const get = (endpoint: string, params: Record<string, any>) => {
    return axios
        .get(`${import.meta.env.VITE_CLOUD_FUNCTION_URL}${endpoint}`, { params: params })
        .catch((e) => {
            toast.error(
                e.message ?? 'Encountered error while processing the request'
            );
            throw e;
        });
}

const http = { get, post }

export default http;