import { useState, useEffect } from 'react';
import { message } from 'antd';

export type TrangThaiDonHang = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

export interface KhachHang {
  id: string;
  name: string;
}

export interface SanPham {
  id: string;
  name: string;
  price: number;
}

export interface DonHangRecord {
  id: string; // Mã đơn hàng
  customerId: string; // ID Khách hàng
  orderDate: string; // Ngày đặt hàng
  totalAmount: number; // Tổng tiền
  status: TrangThaiDonHang; // Trạng thái
  products: { productId: string; quantity: number }[];
  note?: string; // Ghi chú đơn hàng
}

// Dữ liệu mô phỏng
const MOCK_KHACH_HANG: KhachHang[] = [
  { id: 'KH01', name: 'Nguyễn Văn A' },
  { id: 'KH02', name: 'Trần Thị B' },
  { id: 'KH03', name: 'Lê Văn C' },
];

const MOCK_SAN_PHAM: SanPham[] = [
  { id: 'SP01', name: 'Laptop Dell XPS 15', price: 35000000 },
  { id: 'SP02', name: 'Chuột Logitech G102', price: 450000 },
  { id: 'SP03', name: 'Bàn phím cơ Akko', price: 1500000 },
  { id: 'SP04', name: 'Màn hình LG 27 inch', price: 5000000 },
];

export default () => {
  const [data, setData] = useState<DonHangRecord[]>([]);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [rowCurent, setRowCurrent] = useState<DonHangRecord>();
  const [visibleCancelModal, setVisibleCancelModal] = useState<boolean>(false);

  const getDanhSachDonHang = () => {
    try {
      const dataLocal = JSON.parse(localStorage.getItem('donHangData') || '[]');
      setData(dataLocal);
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  useEffect(() => {
    getDanhSachDonHang();
  }, []);

  const saveDonHang = (newData: DonHangRecord[]) => {
    localStorage.setItem('donHangData', JSON.stringify(newData));
    setData(newData);
  };

  const addDonHang = (record: DonHangRecord) => {
    if (data.some(d => d.id === record.id)) {
      message.error('Mã đơn hàng đã tồn tại!');
      return false;
    }
    const newData = [record, ...data];
    saveDonHang(newData);
    message.success('Thêm mới đơn hàng thành công');
    return true;
  };

  const updateDonHang = (record: DonHangRecord) => {
    const originRecord = data.find(item => item.id === record.id);
    // Nếu huỷ đơn hàng từ trạng thái Chờ xác nhận, chỉ đổi state status nếu đúng.
    if (record.status === 'Hủy' && originRecord && originRecord.status !== 'Chờ xác nhận') {
      message.error('Chỉ được hủy đơn hàng ở trạng thái Chờ xác nhận');
      return false;
    }
    const newData = data.map(d => (d.id === record.id ? record : d));
    saveDonHang(newData);
    message.success('Cập nhật đơn hàng thành công');
    return true;
  };

  const deleteDonHang = (id: string) => {
    const newData = data.filter(d => d.id !== id);
    saveDonHang(newData);
    message.success('Xóa đơn hàng thành công');
  };

  return {
    data,
    khachHangList: MOCK_KHACH_HANG,
    sanPhamList: MOCK_SAN_PHAM,
    visibleForm,
    setVisibleForm,
    isEdit,
    setIsEdit,
    rowCurent,
    setRowCurrent,
    visibleCancelModal,
    setVisibleCancelModal,
    addDonHang,
    updateDonHang,
    deleteDonHang,
    getDanhSachDonHang,
  };
};
