"use client";

import ProductStatusClient from "@/apiClient/productStatus/ProductStatusClient";
import DeleteButton from "@/components/button/deleteButton/DeleteButton";
import EditButton from "@/components/button/editButton/EditButton";
import { getMessageApi } from "@/context/message/MessageContext";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductStatusResponse } from "@/models/apiResponse/productStatus/ProductStatusResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Popconfirm, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useState } from "react";
import FormCreate from "./components/formCreate/FormCreate";

interface Pagination {
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

const BodyTemplate = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortBy: "name",
    direction: "ASC",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isFetching, refetch } = useQuery<PageResponse<ProductStatusResponse>>({
    queryKey: ["productStatus", pagination.page, pagination.size, pagination.sortBy, pagination.direction],
    queryFn: () => {
      return ProductStatusClient.readAll(pagination.page, pagination.size, pagination.sortBy, pagination.direction);
    },
  });

  // Mutation để xóa item
  const deleteItemMutation = useMutation({
    mutationFn: (uid: string) => ProductStatusClient.delete(uid),
    onSuccess: () => {
      getMessageApi().success("Xóa trạng thái sản phẩm thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa trạng thái sản phẩm");
    },
  });

  // Mutation để xóa item
  const setDefaultItemMutation = useMutation({
    mutationFn: (uid: string) => ProductStatusClient.updateDefaultStatus(uid),
    onSuccess: () => {
      getMessageApi().success("Đặt trạng thái mặc định thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi đặt trạng thái mặc định");
    },
  });

  const columns: TableColumnsType<ProductStatusResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên trạng thái sản phẩm",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Trạng thái",
        key: "isDefault",
        render: (_, record: ProductStatusResponse) =>
          record?.isDefault == true ? (
            "Mặc định"
          ) : (
            <Button size="small" type="primary" onClick={() => handleSetDefault(record.uid)}>
              Đặt làm mặc định
            </Button>
          ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Lần cập nhật cuối",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: ProductStatusResponse) => (
          <Flex gap={10} wrap>
            <Popconfirm
              title="Xóa trạng thái sản phẩm"
              description={`Bạn có chắc chắn muốn xóa trạng thái sản phẩm "${record.name}"?`}
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
    sorter: SorterResult<ProductStatusResponse> | SorterResult<any>[]
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
    return `/products/status/${uid}`;
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

  const handleSetDefault = (uid: string) => {
    setDefaultItemMutation.mutate(uid);
  };

  return (
    <>
      <Flex vertical gap={10}>
        <Flex gap={10}>
          <Button size="small" type="primary" onClick={handleAdd}>
            Thêm
          </Button>
          <Button size="small" onClick={handleRefresh} loading={isFetching}>
            Tải lại
          </Button>
        </Flex>
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
