import { BACKEND_API_ENDPOINT } from "Config";
import AbstractHttpClient from "http/AbstractHttpClient";
import qs from 'qs';
import urljoin from "url-join";

export type Clipboard = {
    id: string;
    nickName: string;
    created: string;
    deleteAfterConfirmation: boolean;
    createByShortcut: boolean;
};

export type ClipItem = {
    id: string;
    mimeType: string;
    preview: string;
    created: string;
};

export type ListClipItems = {
    totalPages: number;
    content: ClipItem[];
};

export type CreateItemRequest = {
    content: string;
    mimeType: string;
};


class V1Api extends AbstractHttpClient {

    private static classInstance?: V1Api;

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new V1Api(BACKEND_API_ENDPOINT);
        }
        return this.classInstance;
    }

    public getUri = (url: string) => urljoin(this.baseURL, url)

    public createClipBoard = async () => await this.instance.post<Clipboard>("/api/clipboard/");

    public getClipboardItems = (clipId: string, pageId: number, pageSize: number) => async () => await this.instance.get<ListClipItems>(
        `/api/clipboard/${clipId}/item/?${qs.stringify({ page: pageId - 1, size: pageSize })}`
    );

    public getClipboardItemStringContent = (clipId: string, itemId: string) => async () => await this.instance.get<string>(
        `/api/clipboard/${clipId}/item/${itemId}/content/`
    );

    public deleteClipboardItem = (clipId: string, itemId: string) => async () => await this.instance.delete<string>(
        `/api/clipboard/${clipId}/item/${itemId}`
    );

    public createClipBoardItem = (clipId: string) => async (data: CreateItemRequest) => await this.instance.put<ClipItem>(
        `/api/clipboard/${clipId}/item/`,
        qs.stringify(data)
    );

    public modifyClipboard = (clipId: string) => async (patchData: any) => await this.instance.patch<Clipboard>(
        `/api/clipboard/${clipId}/`,
        qs.stringify(patchData)
    );

    public deleteClipboard = (clipId: string) => async () => await this.instance.delete<string>(
        `/api/clipboard/${clipId}/`
    );

    public getClipboard = (clipId: string) => async () => await this.instance.get<Clipboard>(`/api/clipboard/${clipId}/`);


}

export default V1Api;