import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import HeaderTemplate from "./_template/header/header";

interface PageProps {
  params: {
    brandUid: string;
    productLineUid: string;
  };
}

const ProductLinePage = async ({ params }: PageProps) => {
  const { brandUid, productLineUid } = await params;
  return (
    <Flex vertical gap={20}>
      <HeaderTemplate brandUid={brandUid} productLineUid={productLineUid} />
      <BodyTemplate brandUid={brandUid} productLineUid={productLineUid} />
    </Flex>
  );
};

export default ProductLinePage;
