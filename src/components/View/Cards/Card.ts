import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';

export interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard = ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLSpanElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}