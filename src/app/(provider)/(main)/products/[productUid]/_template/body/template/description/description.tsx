import SmallImage from "@/components/smallImage/SmallImage";
import DateHelper from "@/helpers/date/DateHelper";
import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { ProductResponse } from "@/models/apiResponse/product/ProductResponse";

import { Descriptions, Flex } from "antd";

type Props = {
  product: ProductResponse;
};

const ProductDescription = ({ product }: Props) => {
  return (
    <Flex vertical gap={10}>
      <h3>Sản phẩm</h3>
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
        <Descriptions.Item label="Tên sản phẩm">{product?.name}</Descriptions.Item>
        <Descriptions.Item label="Thương hiệu">
          <Flex justify="start" align="center" gap={10}>
            {product?.brand.name}
            <SmallImage src={PhotoUrlHelper.GetPhotoUrl(product?.brand.photoUrl)} alt={product?.brand.name} />
          </Flex>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{product?.status.name}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{DateHelper.StringToDate(product?.status.createdAt)}</Descriptions.Item>

        <Descriptions.Item label="Dòng">
          {product?.productLines.map((item) => (
            <p key={item.uid}>{item.name}</p>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
};

export default ProductDescription;
