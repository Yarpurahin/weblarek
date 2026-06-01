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

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

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

function renderProductPreview(product: IProduct): void {
  const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
  const previewElement = cloneTemplate<HTMLElement>(previewTemplate);

  const card = new CardPreview(
    {
      onClick: () => {
        events.emit('card:toggle', {
          id: product.id
        });
      }
    },
    previewElement
  );

  modal.render({
    content: card.render({
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

function renderBasket(): void {
  const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
  const basketElement = cloneTemplate<HTMLElement>(basketTemplate);

  const basket = new Basket(events, basketElement);

  modal.render({
    content: basket.render({
      items: createBasketCards(),
      total: shoppingCart.getTotalPrice(),
      buttonDisabled: shoppingCart.getProductsAmount() === 0
    })
  });
}

function getOrderErrors(): string {
  const errors = buyer.validateBuyersData();
  const errorsArr = [];
  errorsArr.push(errors.payment);
  errorsArr.push(errors.address);

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
  const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
  const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);

  orderForm = new OrderForm(events, orderElement);
  contactsForm = null;

  const data = buyer.getBuyersData();

  modal.render({
    content: orderForm.render({
      payment: data.payment,
      address: data.address,
      valid: isOrderValid(),
      errors: getOrderErrors()
    })
  });
}

function updateOrderForm(): void {
  if (!orderForm) {
    return;
  }

  const data = buyer.getBuyersData();

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: isOrderValid(),
    errors: getOrderErrors()
  });
}

function renderContactsForm(): void {
  const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
  const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);

  contactsForm = new ContactsForm(events, contactsElement);
  orderForm = null;

  const data = buyer.getBuyersData();

  modal.render({
    content: contactsForm.render({
      email: data.email,
      phone: data.phone,
      valid: isContactsValid(),
      errors: getContactsErrors()
    })
  });
}

function updateContactsForm(): void {
  if (!contactsForm) {
    return;
  }

  const data = buyer.getBuyersData();

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: isContactsValid(),
    errors: getContactsErrors()
  });
}

function renderSuccess(total: number): void {
  const successTemplate = ensureElement<HTMLTemplateElement>('#success');
  const successElement = cloneTemplate<HTMLElement>(successTemplate);

  const success = new Success(events, successElement);

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

events.on<{ product: IProduct }>('catalog:select', (data) => {
  renderProductPreview(data.product);
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
});

events.on('basket:open', () => {
  renderBasket();
});

events.on<{ id: string }>('basket:delete', (data) => {
  shoppingCart.deleteProductFromCart(data.id);
  renderBasket();
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
  if (!isOrderValid()) {
    updateOrderForm();
    return;
  }

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
  const errors = buyer.validateBuyersData();

  if (Object.keys(errors).length > 0) {
    updateContactsForm();
    return;
  }

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
    contactsForm?.render({
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

apiCom
  .getProducts()
  .then((response) => {
    catalog.setProducts(response.items);
  })
  .catch((error) => {
    console.log(error);
  });