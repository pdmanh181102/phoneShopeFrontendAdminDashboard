import ConvertorHelper, { ProductAttributeGroup } from "@/helpers/convertor/ConvertorHelper";
import { ProductResponse } from "@/models/apiResponse/product/ProductResponse";
import { Collapse, Descriptions, Flex, Typography } from "antd";
import { useMemo } from "react";

type Props = {
  product: ProductResponse | undefined;
};

const { Text } = Typography;

const ProductAttribute = ({ product }: Props) => {
  const productAttributeGroups: ProductAttributeGroup[] = useMemo(() => {
    return ConvertorHelper.GroupProductAttributes(product?.productAttributes || []);
  }, [product?.productAttributes]);

  const collapseItems = productAttributeGroups.map((group) => ({
    key: group.name,
    label: (
      <Text strong style={{ fontSize: 16 }}>
        {group.name}
      </Text>
    ),
    children: (
      <Descriptions column={1} size="small" bordered>
        {group.attributes.map((attribute) => (
          <Descriptions.Item
            key={attribute.name}
            label={<strong>{attribute.name}</strong>}
            styles={{
              label: { maxWidth: 200, minWidth: "50%" },
            }}
          >
            {attribute.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    ),
  }));

  return (
    <Flex vertical gap={10}>
      <h3>Thuộc tính</h3>
      <Collapse items={collapseItems} defaultActiveKey={[productAttributeGroups[0]?.name]} bordered={false} />
    </Flex>
  );
};

export default ProductAttribute;
