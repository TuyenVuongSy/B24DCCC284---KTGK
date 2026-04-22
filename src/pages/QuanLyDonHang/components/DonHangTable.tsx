import React, { useState } from 'react';
import { Table, Space, Button, Input, Select, Tag } from 'antd';
import { EditOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DonHangRecord } from '@/models/useDonHang';

const { Option } = Select;
const { Search } = Input;

const TRANG_THAI_COLORS = {
  'Chờ xác nhận': 'orange',
  'Đang giao': 'blue',
  'Hoàn thành': 'green',
  'Hủy': 'red',
};

const DonHangTable = () => {
  const { data, khachHangList, setVisibleForm, setIsEdit, setRowCurrent, setVisibleCancelModal, deleteDonHang } = useModel('useDonHang' as any);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sortValue, setSortValue] = useState<string | undefined>(undefined);

  const handleEdit = (record: DonHangRecord) => {
    setRowCurrent(record);
    setIsEdit(true);
    setVisibleForm(true);
  };

  const handleCancel = (record: DonHangRecord) => {
    setRowCurrent(record);
    setVisibleCancelModal(true);
  };

  // Enhance data with cutomer name for easier searching
  const dataSource = data.map((item: any) => ({
    ...item,
    khachHangName: khachHangList.find((kh: any) => kh.id === item.customerId)?.name || item.customerId,
  }));

  const filteredData = dataSource.filter((item: any) => {
    const matchSearch =
      item.id?.toLowerCase().includes(searchText?.toLowerCase()) ||
      item.khachHangName?.toLowerCase().includes(searchText?.toLowerCase());
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  let finalData = [...filteredData];
  if (sortValue === 'date_asc') {
    finalData.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
  } else if (sortValue === 'date_desc') {
    finalData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  } else if (sortValue === 'total_asc') {
    finalData.sort((a, b) => a.totalAmount - b.totalAmount);
  } else if (sortValue === 'total_desc') {
    finalData.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHangName',
      key: 'khachHangName',
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: any, b: any) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => `${val.toLocaleString()} VNĐ`,
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof TRANG_THAI_COLORS) => (
        <Tag color={TRANG_THAI_COLORS[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DonHangRecord) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          {record.status === 'Chờ xác nhận' && (
            <Button
              type="link"
              danger
              icon={<StopOutlined />}
              onClick={() => handleCancel(record)}
            >
              Hủy
            </Button>
          )}
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => deleteDonHang(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm theo mã đơn hoặc khách hàng"
          allowClear
          onSearch={setSearchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          onChange={setStatusFilter}
        >
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
        <Select
          allowClear
          placeholder="Sắp xếp theo ..."
          style={{ width: 220 }}
          onChange={setSortValue}
        >
          <Option value="date_desc">Ngày đặt (Mới nhất)</Option>
          <Option value="date_asc">Ngày đặt (Cũ nhất)</Option>
          <Option value="total_asc">Tổng tiền (Tăng dần)</Option>
          <Option value="total_desc">Tổng tiền (Giảm dần)</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={finalData}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default DonHangTable;
