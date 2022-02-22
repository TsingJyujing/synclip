import { BACKEND_API_ENDPOINT } from "Config";
import AbstractHttpClient from "http/AbstractHttpClient";
import qs from 'qs';

export type Clipboard = {
    id: string;
    nickName: string;
    created: string;
};

export type ClipItem = {
    id: string;
    preview: string;
    created: string;
};

export type ListClipItems = {
    totalPages: number;
    content: ClipItem[];
};
class V1Api extends AbstractHttpClient {

    private static classInstance?: V1Api;

    public static getInstance() {
        if (!this.classInstance) {
            this.classInstance = new V1Api(BACKEND_API_ENDPOINT);
        }
        return this.classInstance;
    }

    public createClipBoard = async () => await this.instance.post<Clipboard>("/api/clipboard/");

    public getClipboardItems = (clipId: string) => async () => await this.instance.get<ListClipItems>(
        `/api/clipboard/${clipId}/item/`
    );

    public getClipboardItemContent = (clipId: string, itemId: string) => async () => await this.instance.get<string>(
        `/api/clipboard/${clipId}/item/${itemId}/content/`
    );

    public deleteClipboardItem = (clipId: string, itemId: string) => async () => await this.instance.delete<string>(
        `/api/clipboard/${clipId}/item/${itemId}`
    );

    public createClipBoardItem = (clipId: string) => async (content: string) => await this.instance.put<ClipItem>(
        `/api/clipboard/${clipId}/item/`,
        qs.stringify({ content })
    );

    public setClipBoardNickName = (clipId: string) => async (nickName: string) => await this.instance.patch<Clipboard>(
        `/api/clipboard/${clipId}/`,
        qs.stringify({ nickName })
    );

    public getClipboard = (clipId: string) => async () => await this.instance.get<Clipboard>(`/api/clipboard/${clipId}/`);


}

export default V1Api;