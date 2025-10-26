export type DeliveryStatus = 'No' | 'Shipped' | 'Yes';
export type ForSaleStatus = 'No' | 'Maybe' | 'Yes';

export interface Book {
  id: string;
  title: string;
  publisher: string;
  preOrderStartDate: string;
  estimatedDeliveryDate: string;
  ordered: boolean;
  delivered: DeliveryStatus;
  totalPrice: number;
  quantity: number;
  forSale: ForSaleStatus;
  soldFor: number | null;
}
