// src/components/CheckInForm.js (AntD Refactor)

import { useState } from 'react';
import { parkingApiService } from '../services/parkingApiService';
// Ant Design bileşenlerini import et
import { Form, Input, Button, Alert, Spin, Card } from 'antd'; 

function CheckInForm({ onCheckInSuccess }) {
  
  const [form] = Form.useForm(); // Formu programatik yönetmek için
  const [loading, setLoading] = useState(false);
  // { type: 'success' | 'error', text: '...' }
  const [message, setMessage] = useState(null); 

  const onFinish = (values) => {
    setLoading(true);
    setMessage(null);

    parkingApiService.checkIn(values.plate)
      .then(response => {
        setLoading(false);
        setMessage({
          type: 'success',
          text: `Araç (${response.data.licensePlate}) ${response.data.spotLabel} nolu yere park etti.`
        });
        form.resetFields(); // Formu temizle
        onCheckInSuccess(); 
      })
      .catch(apiError => {
        setLoading(false);
        const errorMessage = apiError.response?.data || 'Giriş başarısız.';
        setMessage({ type: 'error', text: errorMessage });
      });
  };

  return (
    // <Card> bileşeni bize güzel bir kutu, başlık ve gölge verir
    <Card title="Araç Girişi (Check-in)">
      {/* <Spin> bileşeni, 'loading' true ise tüm formu kaplar */}
      <Spin spinning={loading} tip="Giriş Yapılıyor...">
        <Form
          form={form}
          name="checkin"
          onFinish={onFinish}
          layout="vertical" // Label'lar üstte
        >
          {/* Mesaj alanı */}
          {message && (
            <Alert 
              message={message.text} 
              type={message.type} 
              showIcon 
              closable
              onClose={() => setMessage(null)}
              style={{ marginBottom: 16 }} // Üstten boşluk
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
                // Regex Kuralı: En az 2 rakam, harf, ve rakam kombinasyonu zorunlu.
                // Basitleştirilmiş kural: [NN L [L...] N [N...]]
                // NOT: Boşlukları (espace) zorunlu tutmak kullanıcı deneyimini bozabilir,
                // Bu kural sadece karakter tiplerini zorunlu tutar: Rakamlar, Harfler, Boşluk, Tire
                pattern: /^\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/, 
                message: 'Geçersiz plaka formatı! Örn: 34 ABC 123 veya 06 TR 4567. Sadece Rakam ve Harf kullanın.' 
              }
            ]}
          >
            <Input placeholder="34 ABC 123" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default CheckInForm;