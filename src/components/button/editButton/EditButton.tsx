import { EditOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

const EditButton = ({ icon, ...props }: ButtonProps) => {
  return <Button icon={<EditOutlined />} {...props} />;
};

export default EditButton;
