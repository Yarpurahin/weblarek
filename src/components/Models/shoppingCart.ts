import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ShoppingCart {
  protected productsToBuy: IProduct[] = [];

  constructor(protected events: IEvents) {}

  protected changed(): void {
    this.events.emit('basket:changed', {
      products: this.productsToBuy,
      total: this.getTotalPrice(),
      count: this.getProductsAmount()
    });
  }

  getProductsToBuy(): IProduct[] {
    return this.productsToBuy;
  }

  addProductToCart(product: IProduct): void {
    if (this.isInStock(product.id)) {
      return;
    }

    this.productsToBuy.push(product);
    this.changed();
  }

  deleteProductFromCart(id: string): void {
    this.productsToBuy = this.productsToBuy.filter(
      (product: IProduct) => product.id !== id
    );

    this.changed();
  }

  clearCart(): void {
    this.productsToBuy = [];
    this.changed();
  }

  getTotalPrice(): number {
    return this.productsToBuy.reduce((total, product) => {
      return total + (product.price ?? 0);
    }, 0);
  }

  getProductsAmount(): number {
    return this.productsToBuy.length;
  }

  isInStock(id: string): boolean {
    return this.productsToBuy.some((product) => product.id === id);
  }
}