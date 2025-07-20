export interface Dish {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image?: string;
  available: boolean;
  popular: boolean;
}

export interface Payment {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  transactionId: string;
  amount: string;
  receipt?: {
    _type: 'file';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  createdAt: string;
}

export interface QRCode {
  _id: string;
  userId: string;
  url: string;
  size: number;
  logoSize: number;
  backgroundColor: string;
  foregroundColor: string;
}

export interface View {
  _id: string;
  userId: string;
  dish: {
    _ref: string;
    _type: 'reference';
    name?: string;
  };
  restaurant: string;
  views: number;
  time: string;
  trend: string;
}

export interface Stats {
  _id: string;
  userId: string;
  name: string;
  value: string;
  change?: string;
  trend?: string;
}

export interface DailyStats {
  _id: string;
  userId: string;
  name: string;
  vues: number;
  scans: number;
  date: string;
}

export interface Restaurant {
  _id: string;
  userId: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  description?: string;
  address?: string;
  phone?: string;
  image?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  menuUrl?: string;
  dishes: {
    _ref: string;
    _type: 'reference';
    name?: string;
    price?: string;
    category?: string;
  }[];
  createdAt: string;
}

export interface Contact {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  restaurant?: {
    _ref: string;
    _type: 'reference';
    name?: string;
  };
  createdAt: string;
  status: string;
}

export interface Testimonial {
  _id: string;
  userId: string;
  customerName: string;
  message: string;
  rating: number;
  restaurant?: {
    _ref: string;
    _type: 'reference';
    name?: string;
  };
  image?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  createdAt: string;
  published: boolean;
}

export interface Menu {
  _id: string;
  userId: string;
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  description?: string;
  dishes: {
    _ref: string;
    _type: 'reference';
    name?: string;
    price?: string;
    category?: string;
  }[];
  restaurant: {
    _ref: string;
    _type: 'reference';
    name?: string;
  };
  url?: string;
  active: boolean;
  createdAt: string;
}