"use client";

import BrandClient from "@/apiClient/brand/BrandClient";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Flex } from "antd";
interface TemplateProps {
  brandUid: string;
  productLineUid: string;
}

const HeaderTemplate = ({ brandUid, productLineUid }: TemplateProps) => {
  const { data, isFetching, refetch } = useQuery({
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
            title: <a href={`/brands/${brandUid}`}>{data?.name}</a>,
          },
          {
            title: "Dòng sản phẩm",
          },
        ]}
      />
      <h1>Quản lý dòng sản phẩm</h1>
    </Flex>
  );
};

export default HeaderTemplate;
