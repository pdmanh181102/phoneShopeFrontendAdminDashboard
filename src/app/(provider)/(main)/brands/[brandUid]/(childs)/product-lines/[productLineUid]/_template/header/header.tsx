"use client";

import BrandClient from "@/apiClient/brand/BrandClient";
import ProductLineClient from "@/apiClient/productLine/ProductLineClient";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Flex } from "antd";
interface TemplateProps {
  brandUid: string;
  productLineUid: string;
}

const HeaderTemplate = ({ brandUid, productLineUid }: TemplateProps) => {
  const { data: brandData } = useQuery({
    queryKey: ["brand", brandUid],
    queryFn: () => {
      return BrandClient.readByUid(brandUid);
    },
  });

  const { data: productLineData } = useQuery({
    queryKey: ["productLine", productLineUid],
    queryFn: () => {
      return ProductLineClient.readByUid(productLineUid);
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
            title: <a href={`/brands/${brandUid}`}>{brandData?.name}</a>,
          },
          {
            title: <a href={`/brands/${brandUid}/product-lines`}>Dòng sản phẩm</a>,
          },
          {
            title: productLineData?.name,
          },
        ]}
      />
      <h1>Quản lý dòng sản phẩm</h1>
    </Flex>
  );
};

export default HeaderTemplate;
