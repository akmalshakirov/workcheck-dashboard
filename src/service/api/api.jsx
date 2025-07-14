import axios from "axios";
import { UNSAFE_createBrowserHistory } from "react-router-dom";
import { baseURL } from "../../App";

const history = UNSAFE_createBrowserHistory();

const api = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);
