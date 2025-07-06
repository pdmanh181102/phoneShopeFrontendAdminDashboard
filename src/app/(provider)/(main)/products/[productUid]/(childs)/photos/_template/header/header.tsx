"use client";
import ProductClient from "@/apiClient/product/ProductClient";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Flex } from "antd";

interface TemplateProps {
  productUid: string;
}

const HeaderTemplate = ({ productUid }: TemplateProps) => {
  const { data: productData } = useQuery({
    queryKey: ["product", productUid],
    queryFn: () => {
      return ProductClient.readByUid(productUid);
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
            title: <a href="/products">Sản phẩm</a>,
          },
          {
            title: <a href={`/products/${productUid}`}>{productData?.name}</a>,
          },
          {
            title: "Hình ảnh",
          },
        ]}
      />
      <h1>Quản lý hình ảnh sản phẩm</h1>
    </Flex>
  );
};

export default HeaderTemplate;
