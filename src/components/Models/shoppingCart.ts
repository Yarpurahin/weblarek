import {IProduct} from '../../types/index';

export class ShoppingCart {
  protected productsToBuy : IProduct[] = [];

  getProductsToBuy () : IProduct[] {
    return this.productsToBuy;
  }

  addProductToCart (product : IProduct) : void {
    this.productsToBuy.push(product);
  }

  deleteProductFromCart (product : IProduct) : void {
    for (let i : number = 0; i < this.productsToBuy.length; i++) {
      if (this.productsToBuy[i] === product) {
        this.productsToBuy.splice(i, 1);
      }     
    }
  }

  clearCart () : void {
    this.productsToBuy = [];
  }

  getTotalPrice () : number {
    let total : number = 0;
    this.productsToBuy.forEach((product) => {
      if (typeof(product.price) === "number") {total += product.price}
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