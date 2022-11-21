export interface person {
    accountId: number | null,
    id: string | null,
    level: number,
    name: string;
    spouse: string,
    location: string,
    dob: string,
    address: string,
    parent: string | null,
    image1?: File,
    image2?: File,

}