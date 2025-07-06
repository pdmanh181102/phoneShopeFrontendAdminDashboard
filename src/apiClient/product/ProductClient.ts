import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductResponse } from "@/models/apiResponse/product/ProductResponse";
import { ProductLineResponse } from "@/models/apiResponse/productLine/ProductLineResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "products";

export interface ProductReadAllParams {
  brandUids: string[];
  statusUids: string[];
  productLineUids: string[];
  nameLike: string;
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

export default class ProductClient {
  /**
   * Tạo sản phẩm mới
   */
  static async create(data: { brandUid: string; name: string }): Promise<ProductResponse> {
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
      throw new Error(error.message || "Không thể tạo sản phẩm");
    }

    return response.json();
  }
  /**
   * Đọc sản phẩm theo uid
   */
  static async readByUid(uid: string): Promise<ProductResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductResponse;
  }
  /**
   * Đọc sản phẩm theo page
   */
  static async readAll({
    brandUids,
    statusUids,
    productLineUids,
    nameLike,
    page,
    size,
    sortBy,
    direction,
  }: ProductReadAllParams): Promise<PageResponse<ProductResponse>> {
    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      direction: direction,
      nameLike: nameLike,
    });
    brandUids.forEach((uid) => query.append("brandUids", uid));
    statusUids.forEach((uid) => query.append("statusUids", uid));
    productLineUids.forEach((uid) => query.append("productLineUids", uid));
    const url = `${ApiClientConfig.url}/${endPoint}?${query.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as PageResponse<ProductResponse>;
  }
  /**
   * cập nhật tên sản phẩm
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
      throw new Error(error.message || "Không thể cập nhật hình ảnh sản phẩm");
    }
  }
  /**
   * cập nhật trạng thái sản phẩm
   */
  static async updateStatus(uid: string, statusUid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/status`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statusUid }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật tên: ${response.status} - ${errorText}`);
    }
  }
  /**
   * cập nhật thương hiệu sản phẩm
   */
  static async updateBrand(uid: string, brandUid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/brand`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brandUid }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật tên: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Xóa sản phẩm theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa sản phẩm");
    }

    // Không cần return gì cho DELETE
  }
  /**
   * Kiểm tra tên sản phẩm có tồn tại không
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
      console.error("Error checking product line name:", response.statusText);
      return false;
    }

    const result = await response.json();

    return result.exists || false;
  }
  ///
  ///
  ///
  /// PRODUCT LINES
  ///
  ///
  /**
   * Đọc dòng sản phẩm theo sản phẩm
   */
  static async readAllProductLines(productUid: string, linked: boolean): Promise<ProductLineResponse[]> {
    const query = new URLSearchParams({
      linked: String(linked),
    });
    const url = `${ApiClientConfig.url}/${endPoint}/${productUid}/product-lines?${query.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductLineResponse[];
  }
  /**
   * cập nhật dòng sản phẩm
   */
  static async addProductLines(productUid: string, productLineUid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${productUid}/product-lines/${productLineUid}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật dòng sản phẩm: ${response.status} - ${errorText}`);
    }
  }
  static async removeProductLines(productUid: string, productLineUid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${productUid}/product-lines/${productLineUid}?isRemove=true`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật dòng sản phẩm: ${response.status} - ${errorText}`);
    }
  }
}
