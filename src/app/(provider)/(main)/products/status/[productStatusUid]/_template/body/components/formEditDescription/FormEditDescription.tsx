import ProductStatusClient from "@/apiClient/productStatus/ProductStatusClient";
import { getMessageApi } from "@/context/message/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

interface FormEditNameProps {
  visible: boolean;
  uid: string;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
}

const FormEditDescription: React.FC<FormEditNameProps> = ({ visible, uid, onCancel, onSuccess }) => {
  const [form] = Form.useForm<FormData>();

  // Mutation để tạo item mới
  const createItemMutation = useMutation({
    mutationFn: (data: FormData) => ProductStatusClient.updateDescription(uid, data.name),
    onSuccess: () => {
      getMessageApi().success("Sửa mô tả trạng thái sản phẩm thành công!");
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi sửa mô tả trạng thái sản phẩm");
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      createItemMutation.mutate(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Custom validator cho tên item
  const validateItemName = async (_: any, value: string) => {
    if (!value || value.trim().length === 0) {
      return Promise.reject(new Error("Vui lòng nhập mô tả trạng thái sản phẩm"));
    }

    if (value.trim().length < 2) {
      return Promise.reject(new Error("Mô tả trạng thái sản phẩm phải có ít nhất 2 ký tự"));
    }

    if (value.trim().length > 100) {
      return Promise.reject(new Error("Mô tả trạng thái sản phẩm không được vượt quá 100 ký tự"));
    }

    return Promise.resolve();
  };

  return (
    <Modal title="Sửa mô tả trạng thái sản phẩm" open={visible} onCancel={handleCancel} footer={null} width={500} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="Mô tả trạng thái sản phẩm" name="name" rules={[{ validator: validateItemName }]}>
          <TextArea rows={4} placeholder="Nhập mô tả trạng thái sản phẩm" maxLength={200} showCount />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createItemMutation.isPending}>
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormEditDescription;
