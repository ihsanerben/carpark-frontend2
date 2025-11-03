// src/components/Dashboard.js (AntD Refactor)

import React from 'react';
// YENİ: AntD bileşenlerini import ediyoruz
import { Card, Col, Row, Statistic, Tag, Typography, Divider } from 'antd';

// 'stats' verisini (GET /dashboard'dan gelen) prop olarak alır
function Dashboard({ stats }) {
  
  // stats 'null' ise (henüz yüklenmediyse)
  if (!stats) {
    // App.js'te ana <Spin> olduğu için burada bir şey göstermeye gerek yok
    return null; 
  }

  return (
    <>
      {/* 1. Kısım: İstatistikler */}
      <Card title="Anlık Durum">
        {/* gutter={[16, 16]} -> hem yatay hem dikey 16px boşluk */}
        <Row gutter={[16, 16]}>
          <Col span={8}>
            {/* <Statistic> bileşeni sayıları güzel formatlar */}
            <Statistic title="Toplam Park Yeri" value={stats.totalSpots} />
          </Col>
          <Col span={8}>
            <Statistic title="Dolu Park Yeri" value={stats.occupiedSpots} />
          </Col>
          <Col span={8}>
            <Statistic title="Boş Park Yeri" value={stats.availableSpots} />
          </Col>
        </Row>
      </Card>

      {/* 2. Kısım: Park Yeri Haritası */}
      <Card title="Park Yeri Haritası" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {/* Eski .spot div'leri yerine <Tag> kullanıyoruz */}
          {stats.spots.map(spot => (
            <Tag
              key={spot.id}
              // <Tag> bileşeninin 'color' prop'u 'red' ve 'green'i anlar
              color={spot.status === 'OCCUPIED' ? 'red' : 'green'}
              style={{ fontSize: '14px', padding: '8px 12px', minWidth: '60px', textAlign: 'center' }}
            >
              {spot.spotLabel}
            </Tag>
          ))}
        </div>
      </Card>
    </>
  );
}

export default Dashboard;