import React, { useState } from 'react'
import './personalmanagement.css'

function PersonalManagementPage() {
    // State tanımlama
    const [isFlap1Open, setIsFlap1Open] = useState(false); // Flap1 için açılma durumu
    const [isFlap2Open, setIsFlap2Open] = useState(false); // Flap2 için açılma durumu
    const [isFlap3Open, setIsFlap3Open] = useState(false); // Flap3 için açılma durumu
    const [isFlap4Open, setIsFlap4Open] = useState(false); // Flap4 için açılma durumu
    const [isFlap5Open, setIsFlap5Open] = useState(false); // Flap5 için açılma durumu

    const toggleFlap1 = () => {
        setIsFlap1Open(!isFlap1Open);
    };

    const toggleFlap2 = () => {
        setIsFlap2Open(!isFlap2Open);
    };
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row dashboard-cards">
                            {/* Personel Yönetimi Kartı */}
                            <div className="card col-md-4">
                                <div className="card-title">
                                    <h2>Personel Yönetimi</h2>
                                    <small>Şirket çalışanlarını yönetin</small>
                                </div>
                                <div className="task-count">
                                    40  {/* Personel sayısı burada dinamik olarak gösterilebilir */}
                                </div>
                                <div className={`card-flap flap1 ${isFlap1Open ? 'open' : ''}`}>
                                    <div className="card-description">
                                        <ul className="task-list">
                                            <li>Çalışan Ekle / Güncelle <span>10</span></li>
                                            <li>Çalışanı Aktifleştir / Pasifleştir <span>5</span></li>
                                            <li>Özlük Belgeleri Ekle / Güncelle <span>8</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-flap flap2">
                                    <div className="card-actions">
                                        <button onClick={toggleFlap1} className="btn">
                                            {isFlap1Open ? 'Kapat' : 'Aç'} {/* Duruma göre buton metni değişir */}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* İzin Yönetimi Kartı */}
                            <div className="card col-md-4">
                                <div className="card-title">
                                    <h2>İzin Yönetimi</h2>
                                    <small>Çalışan izinlerini yönetin</small>
                                </div>
                                <div className="task-count">
                                    12  {/* İzin talebi sayısı */}
                                </div>
                                <div className="card-flap flap1">
                                    
                                    <div className="card-description">
                                        <ul className="task-list">
                                            <li>İzin Talepleri Görüntüle <span>8</span></li>
                                            <li>İzin Onayla / Reddet <span>4</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-flap flap2">
                                    <div className="card-actions">
                                        <a href="#" className="btn">Yönet</a>
                                    </div>
                                </div>
                            </div>

                            {/* Vardiya Yönetimi Kartı */}
                            <div className="card col-md-4">
                                <div className="card-title">
                                    <h2>Vardiya Yönetimi</h2>
                                    <small>Çalışanların vardiyalarını yönetin</small>
                                </div>
                                <div className="task-count">
                                    7  {/* Vardiya düzenlemeleri sayısı */}
                                </div>
                                <div className="card-flap flap1">
                                    <div className="card-description">
                                        <ul className="task-list">
                                            <li>Vardiya Oluştur <span>3</span></li>
                                            <li>Çalışanlara Vardiya Ata <span>4</span></li>
                                            <li>Mola Saatleri Ata <span>3</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-flap flap2">
                                    <div className="card-actions">
                                        <a href="#" className="btn">Yönet</a>
                                    </div>
                                </div>
                            </div>

                            {/* Harcama Yönetimi Kartı */}
                            <div className="card col-md-4">
                                <div className="card-title">
                                    <h2>Harcama Yönetimi</h2>
                                    <small>Çalışanların harcamalarını yönetin</small>
                                </div>
                                <div className="task-count">
                                    5  {/* Onay bekleyen harcama sayısı */}
                                </div>
                                <div className="card-flap flap1">
                                    <div className="card-description">
                                        <ul className="task-list">
                                            <li>Harcama Talepleri Görüntüle <span>5</span></li>
                                            <li>Harcama Onayla / Reddet <span>3</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-flap flap2">
                                    <div className="card-actions">
                                        <a href="#" className="btn">Yönet</a>
                                    </div>
                                </div>
                            </div>

                            {/* Zimmet Yönetimi Kartı */}
                            <div className="card col-md-4">
                                <div className="card-title">
                                    <h2>Zimmet Yönetimi</h2>
                                    <small>Çalışanların zimmetlerini yönetin</small>
                                </div>
                                <div className="task-count">
                                    3  {/* Zimmet düzenlemeleri sayısı */}
                                </div>
                                <div className="card-flap flap1">
                                    <div className="card-description">
                                        <ul className="task-list">
                                            <li>Zimmet Atama / Güncelleme <span>3</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-flap flap2">
                                    <div className="card-actions">
                                        <a href="#" className="btn">Yönet</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PersonalManagementPage
