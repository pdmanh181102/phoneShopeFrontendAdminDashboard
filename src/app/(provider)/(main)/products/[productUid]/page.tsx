import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import HeaderTemplate from "./_template/header/header";

interface PageProps {
  params: {
    productUid: string;
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const { productUid } = await params;

  return (
    <Flex vertical gap={20}>
      <HeaderTemplate productUid={productUid} />
      <BodyTemplate productUid={productUid} />
    </Flex>
  );
};

export default ProductPage;
