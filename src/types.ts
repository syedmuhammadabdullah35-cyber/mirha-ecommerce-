export type Category = 'Summer Lawn Collection' | 'Summer Printed Lawn Collection' | 'Light Summer Unstitched Suits';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  images: string[];
  stockStatus: 'In Stock' | 'Out of Stock';
  createdAt: any;
  updatedAt: any;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: any;
}

export interface CartItem extends OrderItem {}
