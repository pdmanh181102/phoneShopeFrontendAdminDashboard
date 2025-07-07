import ProductInventoryClient from "@/apiClient/productInventory/ProductInventoryClient";
import { getMessageApi } from "@/context/message/MessageContext";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import React from "react";

interface FormProps {
  visible: boolean;
  productUid: string;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  number: number;
}

const FormMinusQuantity: React.FC<FormProps> = ({ visible, productUid, onCancel, onSuccess }) => {
  const [form] = Form.useForm<FormData>();

  // Mutation để tạo item mới
  const createItemMutation = useMutation({
    mutationFn: (data: FormData) => ProductInventoryClient.updateMinusQuantity(productUid, data.number),
    onSuccess: () => {
      getMessageApi().success("Cập nhật số lượng thành công!");
      form.resetFields();
      onSuccess();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi Cập nhật số lượng");
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
  const validateItemName = async (_: any, value: number) => {
    if (value <= 0) {
      return Promise.reject(new Error("Số lượng phải lớn hơn 0"));
    }

    return Promise.resolve();
  };

  return (
    <Modal title="Bớt sản phẩm" open={visible} onCancel={handleCancel} footer={null} width={500} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item label="Số lượng" name="number" rules={[{ validator: validateItemName }]}>
          <Input placeholder="Nhập số lượng" min={1} showCount />
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

export default FormMinusQuantity;
