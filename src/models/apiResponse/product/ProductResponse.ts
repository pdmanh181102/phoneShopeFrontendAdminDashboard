import { Auditable } from "../auditable/Auditable";
import { BrandResponse } from "../brand/BrandResponse";
import { ProductAttributeResponse } from "../productAttribute/ProductAttributeResponse";
import { ProductInventoryResponse } from "../productInventory/ProductInventoryResponse";
import { ProductLineResponse } from "../productLine/ProductLineResponse";
import { ProductPhotoResponse } from "../productPhoto/ProductPhotoResponse";
import { ProductStatusResponse } from "../productStatus/ProductStatusResponse";

export interface ProductResponse extends Auditable {
  uid: string;
  name: string;
  brand: BrandResponse;
  status: ProductStatusResponse;
  productLines: ProductLineResponse[];
  productPhotos: ProductPhotoResponse[];
  productAttributes: ProductAttributeResponse[];
  productInventory: ProductInventoryResponse;
}
