import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductAttributeResponse } from "@/models/apiResponse/productAttribute/ProductAttributeResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "product-attributes";

export default class ProductAttributeClient {
  /**
   * Tạo thuộc tính sản phẩm mới
   */
  static async create(productUid: string, data: { name: string }): Promise<ProductAttributeResponse> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo thuộc tính sản phẩm");
    }

    return response.json();
  }
  /**
   * Đọc thuộc tính sản phẩm theo uid
   */
  static async readByUid(uid: string): Promise<ProductAttributeResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductAttributeResponse;
  }
  /**
   * Đọc thuộc tính sản phẩm theo page
   */
  static async readAll(
    productUid: string,
    page: number,
    size: number,
    sortBy: string,
    direction: "ASC" | "DESC"
  ): Promise<PageResponse<ProductAttributeResponse>> {
    const query = new URLSearchParams({
      productUid: productUid,
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      direction: direction,
    });
    const url = `${ApiClientConfig.url}/${endPoint}?${query.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as PageResponse<ProductAttributeResponse>;
  }
  /**
   * cập nhật tên thuộc tính sản phẩm
   */
  static async updateName(uid: string, name: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/name`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật tên: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật value thuộc tính sản phẩm
   */
  static async updateValue(uid: string, value: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/value`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật value: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật value thuộc tính sản phẩm
   */
  static async updateGroupName(uid: string, groupName: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/group-name`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật value: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Xóa thuộc tính sản phẩm theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa thuộc tính sản phẩm");
    }

    // Không cần return gì cho DELETE
  }

  /**
   * Kiểm tra tên thuộc tính sản phẩm có tồn tại không
   */
  static async checkNameExists(produtUid: string, name: string): Promise<boolean> {
    if (!name || name.trim().length === 0) {
      return false;
    }

    const query = new URLSearchParams({
      name,
    });

    const url = `${ApiClientConfig.url}/products/${produtUid}/${endPoint}/exists?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Error checking product attribute name:", response.statusText);
      return false;
    }

    const result = await response.json();

    return result.exists || false;
  }
}
