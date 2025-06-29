import { Breadcrumb, Flex } from "antd";

const HeaderTemplate = () => {
  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <a href="/home">Home</a>,
          },
          {
            title: "Trạng thái sản phẩm",
          },
        ]}
      />
      <h1>Quản lý trạng thái sản phẩm</h1>
    </Flex>
  );
};

export default HeaderTemplate;
