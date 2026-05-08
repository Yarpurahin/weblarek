import {IProduct} from '../../types/index';

export class ShoppingCart {
  protected productsToBuy : IProduct[] = [];

  getProductsToBuy () : IProduct[] {
    return this.productsToBuy;
  }

  addProductToCart (product : IProduct) : void {
    this.productsToBuy.push(product);
  }

  deleteProductFromCart(id: string): void {
    this.productsToBuy = this.productsToBuy.filter(
      (product: IProduct) => product.id !== id
    );
  }  

  clearCart () : void {
    this.productsToBuy = [];
  }

  getTotalPrice () : number {
    let total : number = 0;
    this.productsToBuy.forEach((product) => {
      total += product.price ?? 0
    })
    return total;
  }

  getProductsAmount () : number {
    return this.productsToBuy.length;
  }

  isInStock(id: string): boolean {
    return this.productsToBuy.some((product) => {
        return product.id === id
    })
}
}