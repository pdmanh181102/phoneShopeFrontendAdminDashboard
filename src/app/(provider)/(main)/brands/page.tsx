import { Flex } from "antd";
import BodyTemplate from "./template/body/body";
import FooterTemplate from "./template/footer/footer";
import HeaderTemplate from "./template/header/header";

const BrandsPage = () => {
  return (
    <Flex vertical gap={20}>
      <HeaderTemplate />
      <BodyTemplate />
      <FooterTemplate />
    </Flex>
  );
};

export default BrandsPage;
