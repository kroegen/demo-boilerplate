import Base from "../base";
import type { ProductsResponse } from "./interfaces";

export default class ProductsService extends Base {
  public async fetchProducts(
    page: number,
    limit: number
  ): Promise<ProductsResponse> {
    const skip = `skip=${page === 1 ? 0 : (page - 1) * limit}`;

    return this.api.get(`products?limit=${limit}&${skip}`);
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
