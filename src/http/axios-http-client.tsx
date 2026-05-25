import {HTTPClient, HTTPHeaders, HTTPHooks, HTTPRequest, HTTPResponse} from "mfront-core";
import axios from "axios";
import {useAppContext} from "mfront";


export const AxiosHTTPClient: HTTPClient = {
    async request<TData = unknown, TBody = unknown, TQuery = unknown>(request: HTTPRequest<TBody, TQuery>, hooks?: HTTPHooks<TData> ): Promise<HTTPResponse<TData>> {
        const {config} = useAppContext.get()
        try {

            let baseURL: string | undefined = undefined
            if (request.baseURL) {
                baseURL = request.baseURL
            }else if (!request.isAbsoluteUrl && config.apiBaseUrl){
                baseURL = config.apiBaseUrl
            }

            const axiosRequest = await axios.request<TData>({
                url: request.url,
                baseURL: baseURL,
                method: request.method,
                params: request.query,
                data: request.body,
                headers: request.headers,
                timeout: request.timeout,
                responseType: request.responseType,
            });

            const response: HTTPResponse<TData> = {
                isSuccess: true,
                statusCode: axiosRequest.status,
                body: axiosRequest.data,
                headers: axiosRequest.headers as HTTPHeaders,
            };

            hooks?.success?.(response);
            hooks?.finally?.();

            return response;

        } catch (err: any) {
            const response: HTTPResponse<TData> = {
                isSuccess: false,
                statusCode: err?.response?.status ?? 0,
                body: null,
                error: err,
            };

            hooks?.error?.(response);
            hooks?.finally?.();
            return response;
        }
    },
}