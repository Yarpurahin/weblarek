import {IBuyer} from '../../types/index';

export class Buyer {
  protected buyersData : IBuyer = {
    payment : '',
    address : '',
    email : '',
    phone : ';'
  };

  saveBuyersData (data : IBuyer) : void {
    if (data.payment) {this.buyersData.payment = data.payment}

    if (data.address) {this.buyersData.address = data.address}

    if (data.email) {this.buyersData.email = data.email}

    if (data.phone) {this.buyersData.phone = data.phone}
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

  validateBuyersData () : object {
    let errorObj = {
      payment: '',
      address: '',
      email: '',
      phone: ''
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const addressRegex = /^[a-zA-Zа-яА-ЯёЁ0-9]/;
    const phoneRegex = /^(\+?\d{1,3})?[\s\-()]?\d{3}[\s\-()]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    if (!emailRegex.test(this.buyersData.email)) {errorObj.email = 'Неверный email'}
    
    if (!phoneRegex.test(this.buyersData.phone)) {errorObj.phone = 'Неверный номер телефона'}
    
    if (this.buyersData.payment === '') {errorObj.payment = 'Укажите способ оплаты'}
    
    if (!addressRegex.test(this.buyersData.address.trim())) {errorObj.address = 'Неверный адрес доставки'}

    return errorObj
  }
}