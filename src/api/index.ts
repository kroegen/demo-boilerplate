import clientAPI from "./main";
import PostsService from "./services/posts";
import ProductsService from "./services/products";
import UsersService from "./services/users";
import AuthService from "./services/auth";

class API {
  private jsonApi: clientAPI;
  // Optionally: add more APIs for other services
  // private weatherApi: clientAPI;
  // private airApi: clientAPI;

  public auth: AuthService;
  public posts: PostsService;
  public products: ProductsService;
  public users: UsersService;

  constructor() {
    const JSON_API_URL = "https://dummyjson.com";
    this.jsonApi = new clientAPI(JSON_API_URL);

    // Initialize services
    this.auth = new AuthService(this.jsonApi);
    this.posts = new PostsService(this.jsonApi);
    this.products = new ProductsService(this.jsonApi);
    this.users = new UsersService(this.jsonApi);
  }

  // Optionally, you could add a method to refresh tokens for all services
  public setAuthorizationToken(token: string) {
    this.auth.setAuthorization(token);
    // If you had other APIs (like weatherApi), you could set their tokens too
  }
}

export default new API();
