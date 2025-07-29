export type User = {
  id: number;
  name: string;
  email: string;
  lastName: string;
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
  type?: 'text' | 'number' | 'boolean' | 'password' | 'email' | 'select';
  required?: boolean;
  options?: {value: number, label: string}[]
  multiple?: boolean
}

export type Invoice = {
  id: number;
  clientId: number | null;
  productIds: number[];
  totalPrice: number;
  createdAt: string;
}