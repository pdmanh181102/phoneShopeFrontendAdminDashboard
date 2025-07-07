import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import FooterTemplate from "./_template/footer/footer";
import HeaderTemplate from "./_template/header/header";

interface PageProps {
  params: {
    productUid: string;
  };
}

const ProductLinesPage = async ({ params }: PageProps) => {
  const { productUid } = await params;

  return (
    <Flex vertical gap={20}>
      <HeaderTemplate productUid={productUid} />
      <BodyTemplate productUid={productUid} />
      <FooterTemplate />
    </Flex>
  );
};

export default ProductLinesPage;
