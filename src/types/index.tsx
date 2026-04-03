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
  createdAt: string;
}

export type Field = {
  title: string;
  field: string;
  label: string;
  type?: 'text' | 'number' | 'boolean' | 'password' | 'email' | 'select';
  required?: boolean;
  options?: { value: string | number, label: string }[]
  multiple?: boolean
}

export type Order = {
  id: number;
  clientId: number | null;
  productIds: number[];
  totalPrice: number;
  createdAt: string;
}

export type Invoice = {
  id: number;
  clientId: number | null;
  productIds: number[];
  totalPrice: number;
  createdAt: string;
}

export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  archived: boolean;
  priority: "low" | "medium" | "high";
}

export type Event = {
  id: number;
  title: string;
  category: 'review' | 'meeting' | 'design' | 'development' | 'release' | '';
  description?: string;
  qNote?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  color?: string;
}

export type ChartTypes = {
  revenue: {
    month: string;
    revenue: number;
    cumulative: number
  }[];
  products: {
    month: string;
    products: number
  }[];
  invoices: {
    month: string;
    orders: number
  }[];
  clients: {
    month: string;
    clients: number
  }[];
  mostSold: {
    product: string;
    quantity: number
  }[];
}

export type DashCardTypes = {
  clients: {
    total: number;
    change: {
      value: number,
      percent: number,
      direction: "up" | "down" | "stable";
    }
  };
  revenue: {
    total: number,
    change: {
      value: number,
      percent: number,
      direction: "up" | "down" | "stable";
    }
  };
  invoices: {
    total: number,
    change: {
      value: number,
      percent: number,
      direction: "up" | "down" | "stable";
    }
  };
  products: {
    total: number;
    change: {
      value: number,
      percent: number,
      direction: "up" | "down" | "stable",
    }
  };
  pendingOrders: {
    total: number;
    change: {
      value: number,
      percent: number,
      direction: "up" | "down" | "stable";
    }
  }
  events: {
    total: number;
    upcoming: Event[]
  }
  topProducts: {
    product: string;
    quantity: number;
  }[];
};

export type MetricsPeriod = '6months' | 'year' | 'all'
