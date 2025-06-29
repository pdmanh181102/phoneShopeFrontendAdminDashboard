import { Auditable } from "../auditable/Auditable";

export interface ProductStatusResponse extends Auditable {
  uid: string;
  name: string;
  description: string;
  isDefault: Boolean;
}
