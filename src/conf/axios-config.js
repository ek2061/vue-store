import axios from "axios";

import {
    handleRequest,
    handleRequestError
} from "@/misc/interceptors/axios-request-interceptor";
import {
    handleResponse,
    handleResponseError
} from "@/misc/interceptors/axios-response-interceptor";

// AXIOS預設值註冊 -------------------------------------------------------------------------------------------------
/** Request預設timeout時間(毫秒) */
axios.defaults.timeout = process.env.VUE_APP_AXIOS_DEFAULT_TIMEOUT * 1000;
/** 跨域是否夾帶cookie */
axios.defaults.withCredentials = process.env.VUE_APP_AXIOS_WITH_CREDENTIALS;
/** AXIOS BASE URL  */
axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL;

/* 關閉vue-devtools */
// Vue.config.devtools = false;

// 欄截器註冊 ------------------------------------------------------------------------------------------------------
/** 註冊HTTP Request Interceptor */
axios.interceptors.request.use(handleRequest, handleRequestError);
/** 註冊HTTP Response Interceptor */
axios.interceptors.response.use(handleResponse, handleResponseError);