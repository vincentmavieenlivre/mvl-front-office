
export enum EBookDestination {

    OTHER = "other",
    ME = "me"

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