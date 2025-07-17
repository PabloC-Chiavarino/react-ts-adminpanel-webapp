export type User = {
  id: number;
  name: string;
  email: string;
  lastname: string;
  phone: string;
  address: string;
  createdAt: string;
}

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type Field = {
  title: string;
  field: string;
  label: string;
  type?: 'text' | 'number' | 'boolean' | 'password' | 'email';
  required?: boolean;
}