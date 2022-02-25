import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> { }
}

abstract class AbstractHttpClient {
    protected readonly instance: AxiosInstance;
    protected readonly baseURL: string;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });
        this.baseURL = baseURL;
        this._initializeResponseInterceptor();
    }

    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    protected _handleError = (error: any) => Promise.reject(error);
}

export default AbstractHttpClient;