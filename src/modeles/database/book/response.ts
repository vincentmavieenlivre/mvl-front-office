
export interface IRecord {
    audioUrl: any;
    audioBlob?: any;
}

export interface IResponse {
    id: string;
    audioRecord: IRecord;
    text?: string;
    modified: boolean;
}
