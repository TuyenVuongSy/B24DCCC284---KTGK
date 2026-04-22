import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import type { DonHangRecord } from '@/models/useDonHang';

const { Option } = Select;

const DonHangForm = () => {
  const {
    visibleForm,
    setVisibleForm,
    isEdit,
    rowCurent,
    khachHangList,
    sanPhamList,
    addDonHang,
    updateDonHang,
  } = useModel('useDonHang' as any);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visibleForm) {
      if (isEdit && rowCurent) {
        form.setFieldsValue({
          ...rowCurent,
          productIds: rowCurent.products?.map?.((p: any) => p.productId) || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'Chờ xác nhận' });
      }
    }
  }, [visibleForm, isEdit, rowCurent, form]);

  const onCalculateTotal = () => {
    const productIds: string[] = form.getFieldValue('productIds') || [];
    const total = productIds.reduce((sum: number, id: string) => {
      const sp = sanPhamList.find((p: any) => p.id === id);
      return sum + (sp?.price || 0);
    }, 0);
    form.setFieldsValue({ totalAmount: total });
  };

  const handleCancel = () => {
    setVisibleForm(false);
  };

  const handleFinish = (values: any) => {
    const products = (values.productIds || []).map((id: string) => ({
      productId: id,
      quantity: 1,
    }));

    const record: DonHangRecord = {
      ...values,
      products,
    };

    let success = false;
    if (isEdit) {
      success = updateDonHang(record);
    } else {
      success = addDonHang(record);
    }

    if (success) {
      setVisibleForm(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa đơn hàng' : 'Thêm mới đơn hàng'}
      visible={visibleForm}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={(changedValues) => {
          if ('productIds' in changedValues) {
            onCalculateTotal();
          }
        }}
      >
        <Form.Item
          name="id"
          label="Mã đơn hàng"
          rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng' }]}
        >
          <Input disabled={isEdit} placeholder="Ví dụ: DH001" />
        </Form.Item>

        <Form.Item
          name="customerId"
          label="Khách hàng"
          rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
        >
          <Select placeholder="Chọn khách hàng" showSearch optionFilterProp="children">
            {khachHangList.map((kh: any) => (
              <Option key={kh.id} value={kh.id}>
                {kh.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="orderDate"
          label="Ngày đặt hàng"
          rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
        >
          <MyDatePicker allowClear placeholder="Chọn ngày đặt hàng" format="DD/MM/YYYY" saveFormat="YYYY-MM-DDTHH:mm:ss.SSSZ" />
        </Form.Item>

        <Form.Item
          name="productIds"
          label="Sản phẩm trong đơn"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 sản phẩm' }]}
        >
          <Select mode="multiple" placeholder="Chọn sản phẩm" optionFilterProp="children">
            {sanPhamList.map((sp: any) => (
              <Option key={sp.id} value={sp.id}>
                {sp.name} - {sp.price.toLocaleString()} VNĐ
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Tổng tiền"
        >
          <Input disabled addonAfter="VNĐ" style={{ color: 'black' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
            <Option value="Đang giao">Đang giao</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Hủy">Hủy</Option>
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú đơn hàng">
          <TinyEditor height={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DonHangForm;
