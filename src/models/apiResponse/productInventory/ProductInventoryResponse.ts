import { Auditable } from "../auditable/Auditable";

export interface ProductInventoryResponse extends Auditable {
  uid: string;
  importPrice: number;
  salePrice: number;
  totalItem: number;
  leftItem: number;
}
