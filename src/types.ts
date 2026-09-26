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
