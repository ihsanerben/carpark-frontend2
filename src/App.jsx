// src/App.js (Final - AntD Refactor)

import { useState, useEffect } from 'react';
import { parkingApiService } from './services/parkingApiService';
import { Row, Col, Spin, Alert } from 'antd';

// Yeni/Güncel AntD bileşenlerimizi import ediyoruz
import CheckInForm from './components/CheckInForm';
import CheckOutForm from './components/CheckOutForm';
import CurrentlyParkedList from './components/CurrentlyParkedList';
import Dashboard from './components/Dashboard';

import './App.css'; // Sadece 'body', 'container', 'header' stillerini içerir

function App() {
  
  const [stats, setStats] = useState(null); 
  const [vehicles, setVehicles] = useState(null); // Başlangıçta 'null' yapalım
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = () => {
    setLoading(true); 
    setError(null);

    Promise.all([
      parkingApiService.getDashboardStats(),
      parkingApiService.getCurrentlyParked()
    ])
    .then(([statsResponse, vehiclesResponse]) => {
      setStats(statsResponse.data);
      setVehicles(vehiclesResponse.data);
      setLoading(false);
    })
    .catch(apiError => {
      console.error('API Hatası:', apiError);
      setError('Veri yüklenirken bir hata oluştu.');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []); 

  

  const renderContent = () => {
    if (loading && !stats) { // Sadece İLK yükleme anı
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Otopark verisi yükleniyor..." />
        </div>
      );
    }

    if (error) {
      return <Alert message="Hata" description={error} type="error" showIcon />;
    }

    // Yükleme bitti ve hata yoksa, ana layout'u göster
    return (
      // gutter={24} -> Sütunlar (Col) arasına 24px boşluk bırak
      <Row gutter={24}>
        
        {/* Sol Panel: span={8} -> 24'ün 8 birimini (1/3) kapla */}
        <Col xs={24} md={8}>
          <CheckInForm onCheckInSuccess={fetchAllData} />
          <CheckOutForm onCheckOutSuccess={fetchAllData} />
        </Col>
        
        {/* Sağ Panel: span={16} -> 24'ün 16 birimini (2/3) kapla */}
        <Col xs={24} md={16}>
          <Dashboard stats={stats} />
          {/* Araç listesini 'loading' olmadan, kendi 'loading'i ile göster */}
          <CurrentlyParkedList vehicles={vehicles} />
        </Col>

      </Row>
    );
  };

  return (
    // 'container' sınıfı App.css'ten geliyor (beyaz kutu)
    <div className="container">
      <header>
        <h1>Otopark Yönetim Paneli</h1>
      </header>
      
      {/* .main-content yerine 'renderContent' fonksiyonunun sonucunu koyduk */}
      {renderContent()}
      
    </div>
  );
}

export default App;