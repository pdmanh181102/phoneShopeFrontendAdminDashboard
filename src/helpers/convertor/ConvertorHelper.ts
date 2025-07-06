import { ProductAttributeResponse } from "@/models/apiResponse/productAttribute/ProductAttributeResponse";

export interface ProductAttributeGroup {
  name: string;
  attributes: ProductAttributeResponse[];
}

export default class ConvertorHelper {
  static GroupProductAttributes(productAttributes: ProductAttributeResponse[]): ProductAttributeGroup[] {
    const groupMap = new Map();

    productAttributes.forEach((attr) => {
      const groupName = attr.groupName ?? "Khác";
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName).push({
        uid: attr.uid,
        name: attr.name,
        value: attr.value,
      });
    });

    // Chuyển Map thành mảng groups
    const groups = Array.from(groupMap.entries()).map(([name, attributes]) => ({
      name,
      attributes,
    }));

    return groups;
  }

  static PrintMoney(money: number | undefined): string {
    if (money == undefined) return "N/A";
    return money.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
  static PrintNumber(num: number | undefined): string {
    if (num == undefined) return "N/A";
    return num.toLocaleString("vi-VN");
  }
}
