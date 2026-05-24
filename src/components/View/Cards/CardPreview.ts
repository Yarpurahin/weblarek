import {ensureElement} from '../../../utils/utils';
import {categoryMap} from '../../../utils/constants';
import {ICard, Card} from './Card';
import {ICardActions} from './CardCatalog';

export interface ICardPreview extends ICard {
  category: string;
  image: string;
  description: string;
}

export class CardPreview extends Card<ICardPreview> {
  protected cardCategory: HTMLSpanElement;
  protected cardImage: HTMLImageElement;
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor (protected actions: ICardActions, container: HTMLElement) {
    super(container);

    this.cardCategory = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.cardButton.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.setImage(this.cardImage, value);
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }
}