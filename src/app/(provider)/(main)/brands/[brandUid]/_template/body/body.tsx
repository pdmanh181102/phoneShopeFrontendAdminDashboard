"use client";

import BrandClient from "@/apiClient/brand/BrandClient";
import EditButton from "@/components/button/editButton/EditButton";
import FileButton from "@/components/button/fileButton/FileButton";
import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { useQuery } from "@tanstack/react-query";
import { Button, Descriptions, Flex, Image } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormEditName from "./components/formEditName/FormEditName";

interface TemplateProps {
  brandUid: string;
}

const BodyTemplate = ({ brandUid }: TemplateProps) => {
  const router = useRouter();
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["brand", brandUid],
    queryFn: () => {
      return BrandClient.readByUid(brandUid);
    },
  });

  const handleSelectFile = async (photo: File) => {
    if (!brandUid || !photo) return;

    try {
      await BrandClient.updatePhoto(brandUid, photo);
      await refetch(); // Cập nhật lại dữ liệu brand sau khi đổi ảnh
    } catch (error: any) {
      console.error("Lỗi khi cập nhật ảnh:", error.message);
    }
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

  const handleGotoProductLine = () => {
    router.push(`/brands/${brandUid}/product-lines`);
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
          <Descriptions.Item label="Tên thương hiệu">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Ảnh đại diện">
            <Image width={100} src={PhotoUrlHelper.GetPhotoUrl(data?.photoUrl)} alt="Photo" />
          </Descriptions.Item>
        </Descriptions>
        <Flex gap={10}>
          <Button type="primary" size="small" onClick={handleEditName}>
            Sửa tên
          </Button>
          <FileButton size="small" onSelectFile={handleSelectFile}>
            Đổi ảnh
          </FileButton>
        </Flex>
        <Flex gap={10}>
          <EditButton onClick={handleGotoProductLine}>Dòng sản phẩm</EditButton>
        </Flex>
      </Flex>
      <FormEditName uid={brandUid} visible={showEditNameModal} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
    </>
  );
};

export default BodyTemplate;
