import clientAPI from "./main";
import PostsService from "./services/posts";
import ProductsService from "./services/products";
import UsersService from "./services/users";
import AuthService from "./services/auth";

const JSON_API_URL = "https://dummyjson.com";
// const WEATHER_API_URL = "https://api.open-meteo.com/v1/";
// const AIR_API_URL = "https://air-quality-api.open-meteo.com/v1/";

function api() {
  const jsonApi = new clientAPI(JSON_API_URL);
  // const weatherApi = new clientAPI(WEATHER_API_URL);
  // const airApi = new clientAPI(AIR_API_URL);

  return {
    auth: new AuthService(jsonApi),
    posts: new PostsService(jsonApi),
    products: new ProductsService(jsonApi),
    users: new UsersService(jsonApi),
    // you can add as much services form as many urls you like
  };
}

export default api();
