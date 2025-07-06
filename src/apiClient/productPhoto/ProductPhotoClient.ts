import { ErrorResponse } from "@/models/apiError/ErrorResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductPhotoResponse } from "@/models/apiResponse/productPhoto/ProductPhotoResponse";
import ApiClientConfig from "../apiClientConfig";

const endPoint = "product-photos";

export default class ProductPhotoClient {
  /**
   * Tạo hình ảnh sản phẩm mới
   */
  static async create(productUid: string, photo: File): Promise<ProductPhotoResponse> {
    const url = `${ApiClientConfig.url}/products/${productUid}/${endPoint}`;
    const formData = new FormData();
    formData.append("photo", photo);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể tạo hình ảnh sản phẩm");
    }

    return response.json();
  }
  /**
   * Đọc hình ảnh sản phẩm theo uid
   */
  static async readByUid(uid: string): Promise<ProductPhotoResponse> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      const error = response.json() as unknown as ErrorResponse;
      throw error;
    }
    const data = response.json();
    return data as unknown as ProductPhotoResponse;
  }
  /**
   * Đọc hình ảnh sản phẩm theo page
   */
  static async readAll(
    productUid: string,
    page: number,
    size: number,
    sortBy: string,
    direction: "ASC" | "DESC"
  ): Promise<PageResponse<ProductPhotoResponse>> {
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
    return data as unknown as PageResponse<ProductPhotoResponse>;
  }
  /**
   * cập nhật mặc định hình ảnh sản phẩm
   */
  static async updateIsMain(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}/is-main`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi cập nhật tên: ${response.status} - ${errorText}`);
    }
  }

  /**
   * Xóa hình ảnh sản phẩm theo UID
   */
  static async delete(uid: string): Promise<void> {
    const url = `${ApiClientConfig.url}/${endPoint}/${uid}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể xóa hình ảnh sản phẩm");
    }

    // Không cần return gì cho DELETE
  }
}
