import {IProduct} from '../../types/index';

export class Catalog {
  protected products : IProduct[] = [];
  protected chosenProduct : IProduct | undefined;

  setProducts(products : IProduct[]) : IProduct[] {
    return this.products = products;
  }

  getProducts() : IProduct[] {
    return this.products;
  }

  getProductById(id : string) : IProduct | void {
    for (let product of this.products) {
      if (product.id === id) return product;
    }
  }

  setChosenProduct(product : IProduct) : IProduct {
    return this.chosenProduct = product;
  }

  getChosenProduct() : IProduct | void {
    return this.chosenProduct;
  }
}