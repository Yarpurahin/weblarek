import './scss/styles.scss'
import {Catalog} from  './components/Models/catalog'
import './utils/data'
import {Api} from './components/base/Api'
import  './utils/constants';
import {Buyer} from './components/Models/buyer'
import {ShoppingCart} from './components/Models/shoppingCart'
import {IBuyer} from './types/index';
import { ApiCommunication } from './components/ApiCommunication/ApiCommunication';
import { API_URL, CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';

import {cloneTemplate, ensureElement} from './utils/utils';
import {createElement} from './utils/utils';
import {Component} from './components/base/Component';
import {IEvents} from '././components/base/Events';
import {Header} from './components/View/Header';
import { EventEmitter } from './components/base/Events';
import {Gallery} from './components/View/Gallery';
import {Card} from './components/View/Cards/Card';
import { CardCatalog } from './components/View/Cards/CardCatalog';
import {CardPreview} from './components/View/Cards/CardPreview';

// Загрузили информацию о товарах с сервера (10 шт)
const apiCatalog = new Catalog;
const api = new Api(API_URL);
const apiCom = new ApiCommunication(api);

// Формируем карточки, заносим их в галерею (с пом. сеттера)
async function loadProducts() {
  try {
    const response = await apiCom.getProducts();
    apiCatalog.setProducts(response.items);
    const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

    const catalogCards = apiCatalog.getProducts().map((product) => {
      const cardElement = cloneTemplate<HTMLElement>(cardTemplate);

      const card = new CardCatalog(
        {
          onClick: () => {
            console.log('Клик по карточке товара:');
            console.log(product);
          }
        },
        cardElement
      );

      card.title = product.title;
      card.price = product.price;
      card.category = product.category;
      card.image = `${CDN_URL}${product.image}`;

      return cardElement;
      });

  gallery.catalog = catalogCards;
  }
  catch(err) {
    console.log(err);
  }
}

const events = new EventEmitter(); // Объект брокера событий

const gallery = new Gallery(document.body); // Объект галереи

const header = new Header(events, ensureElement<HTMLElement>('.header')) // Объект хедера

loadProducts(); // Сформировали карточки, вывели галерею

