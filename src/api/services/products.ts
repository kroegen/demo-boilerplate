import Base from "../base";
import type { ProductsResponse } from "./interfaces";

export default class ProductsService extends Base {
  public async fetchProducts(): Promise<ProductsResponse> {
    return this.api.get("products");
  }

  public async fetchProductById(productId: string) {
    return this.api.get(`products/${productId}`);
  }

  public async fetchProductsCategories() {
    return this.api.get("products/categories");
  }

  public async fetchProductsByCategory(
    category: string
  ): Promise<ProductsResponse> {
    return this.api.get(`products/category/${category}`);
  }
}
