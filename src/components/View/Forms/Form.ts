import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export interface IForm {
  valid: boolean;
  errors: string;
}

export class Form<T extends object> extends Component<T & IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;

      this.events.emit(`${this.container.name}.${field}:change`, {
        field,
        value: target.value
      });
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}