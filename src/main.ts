import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiCommunication } from './components/ApiCommunication/ApiCommunication';

import { Catalog } from './components/Models/catalog';
import { Buyer } from './components/Models/buyer';
import { ShoppingCart } from './components/Models/shoppingCart';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Success } from './components/View/Success';

import { CardCatalog } from './components/View/Cards/CardCatalog';
import { CardPreview } from './components/View/Cards/CardPreview';
import { CardBasket } from './components/View/Cards/CardBasket';

import { OrderForm } from './components/View/Forms/OrderForm';
import { ContactsForm } from './components/View/Forms/ContactsForm';

import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

import { IProduct, TPaymentType } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiCom = new ApiCommunication(api);

const catalog = new Catalog(events);
const buyer = new Buyer(events);
const shoppingCart = new ShoppingCart(events);

const gallery = new Gallery(document.body);
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(events, basketElement);

const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const previewElement = cloneTemplate<HTMLElement>(previewTemplate);
const preview = new CardPreview(
  {
    onClick: () => {
      const product = catalog.getChosenProduct();

      if (!product) {
        return;
      }

      events.emit('card:toggle', {
        id: product.id
      });
    }
  },
  previewElement
);

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderForm = new OrderForm(events, orderElement);

const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new ContactsForm(events, contactsElement);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(events, successElement);

function getProductButtonState(product: IProduct) {
  if (product.price === null) {
    return {
      buttonText: 'Недоступно',
      buttonDisabled: true
    };
  }

  if (shoppingCart.isInStock(product.id)) {
    return {
      buttonText: 'Удалить из корзины',
      buttonDisabled: false
    };
  }

  return {
    buttonText: 'Купить',
    buttonDisabled: false
  };
}

function renderCatalog(products: IProduct[]): void {
  const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

  const catalogCards = products.map((product) => {
    const cardElement = cloneTemplate<HTMLElement>(cardTemplate);

    const card = new CardCatalog(
      {
        onClick: () => {
          events.emit('card:select', {
            id: product.id
          });
        }
      },
      cardElement
    );

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`
    });
  });

  gallery.render({
    catalog: catalogCards
  });
}

function renderProductPreview(): void {
  const product = catalog.getChosenProduct();

  if (!product) {
    return;
  }

  modal.render({
    content: preview.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
      description: product.description,
      ...getProductButtonState(product)
    })
  });
}

function createBasketCards(): HTMLElement[] {
  const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

  return shoppingCart.getProductsToBuy().map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(basketCardTemplate);

    const card = new CardBasket(
      {
        onClick: () => {
          events.emit('basket:delete', {
            id: product.id
          });
        }
      },
      cardElement
    );

    return card.render({
      index: index + 1,
      title: product.title,
      price: product.price
    });
  });
}

function updateBasket(): void {
  basket.render({
    items: createBasketCards(),
    total: shoppingCart.getTotalPrice(),
    buttonDisabled: shoppingCart.getProductsAmount() === 0
  });
}

function renderBasket(): void {
  modal.render({
    content: basket.render()
  });
}

function getOrderErrors(): string {
  const errors = buyer.validateBuyersData();
  const errorsArr = [];
  errorsArr.push([errors.payment, errors.address].filter(Boolean).join(', '));

  for (let i of errorsArr) {
    if (i != undefined) return String(i);
  }

  return '';
}

function isOrderValid(): boolean {
  const errors = buyer.validateBuyersData();

  return !errors.payment && !errors.address;
}

function getContactsErrors(): string {
  const errors = buyer.validateBuyersData();

  const errorsArr = [];
  errorsArr.push(errors.email);
  errorsArr.push(errors.phone);

  for (let i of errorsArr) {
    if (i != undefined) return String(i);
  }

  return '';
}

function isContactsValid(): boolean {
  const errors = buyer.validateBuyersData();

  return !errors.email && !errors.phone;
}

function renderOrderForm(): void {
  modal.render({
    content: orderForm.render()
  });
}

function updateOrderForm(): void {
  const data = buyer.getBuyersData();

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: isOrderValid(),
    errors: getOrderErrors()
  });
}

function renderContactsForm(): void {
  modal.render({
    content: contactsForm.render()
  });
}

function updateContactsForm(): void {
  const data = buyer.getBuyersData();

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: isContactsValid(),
    errors: getContactsErrors()
  });
}

function renderSuccess(total: number): void {
  modal.render({
    content: success.render({
      total
    })
  });
}

events.on<{ products: IProduct[] }>('catalog:changed', (data) => {
  renderCatalog(data.products);
});

events.on<{ id: string }>('card:select', (data) => {
  const product = catalog.getProductById(data.id);

  if (!product) {
    return;
  }

  catalog.setChosenProduct(product);
});

events.on('catalog:select', () => {
  renderProductPreview();
});

events.on<{ id: string }>('card:toggle', (data) => {
  const product = catalog.getProductById(data.id);

  if (!product || product.price === null) {
    return;
  }

  if (shoppingCart.isInStock(product.id)) {
    shoppingCart.deleteProductFromCart(product.id);
  } else {
    shoppingCart.addProductToCart(product);
  }

  modal.close();
});

events.on<{ count: number }>('basket:changed', (data) => {
  header.render({
    counter: data.count
  });

  updateBasket();
});

events.on('basket:open', () => {
  renderBasket();
});

events.on<{ id: string }>('basket:delete', (data) => {
  shoppingCart.deleteProductFromCart(data.id);
});

events.on('order:open', () => {
  renderOrderForm();
});

events.on<{ payment: TPaymentType }>('order.payment:change', (data) => {
  buyer.saveBuyersData({
    payment: data.payment
  });
});

events.on<{ value: string }>('order.address:change', (data) => {
  buyer.saveBuyersData({
    address: data.value.trim()
  });
});

events.on('order:submit', () => {
  renderContactsForm();
});

events.on<{ value: string }>('contacts.email:change', (data) => {
  buyer.saveBuyersData({
    email: data.value.trim()
  });
});

events.on<{ value: string }>('contacts.phone:change', (data) => {
  buyer.saveBuyersData({
    phone: data.value.trim()
  });
});

events.on('contacts:submit', async () => {
  try {
    const response = await apiCom.postProducts({
      ...buyer.getBuyersData(),
      total: shoppingCart.getTotalPrice(),
      items: shoppingCart.getProductsToBuy().map((product) => product.id)
    });

    shoppingCart.clearCart();
    buyer.clearBuyersData();

    renderSuccess(response.total);
  } catch (error) {
    contactsForm.render({
      email: buyer.getBuyersData().email,
      phone: buyer.getBuyersData().phone,
      valid: true,
      errors: String(error)
    });
  }
});

events.on('buyer:changed', () => {
  updateOrderForm();
  updateContactsForm();
});

events.on('success:close', () => {
  modal.close();
});

updateBasket();

apiCom
  .getProducts()
  .then((response) => {
    catalog.setProducts(response.items);
  })
  .catch((error) => {
    console.log(error);
  });
