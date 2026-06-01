import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Catalog {
  protected products: IProduct[] = [];
  protected chosenProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', { products: this.products });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setChosenProduct(product: IProduct): void {
    this.chosenProduct = product;
    this.events.emit('catalog:select', { product });
  }

  getChosenProduct(): IProduct | null {
    return this.chosenProduct;
  }
}