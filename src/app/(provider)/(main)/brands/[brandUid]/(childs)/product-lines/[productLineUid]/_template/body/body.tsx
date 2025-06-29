"use client";

import ProductLineClient from "@/apiClient/productLine/ProductLineClient";
import { useQuery } from "@tanstack/react-query";
import { Button, Descriptions, Flex } from "antd";
import { useState } from "react";
import FormEditName from "./components/formEditName/FormEditName";

interface TemplateProps {
  brandUid: string;
  productLineUid: string;
}

const BodyTemplate = ({ brandUid, productLineUid }: TemplateProps) => {
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["productLine", productLineUid],
    queryFn: () => {
      return ProductLineClient.readByUid(productLineUid);
    },
  });

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
      <Flex vertical gap={20}>
        <Descriptions
          bordered
          column={1}
          styles={{
            label: { fontWeight: "bold", width: "150px" },
            content: {
              maxWidth: "500px",
            },
          }}
        >
          <Descriptions.Item label="Tên dòng sản phẩm">{data?.name}</Descriptions.Item>
        </Descriptions>
        <Flex gap={10}>
          <Button type="primary" size="small" onClick={handleEditName}>
            Sửa tên
          </Button>
        </Flex>
      </Flex>
      <FormEditName
        brandUid={brandUid}
        uid={productLineUid}
        visible={showEditNameModal}
        onSuccess={handleCreateSuccess}
        onCancel={handleCreateCancel}
      />
    </>
  );
};

export default BodyTemplate;
