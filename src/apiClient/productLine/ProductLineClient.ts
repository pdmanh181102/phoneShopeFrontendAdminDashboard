import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductLineResponse } from "@/models/apiResponse/productLine/ProductLineResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "product-lines";

export default class ProductLineClient {
  /**
   * Tạo dòng sản phẩm mới
   */
  static async create(brandUid: string, data: { name: string }): Promise<ProductLineResponse> {
    const url = `${ApiClientConfig.url}/brands/${brandUid}/${endPoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo dòng sản phẩm");
    }

    return response.json();
  }
  /**
   * Đọc dòng sản phẩm theo uid
   */
  static async readByUid(uid: string): Promise<ProductLineResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductLineResponse;
  }
  /**
   * Đọc dòng sản phẩm theo page
   */
  static async readAll(
    brandUid: string,
    page: number,
    size: number,
    sortBy: string,
    direction: "ASC" | "DESC"
  ): Promise<PageResponse<ProductLineResponse>> {
    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      direction: direction,
    });
    const url = `${ApiClientConfig.url}/brands/${brandUid}/${endPoint}?${query.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as PageResponse<ProductLineResponse>;
  }
  /**
   * cập nhật tên dòng sản phẩm
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
   * Xóa dòng sản phẩm theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa dòng sản phẩm");
    }

    // Không cần return gì cho DELETE
  }
  /**
   * Kiểm tra tên dòng sản phẩm có tồn tại không
   */
  static async checkNameExists(brandUid: string, name: string): Promise<boolean> {
    if (!name || name.trim().length === 0) {
      return false;
    }

    const query = new URLSearchParams({
      name,
    });

    const url = `${ApiClientConfig.url}/brands/${brandUid}/${endPoint}/exists?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Error checking product line name:", response.statusText);
      return false;
    }

    const result = await response.json();

    return result.exists || false;
  }
}
