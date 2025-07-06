import { Auditable } from "../auditable/Auditable";

export interface ProductAttributeResponse extends Auditable {
  uid: string;
  name: string;
  value: string;
  groupName: string;
}
