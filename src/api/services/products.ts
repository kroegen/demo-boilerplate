import Base from "../base";
import type { ProductsResponse } from "./interfaces";

export default class ProductsService extends Base {
  public async fetchProducts(): Promise<ProductsResponse> {
    return this.api.get("products");
  }

  public async fetchProductById(productId: string) {
    return this.api.get(`products/${productId}`);
  }
}
