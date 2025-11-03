// src/components/CheckOutForm.js (AntD Refactor)

import { useState } from 'react';
import { parkingApiService } from '../services/parkingApiService';
import { Form, Input, Button, Alert, Spin, Card } from 'antd'; 

function CheckOutForm({ onCheckOutSuccess }) {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  const onFinish = (values) => {
    setLoading(true);
    setMessage(null);

    parkingApiService.checkOut(values.plate)
      .then(response => {
        setLoading(false);
        setMessage({
          type: 'success',
          text: `Araç (${response.data.licensePlate}) çıkış yaptı. Ücret: ${response.data.fee}`
        });
        form.resetFields();
        onCheckOutSuccess(); 
      })
      .catch(apiError => {
        setLoading(false);
        const errorMessage = apiError.response?.data || 'Çıkış başarısız.';
        setMessage({ type: 'error', text: errorMessage });
      });
  };

  return (
    <Card title="Araç Çıkışı (Check-out)" style={{ marginTop: 20 }}>
      <Spin spinning={loading} tip="Çıkış Yapılıyor...">
        <Form
          form={form}
          name="checkout"
          onFinish={onFinish}
          layout="vertical"
        >
          {message && (
            <Alert 
              message={message.text} 
              type={message.type} 
              showIcon 
              closable
              onClose={() => setMessage(null)}
              style={{ marginBottom: 16 }}
            />
          )}
          
         <Form.Item
            label="Araç Plakası"
            name="plate"
            normalize={(value) => (value || '').toUpperCase()}

            // YENİ VE DAHA KATMANLI KURALLAR:
            rules={[
              { required: true, message: 'Plaka girmek zorunludur!' },
              { min: 6, message: 'Plaka çok kısa. Örn: 34 A 123' },
              { max: 12, message: 'Plaka çok uzun.' },
              { 
                pattern: /^\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/, 
                message: 'Geçersiz plaka formatı! Örn: 34 ABC 123 veya 06 TR 4567. Sadece Rakam ve Harf kullanın.' 
              }
            ]}
          >
            <Input placeholder="34 ABC 123" />
          </Form.Item>

          <Form.Item>
            {/* type="primary" butonu mavi yapar. 'danger' kırmızı yapar. */}
            <Button type="primary" danger htmlType="submit" style={{ width: '100%' }}>
              Çıkış Yap
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default CheckOutForm;