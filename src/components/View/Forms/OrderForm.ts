import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import { TPaymentType } from '../../../types';

interface IOrderForm {
  payment: TPaymentType | '';
  address: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment: TPaymentType = button.name === 'card' ? 'online' : 'offline';

        this.events.emit('order.payment:change', {
          payment
        });
      });
    });
  }

  set payment(value: TPaymentType | '') {
    this.paymentButtons.forEach((button) => {
      button.classList.remove('button_alt-active');

      if (button.name === 'card' && value === 'online') {
        button.classList.add('button_alt-active');
      }

      if (button.name === 'cash' && value === 'offline') {
        button.classList.add('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}