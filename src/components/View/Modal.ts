import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  protected modalContainer: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', () => {
      this.close();
    });

    this.modalContainer.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
    document.body.style.overflow = '';
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}