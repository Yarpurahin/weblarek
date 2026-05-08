import '../base/Api';
import {IApi, IOrderData, TOrderResponse, TProductsResponse} from '../../types/index';

export class ApiCommunication {
  constructor(protected apiObj : IApi) {}

  getProducts () : Promise<TProductsResponse> {
    return this.apiObj.get<TProductsResponse>('/product/')
  }

  postProducts (data : IOrderData) : Promise<TOrderResponse> {
    return this.apiObj.post('/order/', data)
  }
}