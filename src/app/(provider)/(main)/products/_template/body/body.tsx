"use client";

import ProductClient from "@/apiClient/product/ProductClient";
import DeleteButton from "@/components/button/deleteButton/DeleteButton";
import EditButton from "@/components/button/editButton/EditButton";
import SmallImage from "@/components/smallImage/SmallImage";
import { getMessageApi } from "@/context/message/MessageContext";
import DateHelper from "@/helpers/date/DateHelper";
import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { BrandResponse } from "@/models/apiResponse/brand/BrandResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductResponse } from "@/models/apiResponse/product/ProductResponse";
import { ProductPhotoResponse } from "@/models/apiResponse/productPhoto/ProductPhotoResponse";
import { ProductStatusResponse } from "@/models/apiResponse/productStatus/ProductStatusResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Popconfirm, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useState } from "react";
import ProductFilter, { initProductFilterParams, ProductFilterParams } from "./components/filter/ProductFilter";
import FormCreate from "./components/formCreate/FormCreate";

interface Pagination {
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

const BodyTemplate = () => {
  const [filterParams, setFilterParams] = useState<ProductFilterParams>(initProductFilterParams);

  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortBy: "name",
    direction: "ASC",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isFetching, refetch } = useQuery<PageResponse<ProductResponse>>({
    queryKey: ["products", { filterParams, pagination }],
    queryFn: () => {
      return ProductClient.readAll({
        ...filterParams,
        ...pagination,
      });
    },
  });

  // Mutation để xóa item
  const deleteItemMutation = useMutation({
    mutationFn: (uid: string) => ProductClient.delete(uid),
    onSuccess: () => {
      getMessageApi().success("Xóa sản phẩm thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa sản phẩm");
    },
  });

  const columns: TableColumnsType<ProductResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Thương hiệu",
        dataIndex: "brand",
        key: "brand",
        render: (brand: BrandResponse) => <>{brand.name}</>,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: ProductStatusResponse) => <>{status.name}</>,
      },
      {
        title: "Hình ảnh",
        key: "photo",
        render: (_, record: ProductResponse) => {
          const mainPhoto: ProductPhotoResponse | undefined = record.productPhotos.find((photo) => photo.isMain === true);
          if (mainPhoto != undefined) {
            return <SmallImage src={PhotoUrlHelper.GetPhotoUrl(mainPhoto.photoUrl)} />;
          }
          return "N/A";
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (date: string) => DateHelper.StringToDate(date),
      },
      {
        title: "Lần cập nhật cuối",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: true,
        render: (date: string) => DateHelper.StringToDate(date),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: ProductResponse) => (
          <Flex gap={10} wrap>
            <Popconfirm
              title="Xóa sản phẩm"
              description={`Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`}
              onConfirm={() => handleDelete(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <DeleteButton type="text" danger size="small" loading={deleteItemMutation.isPending}>
                Xóa
              </DeleteButton>
            </Popconfirm>
            <EditButton type="link" size="small" loading={deleteItemMutation.isPending} href={createLinkEdit(record.uid)}>
              Sửa
            </EditButton>
          </Flex>
        ),
      },
    ],
    [deleteItemMutation.isPending]
  );

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProductResponse> | SorterResult<any>[]
  ) => {
    const { current, pageSize } = paginationConfig;

    // Handle sorting
    let newSortBy = pagination.sortBy;
    let newDirection = pagination.direction;

    if (!Array.isArray(sorter) && sorter.field && sorter.order) {
      newSortBy = sorter.field as string;
      newDirection = sorter.order === "ascend" ? "ASC" : "DESC";
    }

    setPagination({
      page: (current || 1) - 1, // Convert to 0-based indexing
      size: pageSize || 10,
      sortBy: newSortBy,
      direction: newDirection,
    });
  };

  const createLinkEdit = (uid: string) => {
    return `/products/${uid}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleCreateCancel = () => {
    setShowCreateModal(false);
  };

  const handleDelete = (uid: string) => {
    deleteItemMutation.mutate(uid);
  };

  const handleFilterChange = (params: ProductFilterParams) => {
    setFilterParams(params);
  };

  return (
    <>
      <Flex vertical gap={30}>
        <Flex gap={10}>
          <Button size="small" type="primary" onClick={handleAdd}>
            Thêm
          </Button>
          <Button size="small" onClick={handleRefresh} loading={isFetching}>
            Tải lại
          </Button>
        </Flex>
        <ProductFilter onChange={handleFilterChange} />
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data?.content || []}
          rowKey="uid"
          onChange={handleTableChange}
          pagination={{
            current: pagination.page + 1, // Convert back to 1-based for display
            pageSize: pagination.size,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            total: data?.totalElements || 0,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          }}
        />
      </Flex>
      <FormCreate visible={showCreateModal} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
    </>
  );
};

export default BodyTemplate;
