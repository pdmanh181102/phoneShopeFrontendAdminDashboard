import { Auditable } from "../auditable/Auditable";

export interface BrandResponse extends Auditable {
  uid: string;
  name: string;
  photoUrl: string;
}
