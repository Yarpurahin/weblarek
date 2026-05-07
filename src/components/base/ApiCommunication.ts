import './Api';
import {IApi, TDataGetFromServer, TDataPostToServer} from '../../types/index';

export class ApiCommunication {
  constructor(protected apiObj : IApi) {}

  getProducts () : Promise<TDataGetFromServer> {
    return this.apiObj.get<TDataGetFromServer>('/product/')
  }

  postProducts (data : TDataPostToServer) : Promise<TDataPostToServer> {
    return this.apiObj.post('/order/', data)
  }
}