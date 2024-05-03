
import { some } from 'lodash';

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


export function shouldBeSaved(entries: IResponse[]): boolean {
    return some(entries, (e: IResponse) => e.modified == true)
}
