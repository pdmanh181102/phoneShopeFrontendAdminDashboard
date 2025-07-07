import ConvertorHelper from "@/helpers/convertor/ConvertorHelper";
import { ProductInventoryResponse } from "@/models/apiResponse/productInventory/ProductInventoryResponse";
import { Descriptions, Flex } from "antd";

type Props = {
  inventoryData: ProductInventoryResponse;
};

const ProductInventory = ({ inventoryData }: Props) => {
  return (
    <Flex vertical gap={10}>
      <h3>Tồn kho</h3>
      <Descriptions
        bordered
        column={1}
        styles={{
          label: { fontWeight: "bold", width: "150px" },
          content: {
            maxWidth: "500px",
          },
        }}
      >
        <Descriptions.Item label="Số lượng">{ConvertorHelper.PrintNumber(inventoryData?.totalItem)}</Descriptions.Item>
        <Descriptions.Item label="Còn lại">{ConvertorHelper.PrintNumber(inventoryData?.leftItem)}</Descriptions.Item>
        <Descriptions.Item label="Giá nhập">{ConvertorHelper.PrintMoney(inventoryData?.importPrice)}</Descriptions.Item>
        <Descriptions.Item label="Giá bán">{ConvertorHelper.PrintMoney(inventoryData?.salePrice)}</Descriptions.Item>
      </Descriptions>
    </Flex>
  );
};

export default ProductInventory;
