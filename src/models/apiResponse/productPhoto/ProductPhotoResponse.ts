import { Auditable } from "../auditable/Auditable";

export interface ProductPhotoResponse extends Auditable {
  uid: string;
  photoUrl: string;
  isMain: boolean;
}
