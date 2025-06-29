import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import HeaderTemplate from "./_template/header/header";

interface PageProps {
  params: {
    productStatusUid: string;
  };
}

const ProductStatusPage = async ({ params }: PageProps) => {
  const { productStatusUid } = await params;

  return (
    <Flex vertical gap={20}>
      <HeaderTemplate productStatusUid={productStatusUid} />
      <BodyTemplate productStatusUid={productStatusUid} />
    </Flex>
  );
};

export default ProductStatusPage;
