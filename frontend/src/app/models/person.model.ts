export interface person {
    accountId: string | null,
    id: string | null,
    level: number,
    name: string;
    spouse: string,
    location: string,
    dob: string,
    address: string,
    parent: string | null,
    image1?: File | string,
    image2?: File | string,

}