import ProductAttributeClient from "@/apiClient/productAttribute/ProductAttributeClient";
import { getMessageApi } from "@/context/message/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
  visible: boolean;
  uid: string;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  value: string;
}

const FormEditValue: React.FC<FormProps> = ({ visible, uid, onCancel, onSuccess }) => {
  const [form] = Form.useForm<FormData>();

  // Mutation để tạo item mới
  const createItemMutation = useMutation({
    mutationFn: (data: FormData) => ProductAttributeClient.updateValue(uid, data.value),
    onSuccess: () => {
      getMessageApi().success("Sửa giá trị thuộc tính sản phẩm thành công!");
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi sửa giá trị thuộc tính sản phẩm");
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
      return Promise.reject(new Error("Vui lòng nhập giá trị thuộc tính sản phẩm"));
    }

    if (value.trim().length < 2) {
      return Promise.reject(new Error("giá trị thuộc tính sản phẩm phải có ít nhất 2 ký tự"));
    }

    if (value.trim().length > 100) {
      return Promise.reject(new Error("giá trị thuộc tính sản phẩm không được vượt quá 100 ký tự"));
    }

    return Promise.resolve();
  };

  return (
    <Modal title="Sửa giá trị thuộc tính sản phẩm" open={visible} onCancel={handleCancel} footer={null} width={500} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="giá trị thuộc tính sản phẩm" name="value" rules={[{ validator: validateItemName }]}>
          <Input placeholder="Nhập giá trị thuộc tính sản phẩm" maxLength={100} showCount />
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

export default FormEditValue;
