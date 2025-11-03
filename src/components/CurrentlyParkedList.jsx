// src/components/CurrentlyParkedList.js (AntD Refactor)

import React from 'react';
// YENİ: AntD'nin <Table> ve <Tag> bileşenleri
import { Table, Tag, Typography } from 'antd';

// 'vehicles' verisini (GET /current'dan gelen) prop olarak alır
function CurrentlyParkedList({ vehicles }) {

  // AntD <Table> bileşeni için "sütun" tanımlaması
  const columns = [
    {
      title: 'Plaka', // Başlık
      dataIndex: 'licensePlate', // 'vehicles' içindeki veri anahtarı
      key: 'licensePlate',
    },
    {
      title: 'Giriş Saati',
      dataIndex: 'entryTime',
      key: 'entryTime',
      // 'render' fonksiyonu ile veriyi formatlıyoruz
      render: (text) => new Date(text).toLocaleString('tr-TR'),
    },
    {
      title: 'Park Yeri',
      dataIndex: 'spotLabel',
      key: 'spotLabel',
      render: (text) => <Tag color="blue">{text}</Tag>, // Etiket içinde göster
    },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      {/* title prop'u tabloya güzel bir başlık ekler */}
      <Typography.Title level={4}>Anlık Park Eden Araçlar</Typography.Title>
      <Table
        columns={columns} // Sütun yapısı
        dataSource={vehicles} // Verinin kendisi (dizi)
        rowKey="transactionId" // Her satır için benzersiz 'key'
        pagination={false} // Şimdilik sayfalama olmasın
        loading={!vehicles} // 'vehicles' 'null' ise 'loading' göster
      />
    </div>
  );
}

export default CurrentlyParkedList;