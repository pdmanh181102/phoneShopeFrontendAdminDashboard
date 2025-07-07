import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import HeaderTemplate from "./_template/header/header";

const ProductsPage = () => {
  return (
    <Flex vertical gap={10}>
      <HeaderTemplate />
      <BodyTemplate />
    </Flex>
  );
};

export default ProductsPage;
