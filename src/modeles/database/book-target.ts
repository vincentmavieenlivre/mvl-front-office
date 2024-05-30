
export enum EBookDestination {
    ME,
    OTHER
}

export enum EForGenre {
    MEN,
    WOMEN
}


export interface IBookFor {
    destination: EBookDestination

    genre: EForGenre
    firstName: string;
    lastName: string;

    room?: string;
    phone?: string;
    email?: string;
    avatarUrl?: string;


}