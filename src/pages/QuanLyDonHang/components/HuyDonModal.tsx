import React from 'react';
import { Modal, Descriptions, Alert, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const HuyDonModal = () => {
  const {
    visibleCancelModal,
    setVisibleCancelModal,
    rowCurent,
    khachHangList,
    updateDonHang,
  } = useModel('useDonHang' as any);

  if (!rowCurent) return null;

  const handleOk = () => {
    updateDonHang({ ...rowCurent, status: 'Hủy' });
    setVisibleCancelModal(false);
  };

  const handleCancel = () => {
    setVisibleCancelModal(false);
  };

  const khachHangName = khachHangList.find((kh: any) => kh.id === rowCurent.customerId)?.name || rowCurent.customerId;

  return (
    <Modal
      title="Xác nhận hủy đơn hàng"
      visible={visibleCancelModal}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xác nhận Hủy"
      cancelText="Đóng"
      okButtonProps={{ danger: true }}
    >
      <Alert
        message="Cảnh báo"
        description="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Descriptions title="Thông tin đơn hàng chi tiết" bordered column={1} size="small">
        <Descriptions.Item label="Mã đơn hàng"><Text strong>{rowCurent.id}</Text></Descriptions.Item>
        <Descriptions.Item label="Khách hàng">{khachHangName}</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">{new Date(rowCurent.orderDate).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{rowCurent.totalAmount.toLocaleString()} VNĐ</Descriptions.Item>
        <Descriptions.Item label="Trạng thái hiện tại">{rowCurent.status}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default HuyDonModal;
