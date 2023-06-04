export interface Product {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: URL[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: URL;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  image: URL;
  username: string;
  password: string;
  isDeleted?: boolean;
}

export interface UserCreds {
  username: string;
  password: string;
}

export interface Auth {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  token: string;
}

export interface Cart {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface Response {
  limit: number;
  skip: number;
  total: number;
}

export interface CustomError {
  message: string;
}

export interface AuthPayload {
  username: string;
  password: string;
}

export interface ProductsResponse extends Response {
  products: Product[];
}

export interface UsersResponse extends Response {
  users: User[];
}

export interface UserResponse extends User {}
