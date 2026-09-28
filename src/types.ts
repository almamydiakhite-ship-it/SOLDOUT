export interface ProductView {
  label: string;
  src: string;
}

export interface Product {
  id: string;
  name: string;
  chapterNo: string;
  chapterTitle: string;
  colourway: string;
  views: ProductView[];
  tagline: string;
  story: string;
  details: string[];
  isNew: boolean;
  isSoldOut?: boolean;
  price?: number;
  createdAt?: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  size: string;
  quantity: number;
  fingerprintName?: string;
  fingerprintFile?: File;
}

export interface EnrichedCartLine extends CartLine {
  product: Product;
  lineTotal: number;
}

export interface OrderCustomerInfo {
  reference: string;
  customerName: string;
  phone: string;
  zone: string;
  address: string;
  note?: string;
}

export type OrderStatus = 'Reçue' | 'Confirmée' | 'En préparation' | 'Expédiée' | 'Livrée' | 'Annulée';

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  fingerprintName?: string;
}

export interface StoredOrder {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  zone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  biometricCert?: string;
  fingerprintScanned: boolean;
  status: OrderStatus;
  createdAt: string;
}

export interface DailyVisit {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Lun 23"
  visits: number;
  uniqueCount: number;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastVisitAt: string;
  history: DailyVisit[];
  mobileRatio: number; // percentage
  desktopRatio: number;
}
