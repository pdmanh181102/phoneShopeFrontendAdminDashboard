import { Button, ButtonProps } from "antd";
import { IoAddOutline } from "react-icons/io5";

const AddButton = ({ icon, ...props }: ButtonProps) => {
  return <Button icon={<IoAddOutline />} {...props} />;
};

export default AddButton;
