import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import swal from 'sweetalert';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../page/personalcss/layout.css';
import '../page/personalcss/components.css';
import '../page/personalcss/responsive.css';
import { Sidebar } from '../components/Sidebar';

// Harcama arayüzü
interface Expense {
    id: number;
    employeeId: number;
    expenseType: string;
    amount: number;
    currency: string;
    date: string;
    description: string;
    receiptUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Form durumu
interface ExpenseForm {
    expenseType: string;
    amount: string;
    currency: string;
    date: string;
    description: string;
    receipt: File | null;
}

// API yapılandırması
const API = {
    BASE_URL: 'http://localhost:9090',
    VERSION: '/v1',
    API: '/api',
    DEVELOPER: '/dev',
    get ROOT() { return this.VERSION + this.DEVELOPER; }
};

// API Endpoints
const API_ENDPOINTS = {
    EMPLOYEE: {
        BASE: `${API.ROOT}/employee`,
        EXPENSES: `${API.ROOT}/employee/expenses`,
    },
    CRUD: {
        SAVE: '/save',
        UPDATE: (id: number) => `/update/${id}`,
        DELETE: (id: number) => `/delete/${id}`,
        LIST: '/list',
        GET_BY_ID: (id: number) => `/get-by-id/${id}`,
        GET_EXPENSES_BY_EMPLOYEE_ID: (id: number) => `/get-expenses-by-employee/${id}`
    }
};

// Kullanılacak Routes
const ROUTES = {
    EXPENSES: {
        LIST: API_ENDPOINTS.EMPLOYEE.EXPENSES + API_ENDPOINTS.CRUD.LIST,
        SAVE: API_ENDPOINTS.EMPLOYEE.EXPENSES + API_ENDPOINTS.CRUD.SAVE,
        UPDATE: (id: number) => API_ENDPOINTS.EMPLOYEE.EXPENSES + API_ENDPOINTS.CRUD.UPDATE(id),
        DELETE: (id: number) => API_ENDPOINTS.EMPLOYEE.EXPENSES + API_ENDPOINTS.CRUD.DELETE(id),
        GET_BY_EMPLOYEE_ID: (employeeId: number) => 
            API_ENDPOINTS.EMPLOYEE.EXPENSES + API_ENDPOINTS.CRUD.GET_EXPENSES_BY_EMPLOYEE_ID(employeeId),
        APPROVE: (id: number) => `${API_ENDPOINTS.EMPLOYEE.EXPENSES}/approve/${id}`,
        REJECT: (id: number) => `${API_ENDPOINTS.EMPLOYEE.EXPENSES}/reject/${id}`
    }
};

function ExpensesPage() {
    // State tanımlamaları
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
    const [selectedReceipt, setSelectedReceipt] = useState<string>('');
    const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
        expenseType: '',
        amount: '',
        currency: 'TRY',
        date: '',
        description: '',
        receipt: null
    });

    // Sidebar toggle fonksiyonu
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Token alma fonksiyonu
    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Fetch yardımcı fonksiyonu
    const fetchWithAuth = async (url: string, options: any = {}) => {
        const token = getAuthToken();
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...options.headers
        };
        
        return fetch(`${API.BASE_URL}${url}`, {
            ...options,
            headers
        });
    };

    // Form verisi gönderen yardımcı fonksiyon
    const postFormDataWithAuth = async (url: string, formData: FormData) => {
        const token = getAuthToken();
        
        const headers = {
            'Authorization': token ? `Bearer ${token}` : ''
        };
        
        return fetch(`${API.BASE_URL}${url}`, {
            method: 'POST',
            body: formData,
            headers
        });
    };

    // Harcamaları yükleme
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Kullanıcı kimliğini al (gerçek uygulamada bu kullanıcı oturumundan alınabilir)
            const userId = localStorage.getItem('userId') || '1'; // Varsayılan kullanıcı ID'si

            const response = await fetchWithAuth(ROUTES.EXPENSES.GET_BY_EMPLOYEE_ID(parseInt(userId)));
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setExpenses(data.content || data);
        } catch (error) {
            console.error("Harcama verileri alınamadı:", error);
            setError("Harcama verileri yüklenirken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Sayfa yüklendiğinde verileri çek
    useEffect(() => {
        fetchExpenses();
    }, []);

    // Sayfa yüklendiğinde animasyon efekti ekleyelim
    useEffect(() => {
        // Fadein animasyonu için ana elementi seçelim
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.classList.add('animate__animated', 'animate__fadeIn');
        }
    }, []);

    // Tarih formatlama
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    // Harcama durumu görünümü
    const getStatusBadge = (status: string) => {
        if (status === 'approved') {
            return <Badge bg="success" pill className="px-3 py-1">Onaylandı</Badge>;
        } else if (status === 'rejected') {
            return <Badge bg="danger" pill className="px-3 py-1">Reddedildi</Badge>;
        } else {
            return <Badge bg="warning" pill className="px-3 py-1">Bekliyor</Badge>;
        }
    };

    // Modal kapatma
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentExpense(null);
        setExpenseForm({
            expenseType: '',
            amount: '',
            currency: 'TRY',
            date: '',
            description: '',
            receipt: null
        });
    };

    // Yeni harcama ekleme
    const handleShowAddModal = () => {
        setCurrentExpense(null);
        setExpenseForm({
            expenseType: '',
            amount: '',
            currency: 'TRY',
            date: new Date().toISOString().split('T')[0], // Bugünün tarihi
            description: '',
            receipt: null
        });
        setShowModal(true);
    };

    // Harcama düzenleme
    const handleShowEditModal = (expense: Expense) => {
        setCurrentExpense(expense);
        setExpenseForm({
            expenseType: expense.expenseType,
            amount: expense.amount.toString(),
            currency: expense.currency,
            date: expense.date.split('T')[0],
            description: expense.description,
            receipt: null
        });
        setShowModal(true);
    };

    // Form input değişikliklerini izleme
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExpenseForm({
            ...expenseForm,
            [name]: value
        });
    };

    // Dosya seçimi değişikliklerini izleme
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setExpenseForm({
                ...expenseForm,
                receipt: e.target.files[0]
            });
        }
    };

    // Harcama formunu gönderme (ekleme veya güncelleme)
    const handleSubmitExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            // Kullanıcı kimliğini al (gerçek uygulamada bu kullanıcı oturumundan alınabilir)
            const employeeId = localStorage.getItem('userId') || '1'; // Varsayılan kullanıcı ID'si
            
            // Form verisi oluştur
            const formData = new FormData();
            formData.append('employeeId', employeeId);
            formData.append('expenseType', expenseForm.expenseType);
            formData.append('amount', expenseForm.amount);
            formData.append('currency', expenseForm.currency);
            formData.append('date', expenseForm.date);
            formData.append('description', expenseForm.description);
            
            if (expenseForm.receipt) {
                formData.append('receipt', expenseForm.receipt);
            }
            
            let response;
            
            if (currentExpense) {
                // Mevcut harcamayı güncelle
                formData.append('id', currentExpense.id.toString());
                formData.append('status', currentExpense.status);
                
                response = await fetch(`${API.BASE_URL}${ROUTES.EXPENSES.UPDATE(currentExpense.id)}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
            } else {
                // Yeni harcama ekle
                formData.append('status', 'pending');
                
                response = await postFormDataWithAuth(ROUTES.EXPENSES.SAVE, formData);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const savedExpense = await response.json();
            
            if (currentExpense) {
                // Güncellenen harcamayı listeye ekle
                setExpenses(expenses.map(exp => exp.id === currentExpense.id ? savedExpense : exp));
                swal("Başarılı", "Harcama başarıyla güncellendi.", "success");
            } else {
                // Yeni harcamayı listeye ekle
                setExpenses([...expenses, savedExpense]);
                swal("Başarılı", "Harcama başarıyla eklendi.", "success");
            }
            
            // Formu kapat
            handleCloseModal();
        } catch (error) {
            console.error("Harcama kaydedilemedi:", error);
            swal("Hata", "Harcama kaydedilirken bir sorun oluştu.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Harcama silme
    const handleDeleteExpense = async (expenseId: number) => {
        try {
            const willDelete = await swal({
                title: "Emin misiniz?",
                text: "Bu harcama kaydını silmek istediğinizden emin misiniz?",
                icon: "warning",
                buttons: ["İptal", "Evet, Sil"],
                dangerMode: true,
            });
    
            if (willDelete) {
                const response = await fetchWithAuth(ROUTES.EXPENSES.DELETE(expenseId), {
                    method: 'DELETE'
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                setExpenses(expenses.filter(exp => exp.id !== expenseId));
                swal("Başarılı", "Harcama başarıyla silindi.", "success");
            }
        } catch (error) {
            console.error("Harcama silinemedi:", error);
            swal("Hata", "Harcama silinirken bir sorun oluştu.", "error");
        }
    };

    // Makbuz görüntüleme
    const handleShowReceipt = (receiptUrl: string) => {
        setSelectedReceipt(receiptUrl);
        setShowReceiptModal(true);
    };

    // Filtrelenen harcamaları getir
    const getFilteredExpenses = () => {
        return expenses.filter(expense => {
            // Arama terimi filtresi
            const searchMatch = 
                expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.expenseType.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Durum filtresi
            const statusMatch = filterStatus === 'all' || expense.status === filterStatus;
            
            // Tarih filtresi
            let dateMatch = true;
            const expenseDate = new Date(expense.date);
            
            if (filterDateFrom) {
                const fromDate = new Date(filterDateFrom);
                dateMatch = dateMatch && expenseDate >= fromDate;
            }
            
            if (filterDateTo) {
                const toDate = new Date(filterDateTo);
                toDate.setHours(23, 59, 59, 999); // Gün sonuna ayarla
                dateMatch = dateMatch && expenseDate <= toDate;
            }
            
            return searchMatch && statusMatch && dateMatch;
        });
    };

    // Filtreleri temizleme
    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterDateFrom('');
        setFilterDateTo('');
    };

    // Filtrelenen harcamaları al
    const filteredExpenses = getFilteredExpenses();

    // Harcama türleri listesi
    const expenseTypes = [
        { value: 'transportation', label: 'Ulaşım' },
        { value: 'meals', label: 'Yemek' },
        { value: 'accommodation', label: 'Konaklama' },
        { value: 'office', label: 'Ofis Malzemeleri' },
        { value: 'training', label: 'Eğitim' },
        { value: 'other', label: 'Diğer' }
    ];

    // Para birimleri
    const currencies = [
        { value: 'TRY', label: '₺ TRY' },
        { value: 'USD', label: '$ USD' },
        { value: 'EUR', label: '€ EUR' },
        { value: 'GBP', label: '£ GBP' }
    ];

    // Harcama türünü görüntüleme
    const getExpenseTypeLabel = (type: string) => {
        const found = expenseTypes.find(t => t.value === type);
        return found ? found.label : type;
    };

    // Para birimi sembolü
    const getCurrencySymbol = (currency: string) => {
        switch (currency) {
            case 'TRY': return '₺';
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            default: return '';
        }
    };

    // Renk paletini genişletelim - Expense türlerine göre renk atamaları
    const getExpenseTypeColor = (type: string) => {
        switch (type) {
            case 'TRAVEL':
                return '#4361ee';
            case 'MEAL':
                return '#3a86ff';
            case 'ACCOMMODATION':
                return '#7209b7';
            case 'OFFICE_SUPPLIES':
                return '#f72585';
            case 'TRAINING':
                return '#4cc9f0';
            default:
                return '#4895ef';
        }
    };

    // Expense türü ikonları
    const getExpenseTypeIcon = (type: string) => {
        switch (type) {
            case 'TRAVEL':
                return 'fas fa-plane';
            case 'MEAL':
                return 'fas fa-utensils';
            case 'ACCOMMODATION':
                return 'fas fa-hotel';
            case 'OFFICE_SUPPLIES':
                return 'fas fa-shopping-cart';
            case 'TRAINING':
                return 'fas fa-graduation-cap';
            default:
                return 'fas fa-receipt';
        }
    };

    return (
        <div className="personal-management-container">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                {/* Başlık */}
                <section className="page-header">
                    <div>
                        <h1 className="page-title">
                            <i className="fas fa-receipt"></i> Harcama Yönetimi
                        </h1>
                        <p className="page-subtitle">
                            Harcamalarınızı ekleyin, düzenleyin ve durumlarını takip edin. 
                            <span className="ms-2 text-primary">
                                <i className="fas fa-info-circle" data-bs-toggle="tooltip" title="Makbuz yüklemek zorunludur."></i>
                            </span>
                        </p>
                    </div>
                    <div>
                        <Button 
                            className="btn-primary" 
                            onClick={handleShowAddModal}
                        >
                            <i className="fas fa-plus-circle me-2"></i>Yeni Harcama
                        </Button>
                    </div>
                </section>

                {/* Ana içerik */}
                <section className="content-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <i className="fas fa-filter"></i> Filtreleme
                        </h2>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={handleClearFilters}
                        >
                            <i className="fas fa-times me-1"></i> Filtreleri Temizle
                        </Button>
                    </div>

                    {/* Arama ve filtreleme */}
                    <div className="filter-grid">
                        <Form className="mb-4">
                            <div className="grid-container">
                                <Form.Group controlId="formExpenseType">
                                    <Form.Label>
                                        <i className="fas fa-tag me-2 text-primary"></i>
                                        Harcama Türü
                                    </Form.Label>
                                    <Form.Select 
                                        value={expenseForm.expenseType}
                                        onChange={(e) => setExpenseForm({...expenseForm, expenseType: e.target.value})}
                                        required
                                    >
                                        <option value="">Tümü</option>
                                        <option value="TRAVEL">Seyahat</option>
                                        <option value="MEAL">Yemek</option>
                                        <option value="ACCOMMODATION">Konaklama</option>
                                        <option value="OFFICE_SUPPLIES">Ofis Malzemeleri</option>
                                        <option value="TRAINING">Eğitim</option>
                                        <option value="OTHER">Diğer</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formStatus">
                                    <Form.Label>
                                        <i className="fas fa-tasks me-2 text-primary"></i>
                                        Durum
                                    </Form.Label>
                                    <Form.Select 
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="">Tümü</option>
                                        <option value="pending">Beklemede</option>
                                        <option value="approved">Onaylandı</option>
                                        <option value="rejected">Reddedildi</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group controlId="formDateFrom">
                                    <Form.Label>
                                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                        Başlangıç Tarihi
                                    </Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={filterDateFrom}
                                        onChange={(e) => setFilterDateFrom(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formDateTo">
                                    <Form.Label>
                                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                        Bitiş Tarihi
                                    </Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={filterDateTo}
                                        onChange={(e) => setFilterDateTo(e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </Form>
                    </div>

                    <hr className="divider" />

                    {/* Hata mesajı */}
                    {error && (
                        <Alert variant="danger" className="mb-4">
                            <i className="fas fa-exclamation-triangle me-2"></i> {error}
                        </Alert>
                    )}

                    {/* Yükleme göstergesi */}
                    {loading ? (
                        <div className="loading-container">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="visually-hidden">Yükleniyor...</span>
                            </Spinner>
                            <span className="ms-3 text-primary">Harcamalar yükleniyor...</span>
                        </div>
                    ) : (
                        // Boş durum veya tablo
                        filteredExpenses.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <i className="fas fa-receipt"></i>
                                </div>
                                <h3>Harcama bulunamadı</h3>
                                <p className="empty-state-text">
                                    Görüntülenecek herhangi bir harcama bulunmuyor. Yeni harcama ekleyebilir veya filtrelerinizi değiştirebilirsiniz.
                                </p>
                                <Button variant="primary" onClick={handleShowAddModal}>
                                    <i className="fas fa-plus-circle me-2"></i>Yeni Harcama Ekle
                                </Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tür</th>
                                            <th>Tutar</th>
                                            <th>Tarih</th>
                                            <th>Açıklama</th>
                                            <th>Durum</th>
                                            <th>Makbuz</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredExpenses.map((expense) => (
                                            <tr key={expense.id} className="expense-row">
                                                <td>#{expense.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <span 
                                                            className="expense-type-icon me-2"
                                                            style={{ 
                                                                backgroundColor: getExpenseTypeColor(expense.expenseType),
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '50%',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white'
                                                            }}
                                                        >
                                                            <i className={getExpenseTypeIcon(expense.expenseType)}></i>
                                                        </span>
                                                        {getExpenseTypeLabel(expense.expenseType)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{expense.amount} {getCurrencySymbol(expense.currency)}</strong>
                                                </td>
                                                <td>{formatDate(expense.date)}</td>
                                                <td>
                                                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {expense.description}
                                                    </div>
                                                </td>
                                                <td>{getStatusBadge(expense.status)}</td>
                                                <td>
                                                    {expense.receiptUrl && (
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="btn-icon"
                                                            onClick={() => handleShowReceipt(expense.receiptUrl!)}
                                                        >
                                                            <i className="fas fa-file-alt"></i>
                                                        </Button>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            className="btn-icon"
                                                            onClick={() => handleShowEditModal(expense)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            className="btn-icon"
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </Button>
                                                        
                                                        {expense.receiptUrl && (
                                                            <Button 
                                                                variant="outline-success" 
                                                                size="sm"
                                                                className="btn-icon"
                                                                as="a" 
                                                                href={expense.receiptUrl} 
                                                                download
                                                                target="_blank"
                                                            >
                                                                <i className="fas fa-download"></i>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )
                    )}
                </section>

                {/* Yeni Harcama Ekleme Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-plus-circle me-2 text-primary"></i>
                            {currentExpense ? 'Harcamayı Düzenle' : 'Yeni Harcama Ekle'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted mb-4">
                            <i className="fas fa-info-circle me-2"></i>
                            Tüm alanları eksiksiz doldurun ve makbuz yüklemeyi unutmayın.
                        </p>
                        
                        <Form onSubmit={handleSubmitExpense}>
                            <div className="grid-container">
                                <Form.Group className="mb-3" controlId="formExpenseType">
                                    <Form.Label>Harcama Türü</Form.Label>
                                    <Form.Select 
                                        value={expenseForm.expenseType}
                                        onChange={(e) => setExpenseForm({...expenseForm, expenseType: e.target.value})}
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="TRAVEL">Seyahat</option>
                                        <option value="MEAL">Yemek</option>
                                        <option value="ACCOMMODATION">Konaklama</option>
                                        <option value="OFFICE_SUPPLIES">Ofis Malzemeleri</option>
                                        <option value="TRAINING">Eğitim</option>
                                        <option value="OTHER">Diğer</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formAmount">
                                    <Form.Label>Tutar</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="Tutarı girin" 
                                        value={expenseForm.amount}
                                        onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formCurrency">
                                    <Form.Label>Para Birimi</Form.Label>
                                    <Form.Select 
                                        value={expenseForm.currency}
                                        onChange={(e) => setExpenseForm({...expenseForm, currency: e.target.value})}
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="TRY">Türk Lirası (₺)</option>
                                        <option value="USD">Amerikan Doları ($)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="GBP">İngiliz Sterlini (£)</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formDate">
                                    <Form.Label>Tarih</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={expenseForm.date}
                                        onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>

                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Açıklama</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Harcama hakkında detaylı bilgi verin" 
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formReceipt">
                                <Form.Label>Makbuz</Form.Label>
                                <div className={`file-upload-area ${expenseForm.receipt ? 'file-selected' : ''}`}>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="receipt-upload"
                                    />
                                    <label htmlFor="receipt-upload" className="d-block" style={{ cursor: 'pointer' }}>
                                        <div className="file-upload-icon">
                                            <i className={expenseForm.receipt ? 'fas fa-check-circle' : 'fas fa-upload'}></i>
                                        </div>
                                        {expenseForm.receipt ? (
                                            <>
                                                <p className="file-upload-text"><strong>Dosya seçildi:</strong> {expenseForm.receipt.name}</p>
                                                <p className="text-muted">Değiştirmek için tıklayın</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="file-upload-text">Dosya seçmek için tıklayın veya sürükleyip bırakın</p>
                                                <p className="text-muted">PDF, PNG, JPEG veya JPG (max. 5MB)</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {!currentExpense && (
                                    <div className="text-danger mt-2">
                                        <small><i className="fas fa-exclamation-circle me-1"></i> Makbuz yüklemek zorunludur</small>
                                    </div>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            <i className="fas fa-times me-2"></i>İptal
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i>
                                    Kaydet
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Makbuz Görüntüleme Modal */}
                <Modal show={showReceiptModal} onHide={() => setShowReceiptModal(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i className="fas fa-file-alt me-2 text-primary"></i>
                            Makbuz Görüntüleme
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center p-0">
                        {selectedReceipt && (
                            selectedReceipt.endsWith('.pdf') ? (
                                <div className="pdf-container p-2">
                                    <iframe 
                                        src={selectedReceipt} 
                                        width="100%" 
                                        height="500px" 
                                        style={{ border: 'none' }}
                                        title="PDF Viewer"
                                    />
                                </div>
                            ) : (
                                <div className="img-container p-4">
                                    <img 
                                        src={selectedReceipt} 
                                        alt="Makbuz"
                                        className="img-fluid" 
                                        style={{ maxHeight: '500px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                                    />
                                </div>
                            )
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReceiptModal(false)}>
                            <i className="fas fa-times me-2"></i>
                            Kapat
                        </Button>
                        <Button 
                            variant="primary" 
                            as="a"
                            href={selectedReceipt}
                            download
                            target="_blank"
                        >
                            <i className="fas fa-download me-2"></i>
                            indir
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </div>
    );
}

export default ExpensesPage; 