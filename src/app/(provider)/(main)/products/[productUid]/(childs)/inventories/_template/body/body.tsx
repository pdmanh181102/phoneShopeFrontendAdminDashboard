"use client";

import ProductInventoryClient from "@/apiClient/productInventory/ProductInventoryClient";
import ConvertorHelper from "@/helpers/convertor/ConvertorHelper";
import { ProductInventoryResponse } from "@/models/apiResponse/productInventory/ProductInventoryResponse";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Descriptions, Flex } from "antd";
import { useState } from "react";
import FormAddQuantity from "./components/formAddQuantity/FormAddQuantity";
import FormChangeImportPrice from "./components/formChangeImportPrice/FormChangeImportPrice";
import FormChangeSalePrice from "./components/formChangeSalePrice/FormChangeSalePrice";
import FormMinusQuantity from "./components/formMinusQuantity/FormMinusQuantity";

interface Pagination {
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

interface TemplateProps {
  productUid: string;
}

const BodyTemplate = ({ productUid }: TemplateProps) => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortBy: "name",
    direction: "ASC",
  });

  const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
  const [showMinusQuantityModal, setShowMinusQuantityModal] = useState(false);
  const [showChangeImportPriceModal, setShowChangeImportPriceModal] = useState(false);
  const [showChangeSalePriceModal, setShowChangeSalePriceModal] = useState(false);

  const {
    data: inventoryData,
    isFetching,
    refetch,
  } = useQuery<ProductInventoryResponse>({
    queryKey: ["product-inventory", productUid],
    queryFn: () => {
      1;
      return ProductInventoryClient.readByUid(productUid);
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleAdd = () => {
    setShowAddQuantityModal(true);
  };
  const handleMinus = () => {
    setShowMinusQuantityModal(true);
  };
  const handleChangeImportPrice = () => {
    setShowChangeImportPriceModal(true);
  };
  const handleChangeSalePrice = () => {
    setShowChangeSalePriceModal(true);
  };

  const handleAddQuantitySuccess = () => {
    setShowAddQuantityModal(false);
    removeCache();
    refetch();
  };

  const handleAddQuantityCancel = () => {
    setShowAddQuantityModal(false);
  };

  const handleMinusQuantitySuccess = () => {
    setShowMinusQuantityModal(false);
    removeCache();
    refetch();
  };

  const handleMinusQuantityCancel = () => {
    setShowMinusQuantityModal(false);
  };

  const handleChangeImportPriceSuccess = () => {
    setShowChangeImportPriceModal(false);
    removeCache();
    refetch();
  };

  const handleChangeImportPriceCancel = () => {
    setShowChangeImportPriceModal(false);
  };

  const handleChangeSalePriceSuccess = () => {
    setShowChangeSalePriceModal(false);
    removeCache();
    refetch();
  };

  const handleChangeSalePriceCancel = () => {
    setShowChangeSalePriceModal(false);
  };

  const removeCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["product-inventory", productUid],
    });
    queryClient.invalidateQueries({
      queryKey: ["product", productUid],
    });
  };

  return (
    <>
      <Flex vertical gap={10}>
        <Flex gap={10}>
          <Button size="small" onClick={handleRefresh} loading={isFetching}>
            Tải lại
          </Button>
        </Flex>
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
          <Descriptions.Item label="Số lượng">{ConvertorHelper.PrintNumber(inventoryData?.totalItem)}</Descriptions.Item>
          <Descriptions.Item label="Còn lại">{ConvertorHelper.PrintNumber(inventoryData?.leftItem)}</Descriptions.Item>
          <Descriptions.Item label="Giá nhập">{ConvertorHelper.PrintMoney(inventoryData?.importPrice)}</Descriptions.Item>
          <Descriptions.Item label="Giá bán">{ConvertorHelper.PrintMoney(inventoryData?.salePrice)}</Descriptions.Item>
        </Descriptions>
        <Flex gap={10}>
          <Button size="small" onClick={handleAdd} loading={isFetching}>
            Thêm
          </Button>
          <Button size="small" onClick={handleMinus} loading={isFetching}>
            Bớt
          </Button>
          <Button size="small" onClick={handleChangeImportPrice} loading={isFetching}>
            Đổi giá nhập
          </Button>
          <Button size="small" onClick={handleChangeSalePrice} loading={isFetching}>
            Đổi giá bán
          </Button>
        </Flex>
      </Flex>
      <FormAddQuantity
        visible={showAddQuantityModal}
        productUid={productUid}
        onSuccess={handleAddQuantitySuccess}
        onCancel={handleAddQuantityCancel}
      />
      <FormMinusQuantity
        visible={showMinusQuantityModal}
        productUid={productUid}
        onSuccess={handleMinusQuantitySuccess}
        onCancel={handleMinusQuantityCancel}
      />
      <FormChangeImportPrice
        visible={showChangeImportPriceModal}
        productUid={productUid}
        onSuccess={handleChangeImportPriceSuccess}
        onCancel={handleChangeImportPriceCancel}
      />{" "}
      <FormChangeSalePrice
        visible={showChangeSalePriceModal}
        productUid={productUid}
        onSuccess={handleChangeSalePriceSuccess}
        onCancel={handleChangeSalePriceCancel}
      />
    </>
  );
};

export default BodyTemplate;
