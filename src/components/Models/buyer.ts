import { IBuyer, TValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
  protected buyersData: IBuyer = {
    payment: '',
    address: '',
    email: '',
    phone: ''
  };

  constructor(protected events: IEvents) {}

  saveBuyersData(data: Partial<IBuyer>): void {
    this.buyersData = {
      ...this.buyersData,
      ...data
    };

    this.events.emit('buyer:changed', {
      data: this.buyersData,
      errors: this.validateBuyersData()
    });
  }

  getBuyersData(): IBuyer {
    return this.buyersData;
  }

  clearBuyersData(): void {
    this.buyersData = {
      payment: '',
      address: '',
      email: '',
      phone: ''
    };

    this.events.emit('buyer:changed', {
      data: this.buyersData,
      errors: this.validateBuyersData()
    });
  }

  validateBuyersData(): TValidationErrors {
    const errorObj: TValidationErrors = {};

    if (!this.buyersData.email) {
      errorObj.email = 'Укажите email';
    }

    if (!this.buyersData.phone) {
      errorObj.phone = 'Укажите номер телефона';
    }

    if (!this.buyersData.payment) {
      errorObj.payment = 'Укажите способ оплаты';
    }

    if (!this.buyersData.address) {
      errorObj.address = 'Необходимо указать адрес доставки';
    }

    return errorObj;
  }
}