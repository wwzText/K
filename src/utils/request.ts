import axios from 'axios';
import { Notify } from 'vant';
declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> { }
}

const Request = axios.create({
    baseURL: "https://api.gbcblock.com/api/",
    // timeout: 6000
});

declare interface Data {
    [propName: string]: any;
}
// GET 请求拼接参数
const getParam = (url: string, data?: Data) => {
    for (let key in data) {
        if (!url.includes('?')) {
            url += `?${key}=${data[key]}`
        } else {
            url += `&${key}=${data[key]}`
        }
    }
    return url
}

Request.interceptors.request.use((config) => {

    if (config.method === 'get') {
        config.url = getParam(config.url as string, config.data)
    }
    config['headers'] = {
        "Content-Type": "multipart/form-data"
    }
    return config
});

Request.interceptors.response.use((response) => {
    if (response.data.status === 1) {
        return response.data.result
    } else {
        Notify({ type: 'danger', message: response.data.msg })
    }
})

export default Request;