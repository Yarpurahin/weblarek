import {IBuyer, TValidationErrors} from '../../types/index';

export class Buyer {
  protected buyersData : IBuyer = {
    payment : '',
    address : '',
    email : '',
    phone : ';'
  };

  saveBuyersData (data : Partial<IBuyer>) : void {
    if (data.payment !== undefined) {this.buyersData.payment = data.payment}

    if (data.address !== undefined) {this.buyersData.address = data.address}

    if (data.email !== undefined) {this.buyersData.email = data.email}

    if (data.phone !== undefined) {this.buyersData.phone = data.phone}
  }

  getBuyersData () : IBuyer {
    return this.buyersData
  }

  clearBuyersData () : void {
    this.buyersData = {
      payment : '',
      address : '',
      email : '',
      phone : ''
    }
  }

  
  validateBuyersData () : TValidationErrors {
    const errorObj : TValidationErrors = {}

    if (!this.buyersData.email) {errorObj.email = 'Укажите email'}
    
    if (!this.buyersData.phone) {errorObj.phone = 'Укажите номер телефона'}
    
    if (!this.buyersData.payment) {errorObj.payment = 'Укажите способ оплаты'}
    
    if (!this.buyersData.address) {errorObj.address = 'Укажите адрес доставки'}

    return errorObj
  }
}