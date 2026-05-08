export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id : string,
    title : string,
    image : string,
    price : number | null, 
    description : string
}

export interface IBuyer {
    payment : TPaymentType | '',
    address : string,
    email : string,
    phone : string
}

export type TPaymentType = 'online' | 'offline'

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>

export type TProductsResponse = {
    total : number,
    items : IProduct[]
}

export interface IOrderData extends IBuyer {
    total : number,
    items : string[]
}

export type TOrderResponse = {
    id : string,
    total : number
}