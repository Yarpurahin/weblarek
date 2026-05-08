import './scss/styles.scss'
import {Catalog} from  './components/Models/catalog'
import './utils/data'
import {Api} from './components/base/Api'
import  './utils/constants';
import {Buyer} from './components/Models/buyer'
import {ShoppingCart} from './components/Models/shoppingCart'
import {IBuyer} from './types/index';
import { ApiCommunication } from './components/ApiCommunication/ApiCommunication';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const testData = apiProducts.items

const catalog = new Catalog()
catalog.setProducts(testData)

console.log('getProductById:')
console.log(catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"))

catalog.setChosenProduct(testData[3])

console.log('getChosenProduct:')
console.log(catalog.getChosenProduct())

console.log('')
console.log('====================')
console.log('')

const cart = new ShoppingCart()

cart.addProductToCart(testData[0])
cart.addProductToCart(testData[1])
cart.addProductToCart(testData[2])

console.log('3 items added to the cart:')
console.log(cart.getProductsToBuy())

cart.deleteProductFromCart(testData[0].id)

console.log('1st item deleted from the cart:')
console.log(cart.getProductsToBuy())

console.log('total price of items in the cart:')
console.log(cart.getTotalPrice())

console.log('amount of items in the cart:')
console.log(cart.getProductsAmount())

console.log('is item in stock (negative):')
console.log(cart.isInStock('some-random-id'))

console.log('is item in stock (positive):')
console.log(cart.isInStock(testData[2].id))

cart.clearCart()

console.log('clear cart:')
console.log(cart.getProductsToBuy())

console.log('')
console.log('====================')
console.log('')

const testBuyersData : IBuyer = {
    payment : 'online',
    address : 'example-address',
    email : 'exampleemail@mail.com',
    phone : '89001234567'
}

const testBuyersDataWRONG : IBuyer = {
    payment : 'online',
    address : '',
    email : 'exampleemail@mail.com',
    phone : ''
}

const buyer = new Buyer()

buyer.saveBuyersData(testBuyersData)

console.log('saveBuyersData:')
console.log(buyer.getBuyersData())

console.log('validateBuyersData (positive):')
console.log(buyer.validateBuyersData())

const buyerWRONG = new Buyer

buyerWRONG.saveBuyersData(testBuyersDataWRONG)

console.log('validateBuyersData (negative):')
console.log(buyerWRONG.validateBuyersData())

buyer.clearBuyersData()

console.log('clear buyers data:')
console.log(buyer.getBuyersData())

console.log('')
console.log('====================')
console.log('')

const apiCatalog = new Catalog
const api = new Api(API_URL);
const apiCom = new ApiCommunication(api);

async function loadProducts() {
    try {
        const response = await apiCom.getProducts()
        apiCatalog.setProducts(response.items)
        console.log('catalog filled from server:')
        console.log(apiCatalog.getProducts())
    }
    catch (err) {
        console.log(`Achtung! ${err}`)
    }
}

loadProducts()


