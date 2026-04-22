import React from 'react';
import { useModel } from 'umi';
import DonutChart from '@/components/Chart/DonutChart';

const DonHangChart = () => {
  const { data } = useModel('useDonHang' as any);

  // Tính số lượng đơn hàng theo từng trạng thái
  const statuses = ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Hủy'];
  const dataCount = statuses.map(status => {
    return data.filter((d: any) => d.status === status).length;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
      <h3>Thống kê đơn hàng theo trạng thái</h3>
      <DonutChart
        xAxis={statuses}
        yAxis={[dataCount]}
        yLabel={['Số lượng']}
        colors={['#faad14', '#1890ff', '#52c41a', '#f5222d']}
        showTotal={true}
        formatY={(val) => `${val} đơn`}
        height={300}
      />
    </div>
  );
};

export default DonHangChart;
