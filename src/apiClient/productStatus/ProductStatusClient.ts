import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductStatusResponse } from "@/models/apiResponse/productStatus/ProductStatusResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "product-status";

export default class ProductStatusClient {
  /**
   * Tạo product status mới
   */
  static async create(data: { name: string }): Promise<ProductStatusResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo trạng thái sản phẩm");
    }

    return response.json();
  }
  /**
   * Đọc product status theo uid
   */
  static async readByUid(uid: string): Promise<ProductStatusResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductStatusResponse;
  }
  /**
   * Đọc product status theo page
   */
  static async readAll(page: number, size: number, sortBy: string, direction: "ASC" | "DESC"): Promise<PageResponse<ProductStatusResponse>> {
    const query = new URLSearchParams({
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
    return data as unknown as PageResponse<ProductStatusResponse>;
  }
  /**
   * cập nhật tên
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
   * cập nhật mô tả
   */
  static async updateDescription(uid: string, description: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/description`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật mô tả: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật trạng thái mặc định
   */
  static async updateDefaultStatus(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/default`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật trạng thái mặc định: ${response.status} - ${errorText}`);
    }
  }
  /**
   * Xóa product status theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa trạng thái sản phẩm");
    }

    // Không cần return gì cho DELETE
  }
  /**
   * Kiểm tra tên product status có tồn tại không
   */
  static async checkNameExists(name: string): Promise<boolean> {
    if (!name || name.trim().length === 0) {
      return false;
    }

    const query = new URLSearchParams({
      name,
    });

    const url = `${ApiClientConfig.url}/${endPoint}/exists?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Error checking product status name:", response.statusText);
      return false;
    }

    const result = await response.json();

    return result.exists || false;
  }
}
