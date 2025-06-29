"use client";
import ProductStatusClient from "@/apiClient/productStatus/ProductStatusClient";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Flex } from "antd";

interface TemplateProps {
  productStatusUid: string;
}

const HeaderTemplate = ({ productStatusUid }: TemplateProps) => {
  const { data: productStatusData } = useQuery({
    queryKey: ["productStatus", productStatusUid],
    queryFn: () => {
      return ProductStatusClient.readByUid(productStatusUid);
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
            title: <a href="/products/status">Trạng thái sản phẩm</a>,
          },
          {
            title: productStatusData?.name,
          },
        ]}
      />
      <h1>Quản lý trạng thái sản phẩm</h1>
    </Flex>
  );
};

export default HeaderTemplate;
