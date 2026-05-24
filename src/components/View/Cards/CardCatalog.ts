import {ensureElement} from '../../../utils/utils';
import {categoryMap} from '../../../utils/constants'
import {ICard, Card} from './Card'

export interface ICardCatalog extends ICard {
  category: string;
  image: string;
}

export interface ICardActions {
  onClick?: () => void;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected cardCategory: HTMLSpanElement;
  protected cardImage: HTMLImageElement;

  constructor(protected actions: ICardActions, container: HTMLElement) {
    super(container);
    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.setImage(this.cardImage, value);
  }
}