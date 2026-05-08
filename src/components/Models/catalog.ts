import {IProduct} from '../../types/index';

export class Catalog {
  protected products : IProduct[] = [];
  protected chosenProduct!: IProduct | null;

  setProducts(products : IProduct[]) : void {
    this.products = products;
  }

  getProducts() : IProduct[] {
    return this.products;
  }

  getProductById(id : string) : IProduct | undefined {
    return this.products.find(() => {
      for (let product of this.products) {
        if (product.id === id) return product;
      }
    })
  }

  setChosenProduct(product : IProduct) : void {
    this.chosenProduct = product;
  }

  getChosenProduct() : IProduct | null {
    return this.chosenProduct;
  }
}