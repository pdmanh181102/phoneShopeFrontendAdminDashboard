"use client";

import ProductPhotoClient from "@/apiClient/productPhoto/ProductPhotoClient";
import DeleteButton from "@/components/button/deleteButton/DeleteButton";
import EditButton from "@/components/button/editButton/EditButton";
import FileButton from "@/components/button/fileButton/FileButton";
import ProductImage from "@/components/produtImage/ProductImage";
import { getMessageApi } from "@/context/message/MessageContext";
import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductPhotoResponse } from "@/models/apiResponse/productPhoto/ProductPhotoResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Popconfirm, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useState } from "react";

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

  const { data, isFetching, refetch } = useQuery<PageResponse<ProductPhotoResponse>>({
    queryKey: ["product-photos", productUid, pagination.page, pagination.size, pagination.sortBy, pagination.direction],
    queryFn: () => {
      1;
      return ProductPhotoClient.readAll(productUid, pagination.page, pagination.size, pagination.sortBy, pagination.direction);
    },
  });

  // Mutation để thêm item
  const createItemMutation = useMutation({
    mutationFn: (photo: File) => ProductPhotoClient.create(productUid, photo),
    onSuccess: () => {
      getMessageApi().success("Thêm hình ảnh sản phẩm thành công!");
      refetch(); // Refresh danh sách sau khi Thêm
      queryClient.invalidateQueries({
        queryKey: ["product", productUid],
      });
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi Thêm hình ảnh sản phẩm");
    },
  });

  // Mutation để thêm item
  const setIsMainItemMutation = useMutation({
    mutationFn: (uid: string) => ProductPhotoClient.updateIsMain(uid),
    onSuccess: () => {
      getMessageApi().success("Đặt hình ảnh sản phẩm làm mặc định thành công!");
      refetch(); // Refresh danh sách sau khi Thêm
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi Đặt hình ảnh sản phẩm làm mặc định");
    },
  });

  // Mutation để xóa item
  const deleteItemMutation = useMutation({
    mutationFn: (uid: string) => ProductPhotoClient.delete(uid),
    onSuccess: () => {
      getMessageApi().success("Xóa hình ảnh sản phẩm thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa hình ảnh sản phẩm");
    },
  });

  const columns: TableColumnsType<ProductPhotoResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Hình ảnh",
        dataIndex: "photoUrl",
        key: "photoUrl",
        render: (url: string) => <ProductImage src={PhotoUrlHelper.GetPhotoUrl(url)} />,
      },
      {
        title: "Trạng thái",
        dataIndex: "isMain",
        key: "isMain",
        sorter: true,
        render: (isMain: boolean) => (isMain == true ? "Ảnh đại diện" : ""),
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
        render: (_, record: ProductPhotoResponse) => (
          <Flex gap={10} wrap>
            <Popconfirm
              title="Xóa hình ảnh sản phẩm"
              description={`Bạn có chắc chắn muốn xóa hình ảnh sản phẩm?`}
              onConfirm={() => handleDelete(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <DeleteButton type="text" danger size="small" loading={deleteItemMutation.isPending}>
                Xóa
              </DeleteButton>
            </Popconfirm>
            {record.isMain === false && (
              <EditButton type="link" size="small" loading={deleteItemMutation.isPending} onClick={() => setIsMainItemMutation.mutate(record.uid)}>
                Đặt làm mặc định
              </EditButton>
            )}
          </Flex>
        ),
      },
    ],
    [deleteItemMutation.isPending]
  );

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProductPhotoResponse> | SorterResult<any>[]
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

  const handleRefresh = () => {
    refetch();
  };

  const handleCreate = (file: File) => {
    createItemMutation.mutate(file);
  };

  const handleDelete = (uid: string) => {
    deleteItemMutation.mutate(uid);
  };

  console.log("product lines: ", data?.content);

  return (
    <>
      <Flex vertical gap={10}>
        <Flex gap={10}>
          <FileButton size="small" type="primary" onSelectFile={handleCreate}>
            Thêm
          </FileButton>
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
    </>
  );
};

export default BodyTemplate;
