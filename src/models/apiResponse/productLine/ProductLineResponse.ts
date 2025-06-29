import { Auditable } from "../auditable/Auditable";

export interface ProductLineResponse extends Auditable {
  uid: string;
  name: string;
}
