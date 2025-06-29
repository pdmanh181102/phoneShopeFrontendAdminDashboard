"use client";
import BrandClient from "@/apiClient/brand/BrandClient";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Flex } from "antd";

interface TemplateProps {
  brandUid: string;
}

const HeaderTemplate = ({ brandUid }: TemplateProps) => {
  const { data: brandData } = useQuery({
    queryKey: ["brand", brandUid],
    queryFn: () => {
      return BrandClient.readByUid(brandUid);
    },
  });

  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <a href="/home">Home</a>,
          },
          {
            title: <a href="/brands">Thương hiệu</a>,
          },
          {
            title: brandData?.name,
          },
        ]}
      />
      <h1>Quản lý thương hiệu</h1>
    </Flex>
  );
};

export default HeaderTemplate;
