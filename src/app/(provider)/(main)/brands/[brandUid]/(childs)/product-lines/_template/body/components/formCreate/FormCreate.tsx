import ProductLineClient from "@/apiClient/productLine/ProductLineClient";
import { getMessageApi } from "@/context/message/MessageContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";

interface FormCreateProps {
  brandUid: string;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
}

const FormCreate: React.FC<FormCreateProps> = ({ brandUid, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm<FormData>();
  const [nameToCheck, setNameToCheck] = useState<string>("");

  // Mutation để tạo brand mới
  const createBrandMutation = useMutation({
    mutationFn: (data: FormData) => ProductLineClient.create(brandUid, data),
    onSuccess: () => {
      getMessageApi().success("Thêm dòng sản phẩm thành công!");
      form.resetFields();
      setNameToCheck("");
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi thêm dòng sản phẩm");
    },
  });

  // Query để check tên brand có tồn tại không với debounce
  const { data: isNameExists, isFetching: isCheckingName } = useQuery({
    queryKey: ["check-brand-name", nameToCheck],
    queryFn: () => ProductLineClient.checkNameExists(brandUid, nameToCheck),
    enabled: nameToCheck.length >= 2, // Chỉ check khi có ít nhất 2 ký tự
    staleTime: 30000, // Cache 30 giây
  });

  // Debounce function để delay việc gọi API
  const debouncedSetNameToCheck = useCallback(
    debounce((value: string) => {
      setNameToCheck(value);
    }, 500), // Delay 500ms
    []
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Nếu tên đã tồn tại, không cho submit
      if (isNameExists) {
        getMessageApi().error("Tên dòng sản phẩm đã tồn tại!");
        return;
      }

      createBrandMutation.mutate(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setNameToCheck("");
    onCancel();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    // Clear previous check state khi user thay đổi input
    if (value.length < 2) {
      setNameToCheck("");
    } else {
      // Sử dụng debounce để delay việc gọi API
      debouncedSetNameToCheck(value);
    }
  };

  // Custom validator cho tên brand
  const validateBrandName = async (_: any, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Vui lòng nhập tên dòng sản phẩm"));
    }

    if (value.trim().length < 2) {
      return Promise.reject(new Error("Tên dòng sản phẩm phải có ít nhất 2 ký tự"));
    }

    if (value.trim().length > 100) {
      return Promise.reject(new Error("Tên dòng sản phẩm không được vượt quá 100 ký tự"));
    }

    // Kiểm tra trùng lặp với database
    if (value.trim() === nameToCheck && isNameExists) {
      return Promise.reject(new Error("Tên dòng sản phẩm đã tồn tại"));
    }

    return Promise.resolve();
  };

  return (
    <Modal title="Thêm dòng sản phẩm mới" open={visible} onCancel={handleCancel} footer={null} width={500} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Tên dòng sản phẩm"
          name="name"
          rules={[{ validator: validateBrandName }]}
          validateStatus={isCheckingName ? "validating" : isNameExists ? "error" : nameToCheck.length >= 2 && !isNameExists ? "success" : ""}
          help={
            isCheckingName
              ? "Đang kiểm tra tên..."
              : isNameExists
              ? "Tên dòng sản phẩm đã tồn tại"
              : nameToCheck.length >= 2 && !isNameExists
              ? "Tên dòng sản phẩm có thể sử dụng"
              : ""
          }
        >
          <Input autoFocus={true} placeholder="Nhập tên dòng sản phẩm" onChange={handleNameChange} maxLength={100} showCount />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createBrandMutation.isPending} disabled={isCheckingName || isNameExists}>
              Thêm dòng sản phẩm
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCreate;
