import { ensureElement } from '../../../utils/utils';
import { ICard, Card } from './Card';
import { ICardActions } from './CardCatalog';

export interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected cardIndex: HTMLElement;
  protected cardDeleteButton: HTMLButtonElement;

  constructor(actions: ICardActions, container: HTMLElement) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.cardDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.cardDeleteButton.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}