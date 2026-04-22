import React from 'react';
import { Card, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import DonHangTable from './components/DonHangTable';
import DonHangForm from './components/DonHangForm';
import DonHangChart from './components/DonHangChart';
import HuyDonModal from './components/HuyDonModal';

const QuanLyDonHang = () => {
  const { setVisibleForm, setIsEdit, setRowCurrent } = useModel('useDonHang' as any);

  const handleAdd = () => {
    setIsEdit(false);
    setRowCurrent(undefined);
    setVisibleForm(true);
  };

  return (
    <Card title="Quản lý Đơn hàng" bordered={false}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <DonHangChart />

        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
            Thêm Đơn hàng
          </Button>
          <DonHangTable />
        </div>
      </Space>

      <DonHangForm />
      <HuyDonModal />
    </Card>
  );
};

export default QuanLyDonHang;
