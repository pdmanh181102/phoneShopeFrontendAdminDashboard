import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { BrandResponse } from "@/models/apiResponse/brand/BrandResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "brands";

export default class BrandClient {
  /**
   * Tạo brand mới
   */
  static async create(data: { name: string }): Promise<BrandResponse> {
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
      throw new Error(error.message || "Không thể tạo thương hiệu");
    }

    return response.json();
  }
  /**
   * Đọc brand theo uid
   */
  static async readByUid(uid: string): Promise<BrandResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as BrandResponse;
  }
  /**
   * Đọc brand theo page
   */
  static async readAll(page: number, size: number, sortBy: string, direction: "ASC" | "DESC"): Promise<PageResponse<BrandResponse>> {
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
    return data as unknown as PageResponse<BrandResponse>;
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
   * cập nhật hình ảnh
   */
  static async updatePhoto(uid: string, photo: File): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/photo`;

    const formData = new FormData();
    formData.append("photo", photo);

    const response = await fetch(url, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể cập nhật hình ảnh thương hiệu");
    }
  }
  /**
   * Xóa brand theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa thương hiệu");
    }

    // Không cần return gì cho DELETE
  }
  /**
   * Kiểm tra tên brand có tồn tại không
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
      console.error("Error checking brand name:", response.statusText);
      return false;
    }

    const result = await response.json();

    return result.exists || false;
  }
}
