import { Flex } from "antd";
import BodyTemplate from "./_template/body/body";
import HeaderTemplate from "./_template/header/header";

interface PageProps {
  params: {
    brandUid: string;
  };
}

const BrandPage = async ({ params }: PageProps) => {
  const { brandUid } = await params;

  return (
    <Flex vertical gap={20}>
      <HeaderTemplate brandUid={brandUid} />
      <BodyTemplate brandUid={brandUid} />
    </Flex>
  );
};

export default BrandPage;
