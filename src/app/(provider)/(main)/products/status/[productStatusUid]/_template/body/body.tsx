"use client";

import ProductStatusClient from "@/apiClient/productStatus/ProductStatusClient";
import { useQuery } from "@tanstack/react-query";
import { Button, Descriptions, Flex } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormEditDescription from "./components/formEditDescription/FormEditDescription";
import FormEditName from "./components/formEditName/FormEditName";

interface TemplateProps {
  productStatusUid: string;
}

const BodyTemplate = ({ productStatusUid }: TemplateProps) => {
  const router = useRouter();
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["productStatus", productStatusUid],
    queryFn: () => {
      return ProductStatusClient.readByUid(productStatusUid);
    },
  });

  const handleEditName = () => {
    setShowEditNameModal(true);
  };

  const handleEditNameSuccess = () => {
    setShowEditNameModal(false);
    refetch();
  };

  const handleEditNameCancel = () => {
    setShowEditNameModal(false);
  };

  const handleEditDescription = () => {
    setShowEditDescriptionModal(true);
  };

  const handleEditDescriptionSuccess = () => {
    setShowEditDescriptionModal(false);
    refetch();
  };

  const handleEditDescriptionCancel = () => {
    setShowEditDescriptionModal(false);
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
          <Descriptions.Item label="Tên trạng thái">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{data?.description}</Descriptions.Item>
        </Descriptions>
        <Flex gap={10}>
          <Button type="primary" size="small" onClick={handleEditName}>
            Sửa tên
          </Button>
          <Button type="primary" size="small" onClick={handleEditDescription}>
            Sửa mô tả
          </Button>
        </Flex>
      </Flex>
      <FormEditName uid={productStatusUid} visible={showEditNameModal} onSuccess={handleEditNameSuccess} onCancel={handleEditNameCancel} />
      <FormEditDescription
        uid={productStatusUid}
        visible={showEditDescriptionModal}
        onSuccess={handleEditDescriptionSuccess}
        onCancel={handleEditDescriptionCancel}
      />
    </>
  );
};

export default BodyTemplate;
