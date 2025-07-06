import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { ProductInventoryResponse } from "@/models/apiResponse/productInventory/ProductInventoryResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "product-inventories";

export default class ProductInventoryClient {
  /**
   * Đọc tồn kho theo uid
   */
  static async readByUid(productUid: string): Promise<ProductInventoryResponse> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductInventoryResponse;
  }

  /**
   * cập nhật thêm số lượng
   */
  static async updateAddQuantity(productUid: string, number: number): Promise<void> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}/quantity/add/${number}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật thêm sản phẩm: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật bớt số lượng
   */
  static async updateMinusQuantity(productUid: string, number: number): Promise<void> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}/quantity/minus/${number}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật bớt sản phẩm: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật giá nhập
   */
  static async updateImportPrice(productUid: string, price: number): Promise<void> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}/price/import/${price}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật giá nhập sản phẩm: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật giá bạn
   */
  static async updateSalePrice(productUid: string, price: number): Promise<void> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}/price/sale/${price}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật giá bán sản phẩm: ${response.status} - ${errorText}`);
    }
  }
}
