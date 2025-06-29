import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import FooterTemplate from "./_template/footer/footer";
import HeaderTemplate from "./_template/header/header";

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
