"use client";

import ProductClient from "@/apiClient/product/ProductClient";
import { useQuery } from "@tanstack/react-query";
import { Button, Flex } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormEditName from "./components/formEditName/FormEditName";
import ProductAttribute from "./template/attribute/attribute";
import ProductDescription from "./template/description/description";
import ProductInventory from "./template/inventory/inventory";
import ProductPhoto from "./template/photo/ProductPhoto";

interface TemplateProps {
  productUid: string;
}

const BodyTemplate = ({ productUid }: TemplateProps) => {
  const router = useRouter();
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const { data: productData, refetch } = useQuery({
    queryKey: ["product", productUid],
    queryFn: () => {
      return ProductClient.readByUid(productUid);
    },
  });

  const handleEditProductLines = () => {
    router.push(`/products/${productUid}/product-lines`);
  };

  const handleEditAttributes = () => {
    router.push(`/products/${productUid}/attributes`);
  };

  const handleEditPhotos = () => {
    router.push(`/products/${productUid}/photos`);
  };

  const handleEditInventories = () => {
    router.push(`/products/${productUid}/inventories`);
  };

  const handleEditName = () => {
    setShowEditNameModal(true);
  };

  const handleCreateSuccess = () => {
    setShowEditNameModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleCreateCancel = () => {
    setShowEditNameModal(false);
  };

  return (
    <>
      <Flex vertical gap={100}>
        <Flex gap={10} wrap>
          <Button type="primary" size="small" onClick={handleEditName}>
            Sửa tên
          </Button>
          <Button size="small" onClick={handleEditProductLines}>
            Dòng sản phẩm
          </Button>
          <Button size="small" onClick={handleEditAttributes}>
            Thuộc tính sản phẩm
          </Button>
          <Button size="small" onClick={handleEditPhotos}>
            Hình ảnh
          </Button>
          <Button size="small" onClick={handleEditInventories}>
            Tồn kho
          </Button>
        </Flex>
        <ProductPhoto photos={productData?.productPhotos || []} />
        <ProductDescription product={productData!} />
        <ProductAttribute product={productData!} />
        <ProductInventory inventoryData={productData?.productInventory!} />
      </Flex>
      <FormEditName uid={productUid} visible={showEditNameModal} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
    </>
  );
};

export default BodyTemplate;
