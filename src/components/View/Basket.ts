import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      const emptyMessage = createElement<HTMLLIElement>('li', {
        textContent: 'Корзина пуста'
      });

      this.listElement.replaceChildren(emptyMessage);
      return;
    }

    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}