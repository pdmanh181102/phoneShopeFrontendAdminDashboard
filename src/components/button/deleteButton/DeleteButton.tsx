import { DeleteOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

const DeleteButton = ({ icon, ...props }: ButtonProps) => {
  return <Button icon={<DeleteOutlined />} {...props} />;
};

export default DeleteButton;
