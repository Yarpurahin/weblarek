import {ensureElement} from '../../../utils/utils';
import {Component} from '../../base/Component';
import {IEvents} from '../../base/Events';
import {categoryMap} from '../../../utils/constants'

export interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard = ICard> extends Component<ICard> {
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
      this.priceElement.textContent = String(value);
    }
}
