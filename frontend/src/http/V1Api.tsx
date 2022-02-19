import { BACKEND_API_ENDPOINT } from "Config";
import AbstractHttpClient from "http/AbstractHttpClient";

export type Clipboard = {
    id: string;
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

}

export default V1Api;