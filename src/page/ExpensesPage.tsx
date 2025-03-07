import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import ExpensesSideBar from '../components/organisms/ExpensesSideBar';
import { Spinner, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IExpenses, IApiResponse } from '../model/ExpenseModels';
import './ExpensesPage.css';

const API_BASE_URL = 'http://localhost:9090/v1/dev/employee/expenses';

const ExpensesPage = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState<IExpenses[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newExpense, setNewExpense] = useState({
        expenseType: '',
        amount: '',
        currency: 'TRY',
        description: '',
        receipt: '',
        status: 'DRAFT'
    });
    const [selectedExpense, setSelectedExpense] = useState<IExpenses | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        amount: '',
        currency: 'TRY',
        description: '',
        status: '',
        receipt: ''
    });
    
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        console.log("Gönderilen Token:", `Bearer ${token}`);
        
        fetch("http://localhost:9090/v1/dev/user/get-profile-by-token", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                fetchExpenses(token);
            } else {
                console.error("Kullanıcı profili alınamadı");
            }
        })
        .catch(err => console.error("Profil yüklenirken hata oluştu:", err));
    }, [navigate]);

    const fetchExpenses = async (token: string) => {
        try {
            setLoading(true);
            const response = await axios.get<IApiResponse>(`${API_BASE_URL}/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("API Yanıtı:", response.data);
            setExpenses(response.data.data || []);
        } catch (error: any) {
            console.error("Hata Detayı:", error.response);
            if (error.response?.status === 403) {
                setError("Yetkilendirme hatası: Erişim reddedildi.");
            } else {
                setError("Harcamalar yüklenirken hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewExpense({
                ...newExpense,
                receipt: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleAddExpense = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            const expenseData = {
                amount: parseFloat(newExpense.amount),
                description: newExpense.description,
                receipt: newExpense.receipt,
                status: newExpense.status,
                expenseType: newExpense.expenseType,
                currency: newExpense.currency
            };
            
            setLoading(true);
            const response = await axios.post<IApiResponse>(`${API_BASE_URL}/save`, expenseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.code === 200) {
                fetchExpenses(token);
                setShowModal(false);
                setNewExpense({
                    expenseType: '',
                    amount: '',
                    currency: 'TRY',
                    description: '',
                    receipt: '',
                    status: 'DRAFT'
                });
            } else {
                setError("Harcama eklenirken bir hata oluştu.");
            }
        } catch (error: any) {
            console.error("Hata Detayı:", error.response);
            setError("Harcama eklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewExpense({
            ...newExpense,
            [name]: value
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement | any>) => {
        const { name, value } = e.target;
        setNewExpense({
            ...newExpense,
            [name]: value
        });
    };

    const handleFormSelectChange = (e: any) => {
        const { name, value } = e.target;
        setNewExpense({
            ...newExpense,
            [name]: value
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'status-approved';
            case 'REJECTED':
                return 'status-rejected';
            case 'PENDING_APPROVAL':
                return 'status-pending';
            default:
                return 'status-draft';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'Onaylandı';
            case 'REJECTED':
                return 'Reddedildi';
            case 'PENDING_APPROVAL':
                return 'Onay Bekliyor';
            default:
                return 'Taslak';
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const typeMatch = exp.expenseType?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const descMatch = exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return typeMatch || descMatch;
    });

    const handleEditClick = (expense: IExpenses) => {
        console.log("Düzenlenecek harcama:", expense);
        setSelectedExpense(expense);
        
        setEditFormData({
            amount: expense.amount.toString(),
            currency: expense.currency || 'TRY',
            description: expense.description || '',
            status: expense.status || 'DRAFT',
            receipt: (expense as any)?.receipt || ''
        });
        
        setShowEditModal(true);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateExpense = async () => {
        if (!selectedExpense) {
            console.error("Seçili harcama bulunamadı");
            return;
        }
        
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            console.log("Güncelleme başlıyor...");
            console.log("Harcama ID:", selectedExpense.id);
            console.log("Gönderilecek veriler:", editFormData);
            
            const updateData = {
                amount: parseFloat(editFormData.amount),
                currency: editFormData.currency,
                description: editFormData.description,
                status: editFormData.status,
                receipt: editFormData.receipt
            };
            
            setLoading(true);
            
            const response = await axios.put<IApiResponse>(
                `${API_BASE_URL}/update/${selectedExpense.id}`, 
                updateData, 
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log("API Yanıtı:", response.data);
            
            if (response.data.code === 200) {
                alert("Harcama başarıyla güncellendi");
                setShowEditModal(false);
                setSelectedExpense(null);
                fetchExpenses(token);
            } else {
                setError(`Güncelleme hatası: ${response.data.message || 'Bilinmeyen hata'}`);
            }
        } catch (error: any) {
            console.error("Güncelleme hatası:", error);
            console.error("Hata detayları:", error.response?.data);
            setError(`Güncelleme sırasında bir hata oluştu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveExpense = async () => {
        if (selectedExpense) {
            await handleUpdateExpense();
        } else {
            await handleAddExpense();
        }
    };

    const handleViewExpense = (expense: IExpenses) => {
        setSelectedExpense(expense);
        setShowViewModal(true);
    };

    return (
        <div className="personal-management-container">
            <ExpensesSideBar 
                collapsed={sidebarCollapsed} 
                onToggle={handleToggleSidebar} 
            />
            <main className={`main-content ${sidebarCollapsed ? 'content-expanded' : 'content-normal'}`}>
                {/* Header Bölümü */}
                <div className="expenses-header">
                    <div className="header-left">
                    <h1>Harcama Yönetimi</h1>
                        <p className="header-subtitle">Tüm harcamalarınızı yönetin, filtreleyin ve takip edin</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary-modern" onClick={() => setShowModal(true)}>
                            <i>+</i> Harcama Ekle
                        </button>
                    </div>
                </div>

                {/* Dashboard Özet Kartları */}
                <div className="dashboard-cards">
                    <div className="stat-card">
                        <div className="stat-title">Toplam Harcama</div>
                        <div className="stat-value">
                            {expenses.reduce((total, exp) => total + Number(exp.amount), 0).toFixed(2)} TRY
                        </div>
                        <div className="stat-change positive">
                            <i>↑</i> Son 30 günde
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Onaylanan Harcamalar</div>
                        <div className="stat-value">
                            {expenses.filter(exp => exp.status === 'APPROVED').length}
                        </div>
                        <div className="stat-change">
                            Toplam {expenses.length} harcama
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Bekleyen Harcamalar</div>
                        <div className="stat-value">
                            {expenses.filter(exp => exp.status === 'PENDING_APPROVAL').length}
                        </div>
                        <div className="stat-change">
                            Toplam {expenses.length} harcama
                        </div>
                    </div>
                </div>

                {/* Arama ve Filtre Bölümü */}
                <div className="controls-container">
                    <div className="controls-header">
                        <h3 className="controls-title">Harcamalarım</h3>
                        <div className="controls-tools">
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Harcama ara..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="search-icon">🔍</span>
                            </div>
                        </div>
                    </div>

                {error && (
                        <div className="alert-message">{error}</div>
                    )}
                </div>

                {/* Harcama Listesi */}
                <div className="expenses-container">
                    <div className="expenses-table-header">
                        <div className="header-cell">ID</div>
                        <div className="header-cell">Açıklama</div>
                        <div className="header-cell">Tutar</div>
                        <div className="header-cell">Durum</div>
                        <div className="header-cell">İşlemler</div>
                    </div>
                    
                    {loading ? (
                        <div className="empty-state">
                            <Spinner animation="border" variant="primary" />
                            <div className="empty-title">Harcamalar yükleniyor...</div>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <div className="empty-title">Harcama bulunamadı</div>
                            <div className="empty-description">
                                {searchTerm ? 
                                    `"${searchTerm}" aramasına uygun harcama kaydı bulunamadı.` : 
                                    "Henüz hiç harcama kaydı oluşturmadınız. Yeni bir harcama ekleyebilirsiniz."}
                            </div>
                            <button className="btn-primary-modern" onClick={() => setShowModal(true)}>
                                <i>+</i> Harcama Ekle
                            </button>
                        </div>
                    ) : (
                        <>
                            {filteredExpenses.map(exp => (
                                <div key={exp.id} className="expense-row">
                                    <div className="expense-id-cell">
                                        #{exp.id}
                                    </div>
                                    <div className="expense-description-cell">
                                        {exp.description ? (
                                            <div className="expense-description-text">
                                                {exp.description.length > 50 
                                                    ? `${exp.description.substring(0, 50)}...` 
                                                    : exp.description
                                                }
                                            </div>
                                        ) : (
                                            <span className="no-description">Açıklama yok</span>
                                        )}
                                    </div>
                                    <div className="expense-amount">
                                        {exp.amount} {exp.currency}
                                    </div>
                                    <div className={`expense-status ${getStatusClass(exp.status)}`}>
                                        {getStatusText(exp.status)}
                                    </div>
                                    <div className="expense-actions">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="Görüntüle"
                                            onClick={() => handleViewExpense(exp)}
                                        >
                                            <span className="visually-hidden">Görüntüle</span>
                                        </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Düzenle"
                                            onClick={() => handleEditClick(exp)}
                                        >
                                            <span className="visually-hidden">Düzenle</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {filteredExpenses.length > 0 && (
                    <div className="pagination">
                        <button className="page-btn disabled">«</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn disabled">»</button>
                    </div>
                )}

                {/* Harcama Ekleme Modal */}
                <Modal show={showModal} onHide={() => {
                    setShowModal(false);
                    setSelectedExpense(null);
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedExpense ? 'Harcama Düzenle' : 'Yeni Harcama Ekle'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tutar</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={newExpense.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Para Birimi</Form.Label>
                                <Form.Select
                                    name="currency"
                                    value={newExpense.currency}
                                    onChange={handleFormSelectChange}
                                >
                                    <option value="TRY">TRY</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Açıklama</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={newExpense.description}
                                    onChange={handleInputChange}
                                    placeholder="Harcama ile ilgili detaylar..."
                                    rows={3}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Makbuz/Fatura</Form.Label>
                                <div className="file-input-container">
                                    <div className="file-input-button">
                                        <span>📂</span> Dosya Seç
                                    </div>
                                    <input
                                        type="file"
                                        className="file-input"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                {newExpense.receipt && (
                                    <div className="file-preview">
                                        Yüklenen dosya: {newExpense.receipt}
                                    </div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Durum</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={newExpense.status}
                                    onChange={handleFormSelectChange}
                                >
                                    <option value="DRAFT">Taslak</option>
                                    <option value="PENDING_APPROVAL">Onay Bekliyor</option>
                                    <option value="APPROVED">Onaylandı</option>
                                    <option value="REJECTED">Reddedildi</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowModal(false);
                            setSelectedExpense(null);
                        }}>
                            İptal
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSaveExpense} 
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                selectedExpense ? 'Güncelle' : 'Kaydet'
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Detay Görüntüleme Modal */}
                <Modal 
                    show={showViewModal} 
                    onHide={() => setShowViewModal(false)}
                    className="expense-detail-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Harcama Detayı</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedExpense && (
                            <div className="expense-detail-container">
                                <div className="detail-header">
                                    <div className="detail-id">
                                        <strong>Harcama ID:</strong> #{selectedExpense.id}
                                    </div>
                                    <div className={`detail-status ${getStatusClass(selectedExpense.status)}`}>
                                        {getStatusText(selectedExpense.status)}
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h5 className="detail-section-title">Tutar Bilgileri</h5>
                                    <div className="detail-amount">
                                        <strong>{selectedExpense.amount}</strong> {selectedExpense.currency}
                                    </div>
                                </div>
                                
                                {selectedExpense.description && (
                                    <div className="detail-section">
                                        <h5 className="detail-section-title">Açıklama</h5>
                                        <div className="detail-description">
                                            {selectedExpense.description}
                                        </div>
                                    </div>
                                )}
                                
                                {(selectedExpense as any)?.receipt && (
                                    <div className="detail-section">
                                        <h5 className="detail-section-title">Makbuz/Fatura</h5>
                                        <div className="detail-receipt">
                                            <a href={(selectedExpense as any).receipt} target="_blank" rel="noopener noreferrer" className="receipt-link">
                                                <i className="receipt-icon"></i> Makbuzu Görüntüle
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                            Kapat
                        </Button>
                        {selectedExpense && (
                            <Button 
                                variant="primary" 
                                onClick={() => {
                                    setShowViewModal(false);
                                    handleEditClick(selectedExpense);
                                }}
                            >
                                Düzenle
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Ayrı bir Düzenleme Modalı */}
                <Modal 
                    show={showEditModal} 
                    onHide={() => setShowEditModal(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Harcama Düzenle (ID: {selectedExpense?.id})</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedExpense ? (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tutar</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditInputChange}
                                        placeholder="0.00"
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Para Birimi</Form.Label>
                                    <Form.Select
                                        name="currency"
                                        value={editFormData.currency}
                                        onChange={handleEditSelectChange}
                                    >
                                        <option value="TRY">TRY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </Form.Select>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Açıklama</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditInputChange as any}
                                        placeholder="Harcama ile ilgili detaylar..."
                                        rows={3}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Durum</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={editFormData.status}
                                        onChange={handleEditSelectChange}
                                    >
                                        <option value="DRAFT">Taslak</option>
                                        <option value="PENDING_APPROVAL">Onay Bekliyor</option>
                                        <option value="APPROVED">Onaylandı</option>
                                        <option value="REJECTED">Reddedildi</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        ) : (
                            <p>Harcama bilgileri yüklenemedi.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            İptal
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleUpdateExpense} 
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Güncelle'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
};

export default ExpensesPage;
