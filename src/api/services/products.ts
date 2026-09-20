import Base from "../base";
import type {
  Category,
  CreateProductPayload,
  CreatedProduct,
  DeletedProduct,
  Product,
  ProductsResponse,
  UpdateProductPayload,
} from "./interfaces";

export default class ProductsService extends Base {
  public async fetchProducts(
    page: number,
    limit: number,
  ): Promise<ProductsResponse> {
    const skip = page === 1 ? 0 : (page - 1) * limit;

    return this.api.get<ProductsResponse>("products", { limit, skip });
  }

  public async fetchProductById(productId: string) {
    return this.api.get<Product>(`products/${productId}`);
  }

  public async fetchProductsCategories() {
    return this.api.get<Category[]>("products/categories");
  }

  public async fetchProductsByCategory(
    category: string,
  ): Promise<ProductsResponse> {
    return this.api.get<ProductsResponse>(`products/category/${category}`);
  }

  public async createProduct(
    payload: CreateProductPayload,
  ): Promise<CreatedProduct> {
    return this.api.post<CreateProductPayload, CreatedProduct>(
      "products/add",
      payload,
    );
  }

  public async updateProduct(
    productId: number,
    payload: UpdateProductPayload,
  ): Promise<Product> {
    return this.api.patch<UpdateProductPayload, Product>(
      `products/${productId}`,
      payload,
    );
  }

  public async deleteProduct(productId: number): Promise<DeletedProduct> {
    return this.api.delete<DeletedProduct>(`products/${productId}`);
  }
}
