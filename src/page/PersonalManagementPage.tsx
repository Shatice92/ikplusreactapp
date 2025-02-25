import React, { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './personalmanagement.css'
import swal from 'sweetalert'
import '@fortawesome/fontawesome-free/css/all.min.css'

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    birthDate: string;
    hireDate: string;
    isActive: boolean;
    email: string;
    phoneNumber: string;
    department: string;
    position: string;
    salary: string;
    identityNumber: string;
    gender: string;
    address: string;
    emergencyContact: string;
    emergencyPhone: string;
}

interface Document {
    id: number;
    employeeId: number;
    name: string;
    type: string;
    uploadDate: string;
}

interface LeaveRequest {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    type: string;
}

interface Asset {
    id: number;
    employeeId: number;
    name: string;
    assignmentDate: string;
    status: string;
}

interface Bonus {
    id: number;
    employeeId: number;
    amount: number;
    date: string;
    description: string;
}

// Employee Card bileşeni (Performans optimizasyonu için)
const EmployeeRow: React.FC<{
    employee: Employee;
    onEdit: (employee: Employee) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, isActive: boolean) => void;
    onDocumentClick: (employee: Employee) => void;
    onAssetClick: (employee: Employee) => void;
    onBonusClick: (employee: Employee) => void;
}> = React.memo(({ 
    employee, 
    onEdit, 
    onDelete, 
    onToggleStatus, 
    onDocumentClick,
    onAssetClick,
    onBonusClick
}) => {
    return (
        <tr key={employee.id}>
            <td>
                <div className="d-flex align-items-center">
                    <div className="employee-avatar me-3">
                        <img 
                            src={employee.photoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                            alt={`${employee.firstName} ${employee.lastName}`}
                        />
                    </div>
                    <div>
                        <div className="fw-bold">{employee.firstName} {employee.lastName}</div>
                        <small className="text-muted">{employee.email}</small>
                    </div>
                </div>
            </td>
            <td>{employee.department}</td>
            <td>{employee.position}</td>
            <td>
                <div>
                    <div><i className="fas fa-phone me-1"></i> {employee.phoneNumber}</div>
                    <div><i className="fas fa-id-card me-1"></i> {employee.identityNumber}</div>
                    <small className="text-muted">
                        <i className="fas fa-birthday-cake me-1"></i> 
                        {new Date(employee.birthDate).toLocaleDateString('tr-TR')}
                    </small>
                </div>
            </td>
            <td>
                <span 
                    className={`badge ${employee.isActive ? 'bg-success' : 'bg-danger'}`}
                    onClick={() => onToggleStatus(employee.id, employee.isActive)}
                    style={{ cursor: 'pointer' }}
                    title={employee.isActive ? 'Aktif (Pasif yapmak için tıklayın)' : 'Pasif (Aktif yapmak için tıklayın)'}
                >
                    {employee.isActive ? 'Aktif' : 'Pasif'}
                </span>
            </td>
            <td>
                <div className="btn-group-vertical w-100">
                    <div className="btn-group">
                        <button 
                            className="btn btn-sm btn-info"
                            onClick={() => onDocumentClick(employee)}
                            title="Belgeler"
                        >
                            <i className="fas fa-file-alt"></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => onEdit(employee)}
                            title="Düzenle"
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-purple"
                            onClick={() => onAssetClick(employee)}
                            title="Zimmet"
                        >
                            <i className="fas fa-box"></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-success"
                            onClick={() => onBonusClick(employee)}
                            title="Prim"
                        >
                            <i className="fas fa-gift"></i>
                        </button>
                        <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => onDelete(employee.id)}
                            title="Sil"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
});

function PersonalManagementPage() {
    // State tanımlama
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    
    // Yükleme durumu için state
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showBonusModal, setShowBonusModal] = useState(false);
    
    // Selected item states
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);

    // Form states
    const [employeeForm, setEmployeeForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        hireDate: '',
        phoneNumber: '',
        department: '',
        position: '',
        salary: '',
        identityNumber: '',
        gender: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
    });

    // Belge yönetimi için yeni state ve fonksiyonlar ekleyelim
    const [documentForm, setDocumentForm] = useState({
        name: '',
        type: '',
        file: null as File | null,
        category: '',
        expiryDate: '',
        description: '',
        isConfidential: false,
        tags: [] as string[],
        version: '1.0',
        reviewedBy: '',
        reviewDate: '',
        status: 'active'
    });

    // LeaveRequest için yeni form state
    const [leaveForm, setLeaveForm] = useState({
        startDate: '',
        endDate: '',
        type: '',
        status: 'pending' as const
    });

    // Asset (Zimmet) yönetimi için form state
    const [assetForm, setAssetForm] = useState({
        name: '',
        status: 'active',
        assignmentDate: new Date().toISOString().split('T')[0],
        serialNumber: '',
        brand: '',
        model: '',
        description: '',
        condition: 'new',
        value: '',
        warranty: {
            hasWarranty: false,
            startDate: '',
            endDate: '',
            provider: ''
        },
        location: '',
        department: '',
        purchaseDate: '',
        purchasePrice: '',
        supplier: '',
        maintenanceHistory: [] as {
            date: string;
            description: string;
            cost: string;
            technician: string;
        }[],
        attachments: [] as {
            name: string;
            type: string;
            url: string;
        }[],
        notes: '',
        insuranceInfo: {
            hasInsurance: false,
            provider: '',
            policyNumber: '',
            startDate: '',
            endDate: '',
            coverage: ''
        }
    });

    // Prim yönetimi için form state
    const [bonusForm, setBonusForm] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'PERFORMANCE',
        period: '',
        currency: 'TRY'
    });

    // Arama için state
    const [searchTerm, setSearchTerm] = useState('');

    // Filtreleme ve sıralama için state'ler
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Sayfalama için state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Sidebar için state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // Form için error state'i ekleyelim
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    // Sidebar toggle fonksiyonu
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    useEffect(() => {
        // API'den personel verilerini çek
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchEmployees(),
                fetchDocuments(),
                fetchLeaveRequests(), 
                fetchAssets(),
                fetchBonuses()
            ]);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
            swal("Hata", "Veriler yüklenirken bir hata oluştu.", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            // API çağrısı burada yapılacak
            const mockData: Employee[] = [
                {
                    id: 1,
                    firstName: "Ahmet",
                    lastName: "Yılmaz",
                    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
                    birthDate: "1990-01-01",
                    hireDate: "2020-03-15",
                    isActive: true,
                    email: "ahmet@example.com",
                    phoneNumber: '555-0101',
                    department: 'IT',
                    position: 'Yazılım Geliştirici',
                    salary: '25000',
                    identityNumber: '12345678901',
                    gender: 'MALE',
                    address: 'İstanbul',
                    emergencyContact: 'Ayşe Yılmaz',
                    emergencyPhone: '555-0102',
                },
                {
                    id: 2,
                    firstName: "Ayşe",
                    lastName: "Demir",
                    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
                    birthDate: "1992-05-15",
                    hireDate: "2021-02-01",
                    isActive: true,
                    email: "ayse@example.com",
                    phoneNumber: '555-0201',
                    department: 'HR',
                    position: 'İK Uzmanı',
                    salary: '22000',
                    identityNumber: '12345678902',
                    gender: 'FEMALE',
                    address: 'Ankara',
                    emergencyContact: 'Ali Demir',
                    emergencyPhone: '555-0202',
                },
                {
                    id: 3,
                    firstName: "Mehmet",
                    lastName: "Kaya",
                    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
                    birthDate: "1988-08-20",
                    hireDate: "2019-06-10",
                    isActive: false,
                    email: "mehmet@example.com",
                    phoneNumber: '555-0301',
                    department: 'SALES',
                    position: 'Satış Müdürü',
                    salary: '35000',
                    identityNumber: '12345678903',
                    gender: 'MALE',
                    address: 'İzmir',
                    emergencyContact: 'Fatma Kaya',
                    emergencyPhone: '555-0302',
                },
                {
                    id: 4,
                    firstName: "Zeynep",
                    lastName: "Şahin",
                    photoUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
                    birthDate: "1995-03-25",
                    hireDate: "2022-01-15",
                    isActive: true,
                    email: "zeynep@example.com",
                    phoneNumber: '555-0401',
                    department: 'FINANCE',
                    position: 'Muhasebe Uzmanı',
                    salary: '28000',
                    identityNumber: '12345678904',
                    gender: 'FEMALE',
                    address: 'Bursa',
                    emergencyContact: 'Mustafa Şahin',
                    emergencyPhone: '555-0402',
                },
                {
                    id: 5,
                    firstName: "Ali",
                    lastName: "Öztürk",
                    photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
                    birthDate: "1991-11-30",
                    hireDate: "2020-09-01",
                    isActive: false,
                    email: "ali@example.com",
                    phoneNumber: '555-0501',
                    department: 'IT',
                    position: 'Sistem Yöneticisi',
                    salary: '27000',
                    identityNumber: '12345678905',
                    gender: 'MALE',
                    address: 'Antalya',
                    emergencyContact: 'Ayşe Öztürk',
                    emergencyPhone: '555-0502',
                }
            ];
            setEmployees(mockData);
        } catch (error) {
            console.error("Personel verileri alınamadı:", error);
        }
    };

    const fetchDocuments = async () => {
        try {
            // API çağrısı burada yapılacak
            const mockDocuments: Document[] = [
                {
                    id: 1,
                    employeeId: 1,
                    name: "Sözleşme",
                    type: "pdf",
                    uploadDate: "2024-03-15"
                }
            ];
            setDocuments(mockDocuments);
        } catch (error) {
            console.error("Belgeler alınamadı:", error);
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            // API çağrısı burada yapılacak
            const mockLeaveRequests: LeaveRequest[] = [
                {
                    id: 1,
                    employeeId: 1,
                    startDate: "2024-03-20",
                    endDate: "2024-03-25",
                    status: "pending",
                    type: "Yıllık İzin"
                }
            ];
            setLeaveRequests(mockLeaveRequests);
        } catch (error) {
            console.error("İzin talepleri alınamadı:", error);
        }
    };

    // Zimmet verilerini getir
    const fetchAssets = async () => {
        try {
            // API çağrısı burada yapılacak
            const mockAssets: Asset[] = [
                {
                    id: 1,
                    employeeId: 1,
                    name: "Laptop",
                    assignmentDate: "2024-03-15",
                    status: "active"
                }
            ];
            setAssets(mockAssets);
        } catch (error) {
            console.error("Zimmet verileri alınamadı:", error);
        }
    };

    // Prim verilerini getir
    const fetchBonuses = async () => {
        try {
            const mockBonuses: Bonus[] = [
                {
                    id: 1,
                    employeeId: 1,
                    amount: 1000,
                    date: "2024-03-15",
                    description: "Performans Primi"
                }
            ];
            setBonuses(mockBonuses);
        } catch (error) {
            console.error("Prim verileri alınamadı:", error);
        }
    };

    // Form doğrulama işlevi
    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        // TC Kimlik No doğrulama
        if (!/^[0-9]{11}$/.test(employeeForm.identityNumber)) {
            errors.identityNumber = "TC Kimlik No 11 haneli ve sadece rakam olmalıdır";
        }
        
        // Email doğrulama
        if (!/\S+@\S+\.\S+/.test(employeeForm.email)) {
            errors.email = "Geçerli bir email adresi giriniz";
        }
        
        // Telefon doğrulama
        if (!/^[0-9\-\+\s\(\)]{7,15}$/.test(employeeForm.phoneNumber)) {
            errors.phoneNumber = "Geçerli bir telefon numarası giriniz";
        }
        
        // Ad ve soyad doğrulama
        if (employeeForm.firstName.trim().length < 2) {
            errors.firstName = "Ad en az 2 karakter olmalıdır";
        }
        
        if (employeeForm.lastName.trim().length < 2) {
            errors.lastName = "Soyad en az 2 karakter olmalıdır";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Personel ekleme/güncelleme fonksiyonu
    const handleEmployeeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Form doğrulama
        if (!validateForm()) {
            swal("Hata", "Lütfen form bilgilerini kontrol ediniz", "error");
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch('http://localhost:9090/v1/dev/employee/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: employeeForm.firstName,
                    lastName: employeeForm.lastName,
                    email: employeeForm.email,
                    birthDate: employeeForm.birthDate,
                    hireDate: employeeForm.hireDate,
                    isActive: true
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.code === 200) {
                    swal("Başarılı", "Personel başarıyla eklendi", "success");
                    setShowEmployeeModal(false);
                    fetchData(); // Personel listesini güncelle
                    
                    // Email gönder
                    await sendEmail(
                        employeeForm.email,
                        'Hoş Geldiniz',
                        'Şirketimize hoş geldiniz. Sisteme kaydınız başarıyla oluşturulmuştur.'
                    );

                    // Formu temizle
                    setEmployeeForm({
                        firstName: '',
                        lastName: '',
                        email: '',
                        birthDate: '',
                        hireDate: '',
                        phoneNumber: '',
                        department: '',
                        position: '',
                        salary: '',
                        identityNumber: '',
                        gender: '',
                        address: '',
                        emergencyContact: '',
                        emergencyPhone: '',
                    });
                    setFormErrors({});
                } else {
                    swal("Hata", result.message || "Bir hata oluştu", "error");
                }
            } else {
                throw new Error('Sunucu hatası');
            }
        } catch (error) {
            console.error('Personel eklenirken hata:', error);
            swal("Hata", "Personel eklenirken bir hata oluştu", "error");
        } finally {
            setLoading(false);
        }
    };

    // Personel durum değiştirme fonksiyonu
    const handleToggleEmployeeStatus = async (employeeId: number, isActive: boolean) => {
        try {
            setLoading(true);
            // Burada API çağrısı yapılacak

            // API çağrısı simülasyonu (başarılı)
            // Kısa gecikme ekleyerek yükleme durumunu gösterelim
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Personel listesini güncelle
            setEmployees(employees.map(emp => {
                if (emp.id === employeeId) {
                    return { ...emp, isActive: !isActive };
                }
                return emp;
            }));
            
            // Bildirim göster
            swal({
                title: "Başarılı!",
                text: `Personel durumu ${!isActive ? 'aktif' : 'pasif'} olarak güncellendi.`,
                icon: "success",
            });
        } catch (error) {
            // Hata durumunda
            swal({
                title: "Hata!",
                text: "Personel durumu güncellenirken bir hata oluştu.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Email gönderme fonksiyonu
    const sendEmail = async (to: string, subject: string, body: string) => {
        try {
            await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, body })
            });
        } catch (error) {
            console.error('Email gönderilemedi:', error);
        }
    };

    // Belge yönetimi işlemleri
    const handleDocumentUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee || !documentForm.file) return;

        try {
            const formData = new FormData();
            formData.append('file', documentForm.file);
            formData.append('name', documentForm.name);
            formData.append('type', documentForm.type);
            formData.append('employeeId', selectedEmployee.id.toString());

            const response = await fetch('/api/documents', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                await fetchDocuments();
                setShowDocumentModal(false);
                setDocumentForm({
                    name: '',
                    type: '',
                    file: null,
                    category: '',
                    expiryDate: '',
                    description: '',
                    isConfidential: false,
                    tags: [],
                    version: '1.0',
                    reviewedBy: '',
                    reviewDate: '',
                    status: 'active'
                });
                await sendEmail(
                    selectedEmployee.email,
                    'Yeni Belge Eklendi',
                    `${documentForm.name} belgesi sisteme yüklendi.`
                );
            }
        } catch (error) {
            console.error('Belge yüklenemedi:', error);
        }
    };

    // Belge silme işlemi
    const handleDeleteDocument = async (documentId: number) => {
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchDocuments();
            }
        } catch (error) {
            console.error('Belge silinemedi:', error);
        }
    };

    // İzin talebi onaylama/reddetme işlemi
    const handleLeaveRequestStatus = async (requestId: number, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/api/leave-requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                await fetchLeaveRequests();
                const request = leaveRequests.find(r => r.id === requestId);
                if (request) {
                    const employee = employees.find(e => e.id === request.employeeId);
                    if (employee) {
                        await sendEmail(
                            employee.email,
                            'İzin Talebi Güncelleme',
                            `İzin talebiniz ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.`
                        );
                    }
                }
            }
        } catch (error) {
            console.error('İzin talebi güncellenemedi:', error);
        }
    };

    // Zimmet ekleme işlemi
    const handleAddAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        try {
            const response = await fetch('/api/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...assetForm,
                    employeeId: selectedEmployee.id
                })
            });

            if (response.ok) {
                await fetchAssets();
                setAssetForm({
                    name: '',
                    status: 'active',
                    assignmentDate: new Date().toISOString().split('T')[0],
                    serialNumber: '',
                    brand: '',
                    model: '',
                    description: '',
                    condition: 'new',
                    value: '',
                    warranty: {
                        hasWarranty: false,
                        startDate: '',
                        endDate: '',
                        provider: ''
                    },
                    location: '',
                    department: '',
                    purchaseDate: '',
                    purchasePrice: '',
                    supplier: '',
                    maintenanceHistory: [],
                    attachments: [],
                    notes: '',
                    insuranceInfo: {
                        hasInsurance: false,
                        provider: '',
                        policyNumber: '',
                        startDate: '',
                        endDate: '',
                        coverage: ''
                    }
                });
                await sendEmail(
                    selectedEmployee.email,
                    'Yeni Zimmet Ataması',
                    `${assetForm.name} zimmetinize eklenmiştir.`
                );
            }
        } catch (error) {
            console.error('Zimmet eklenemedi:', error);
        }
    };

    // Zimmet silme işlemi
    const handleDeleteAsset = async (assetId: number) => {
        try {
            const response = await fetch(`/api/assets/${assetId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchAssets();
                const asset = assets.find(a => a.id === assetId);
                const employee = employees.find(e => e.id === asset?.employeeId);
                if (employee) {
                    await sendEmail(
                        employee.email,
                        'Zimmet Güncellemesi',
                        'Zimmetinizdeki bir ürün kaldırılmıştır.'
                    );
                }
            }
        } catch (error) {
            console.error('Zimmet silinemedi:', error);
        }
    };

    // Prim ekleme işlemi
    const handleAddBonus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        try {
            const response = await fetch('/api/bonuses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...bonusForm,
                    employeeId: selectedEmployee.id,
                    amount: parseFloat(bonusForm.amount)
                })
            });

            if (response.ok) {
                await fetchBonuses();
                setBonusForm({
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    type: 'PERFORMANCE',
                    period: '',
                    currency: 'TRY'
                });
                await sendEmail(
                    selectedEmployee.email,
                    'Yeni Prim Ataması',
                    `${bonusForm.amount} TL tutarında prim hesabınıza tanımlanmıştır.`
                );
            }
        } catch (error) {
            console.error('Prim eklenemedi:', error);
        }
    };

    // Prim silme işlemi
    const handleDeleteBonus = async (bonusId: number) => {
        try {
            const response = await fetch(`/api/bonuses/${bonusId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchBonuses();
                const bonus = bonuses.find(b => b.id === bonusId);
                const employee = employees.find(e => e.id === bonus?.employeeId);
                if (employee) {
                    await sendEmail(
                        employee.email,
                        'Prim Güncellemesi',
                        'Prim kaydınız silinmiştir.'
                    );
                }
            }
        } catch (error) {
            console.error('Prim silinemedi:', error);
        }
    };

    // Personel düzenleme fonksiyonu
    const handleEditEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        // Form state'ini seçili personel bilgileriyle doldur
        setEmployeeForm({
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            email: employee.email || '',
            birthDate: employee.birthDate ? employee.birthDate.split('T')[0] : '',
            hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
            phoneNumber: employee.phoneNumber || '',
            department: employee.department || '',
            position: employee.position || '',
            salary: employee.salary || '',
            identityNumber: employee.identityNumber || '',
            gender: employee.gender || '',
            address: employee.address || '',
            emergencyContact: employee.emergencyContact || '',
            emergencyPhone: employee.emergencyPhone || '',
        });
        setShowEmployeeModal(true);
    };

    // Prim işlemleri için state ve fonksiyonlar
    const handleBonusClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setBonusForm({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            type: 'PERFORMANCE',
            period: '',
            currency: 'TRY'
        });
        setShowBonusModal(true);
    };

    // Zimmet işlemleri için state ve fonksiyonlar
    const handleAssetClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setAssetForm({
            name: '',
            status: 'active',
            assignmentDate: new Date().toISOString().split('T')[0],
            serialNumber: '',
            brand: '',
            model: '',
            description: '',
            condition: 'new',
            value: '',
            warranty: {
                hasWarranty: false,
                startDate: '',
                endDate: '',
                provider: ''
            },
            location: '',
            department: '',
            purchaseDate: '',
            purchasePrice: '',
            supplier: '',
            maintenanceHistory: [],
            attachments: [],
            notes: '',
            insuranceInfo: {
                hasInsurance: false,
                provider: '',
                policyNumber: '',
                startDate: '',
                endDate: '',
                coverage: ''
            }
        });
        setShowAssetModal(true);
    };

    // Belge yönetimi işlemleri
    const handleDownloadDocument = async (documentId: number) => {
        try {
            const response = await fetch(`/api/documents/${documentId}/download`);
            if (!response.ok) throw new Error('Belge indirilemedi');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document'; // Sunucudan gelen dosya adını kullanabilirsiniz
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            swal({
                title: "Hata!",
                text: "Belge indirilirken bir hata oluştu.",
                icon: "error",
            });
        }
    };

    const handlePreviewDocument = async (documentId: number) => {
        try {
            const response = await fetch(`/api/documents/${documentId}/preview`);
            if (!response.ok) throw new Error('Belge önizlenemedi');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Yeni pencerede önizleme
            window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
        } catch (error) {
            swal({
                title: "Hata!",
                text: "Belge önizlenirken bir hata oluştu.",
                icon: "error",
            });
        }
    };

    // Silme işlemi için fonksiyonu güncelleyelim
    const handleDeleteEmployee = async (employeeId: number) => {
        try {
            // Silinecek personeli bul
            const employeeToDelete = employees.find(emp => emp.id === employeeId);
            if (!employeeToDelete) return;

            // Silme onayı için sweetalert kullanımı
            const willDelete = await swal({
                title: "Emin misiniz?",
                text: `${employeeToDelete.firstName} ${employeeToDelete.lastName} isimli personeli silmek istediğinizden emin misiniz?`,
                icon: "warning",
                buttons: ["İptal", "Evet, Sil"],
                dangerMode: true,
            });

            if (willDelete) {
                // API çağrısı burada yapılacak
                // const response = await fetch(`/api/employees/${employeeId}`, {
                //     method: 'DELETE'
                // });

                // Başarılı silme işlemi sonrası
                setEmployees(employees.filter(emp => emp.id !== employeeId));
                
                swal({
                    title: "Başarılı!",
                    text: `${employeeToDelete.firstName} ${employeeToDelete.lastName} başarıyla silindi.`,
                    icon: "success",
                });
            }
        } catch (error) {
            swal({
                title: "Hata!",
                text: "Personel silinirken bir hata oluştu.",
                icon: "error",
            });
        }
    };

    // Memoize edilmiş callback'ler - performans optimizasyonu
    const handleEditEmployeeCallback = useCallback((employee: Employee) => {
        handleEditEmployee(employee);
    }, []);
    
    const handleDeleteEmployeeCallback = useCallback((employeeId: number) => {
        handleDeleteEmployee(employeeId);
    }, []);
    
    const handleToggleEmployeeStatusCallback = useCallback((employeeId: number, isActive: boolean) => {
        handleToggleEmployeeStatus(employeeId, isActive);
    }, []);
    
    const handleDocumentClickCallback = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setShowDocumentModal(true);
    }, []);
    
    const handleAssetClickCallback = useCallback((employee: Employee) => {
        handleAssetClick(employee);
    }, []);
    
    const handleBonusClickCallback = useCallback((employee: Employee) => {
        handleBonusClick(employee);
    }, []);
    
    // Memoize edilmiş filtrelenmiş ve sıralanmış personel verileri
    const filteredEmployees = useMemo(() => {
        return employees
            .filter(employee => 
                // Arama filtresi
                (employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
                // Departman filtresi
                (filterDepartment === '' || employee.department === filterDepartment) &&
                // Durum filtresi
                (filterStatus === '' || 
                    (filterStatus === 'active' && employee.isActive) || 
                    (filterStatus === 'inactive' && !employee.isActive))
            )
            .sort((a, b) => {
                // Sıralama işlemi
                if (sortField === 'name') {
                    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    return sortDirection === 'asc' 
                        ? nameA.localeCompare(nameB) 
                        : nameB.localeCompare(nameA);
                } else if (sortField === 'department') {
                    return sortDirection === 'asc'
                        ? a.department.localeCompare(b.department)
                        : b.department.localeCompare(a.department);
                } else if (sortField === 'position') {
                    return sortDirection === 'asc'
                        ? a.position.localeCompare(b.position)
                        : b.position.localeCompare(a.position);
                } else if (sortField === 'hireDate') {
                    const dateA = new Date(a.hireDate).getTime();
                    const dateB = new Date(b.hireDate).getTime();
                    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                }
                return 0;
            });
    }, [employees, searchTerm, filterDepartment, filterStatus, sortField, sortDirection]);

    // Sayfalama için hesaplamalar (memoized)
    const paginationInfo = useMemo(() => {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
        
        return {
            totalPages,
            indexOfLastItem,
            indexOfFirstItem,
            currentItems
        };
    }, [filteredEmployees, itemsPerPage, currentPage]);
    
    // Memoize edilmiş departman listesi
    const departmentList = useMemo(() => {
        return Array.from(new Set(employees.map(e => e.department)));
    }, [employees]);
    
    // Memoize edilmiş özet istatistikler
    const employeeStats = useMemo(() => {
        return {
            total: employees.length,
            active: employees.filter(e => e.isActive).length,
            inactive: employees.filter(e => !e.isActive).length,
            departments: new Set(employees.map(e => e.department)).size
        };
    }, [employees]);

    const departmentStats = useMemo(() => {
        if (!employees || employees.length === 0) return [];
        
        const stats = employees.reduce((acc: { [key: string]: number }, emp) => {
            if (emp.department) {
                acc[emp.department] = (acc[emp.department] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(stats).map(([name, count]) => ({
            name,
            count,
            icon: 'fas fa-users'
        }));
    }, [employees]);

    // Sayfalama kontrolü
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="personal-management-container">
            {/* Sidebar */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        {sidebarCollapsed ? (
                            <img src="/assets/logo1.png" alt="IK Plus Logo" className="sidebar-logo" />
                        ) : (
                            <img src="/assets/logo2.png" alt="IK Plus Logo" className="sidebar-logo" />
                        )}
                    </div>
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                </div>
                
                <ul className="sidebar-menu">
                    <li className="menu-label">Ana Menü</li>
                    <li>
                        <a href="#" className="active">
                            <i className="fas fa-users"></i>
                            <span>Personel Yönetimi</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-calendar-alt"></i>
                            <span>İzin Yönetimi</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-clock"></i>
                            <span>Vardiya Yönetimi</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-box"></i>
                            <span>Zimmet Yönetimi</span>
                        </a>
                    </li>
                    
                    <li className="menu-label">Finans</li>
                    <li>
                        <a href="#">
                            <i className="fas fa-money-bill-wave"></i>
                            <span>Maaş Yönetimi</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-gift"></i>
                            <span>Prim Yönetimi</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-receipt"></i>
                            <span>Harcama Yönetimi</span>
                        </a>
                    </li>
                    
                    <li className="menu-label">Diğer</li>
                    <li>
                        <a href="#">
                            <i className="fas fa-chart-line"></i>
                            <span>Raporlar</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-user-cog"></i>
                            <span>Profil Ayarları</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-cog"></i>
                            <span>Ayarlar</span>
                        </a>
                    </li>
                </ul>
                
                <div className="sidebar-footer">
                    IK Plus v1.0.0
                </div>
            </div>
            
            {/* Ana İçerik */}
            <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
            
                {/* Özet İstatistik Kartları */}
                <div className="dashboard-summary">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="summary-card total">
                                <div className="card-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="card-content">
                                    <h3>{employeeStats.total}</h3>
                                    <p>Toplam Personel</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="summary-card active">
                                <div className="card-icon">
                                    <i className="fas fa-user-check"></i>
                                </div>
                                <div className="card-content">
                                    <h3>{employeeStats.active}</h3>
                                    <p>Aktif Personel</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="summary-card inactive">
                                <div className="card-icon">
                                    <i className="fas fa-user-slash"></i>
                                </div>
                                <div className="card-content">
                                    <h3>{employeeStats.inactive}</h3>
                                    <p>Pasif Personel</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="summary-card departments">
                                <div className="card-icon">
                                    <i className="fas fa-sitemap"></i>
                                </div>
                                <div className="card-content">
                                    <h3>{employeeStats.departments}</h3>
                                    <p>Departman Sayısı</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Personel Listesi */}
                <div className="employee-list-container">
                    <div className="list-header">
                        <h3>Personel Listesi</h3>
                        <div className="list-header-actions">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Personel ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <i className="fas fa-search search-icon"></i>
                            </div>
                            <button 
                                className="add-employee-btn-small"
                                onClick={() => {
                                    setSelectedEmployee(null);
                                    setShowEmployeeModal(true);
                                }}
                                title="Yeni Personel Ekle"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    {/* Filtreleme ve Sıralama */}
                    <div className="filters-sorting mb-4">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                                <label className="form-label">Departman</label>
                                <select 
                                    className="form-select"
                                    value={filterDepartment}
                                    onChange={(e) => {
                                        setFilterDepartment(e.target.value);
                                        setCurrentPage(1); // Filtreleme değiştiğinde sayfa 1'e dön
                                    }}
                                >
                                    <option value="">Tüm Departmanlar</option>
                                    {departmentList.map(department => (
                                        <option key={department} value={department}>{department}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                                <label className="form-label">Durum</label>
                                <select 
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1); // Filtreleme değiştiğinde sayfa 1'e dön
                                    }}
                                >
                                    <option value="">Tüm Durumlar</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                            
                            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                                <label className="form-label">Sırala</label>
                                <select 
                                    className="form-select"
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <option value="name">İsim</option>
                                    <option value="department">Departman</option>
                                    <option value="position">Pozisyon</option>
                                    <option value="hireDate">İşe Giriş Tarihi</option>
                                </select>
                            </div>
                            
                            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                                <label className="form-label">Sıralama Yönü</label>
                                <div className="btn-group w-100">
                                    <button 
                                        type="button" 
                                        className={`btn ${sortDirection === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSortDirection('asc')}
                                    >
                                        <i className="fas fa-sort-amount-down-alt me-1"></i> Artan
                                    </button>
                                    <button 
                                        type="button"
                                        className={`btn ${sortDirection === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSortDirection('desc')}
                                    >
                                        <i className="fas fa-sort-amount-down me-1"></i> Azalan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Personel</th>
                                    <th>Departman</th>
                                    <th>Pozisyon</th>
                                    <th>Telefon</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center">
                                                <div className="spinner-border text-primary mb-3" role="status">
                                                    <span className="visually-hidden">Yükleniyor...</span>
                                                </div>
                                                <h5 className="text-muted">Veriler yükleniyor...</h5>
                                                <p className="text-muted">Lütfen bekleyin</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginationInfo.currentItems.length > 0 ? (
                                    paginationInfo.currentItems.map(employee => (
                                        <EmployeeRow 
                                            key={employee.id}
                                            employee={employee}
                                            onEdit={handleEditEmployeeCallback}
                                            onDelete={handleDeleteEmployeeCallback}
                                            onToggleStatus={handleToggleEmployeeStatusCallback}
                                            onDocumentClick={handleDocumentClickCallback}
                                            onAssetClick={handleAssetClickCallback}
                                            onBonusClick={handleBonusClickCallback}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center">
                                                <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                                                <h5 className="text-muted">Arama kriterine uygun personel bulunamadı</h5>
                                                <p className="text-muted">Farklı bir arama terimi deneyin veya yeni personel ekleyin</p>
                                                <button 
                                                    className="btn btn-primary mt-2"
                                                    onClick={() => {
                                                        setSelectedEmployee(null);
                                                        setShowEmployeeModal(true);
                                                    }}
                                                >
                                                    <i className="fas fa-plus me-2"></i> Yeni Personel Ekle
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Personel Sayısı Bilgisi */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                            <small>
                                Toplam <strong>{filteredEmployees.length}</strong> personel | 
                                Aktif: <strong>{filteredEmployees.filter(e => e.isActive).length}</strong> | 
                                Pasif: <strong>{filteredEmployees.filter(e => !e.isActive).length}</strong>
                            </small>
                        </div>
                        <div>
                            <button className="btn btn-sm btn-outline-primary me-2" title="Personel Listesini Yazdır">
                                <i className="fas fa-print me-1"></i> Yazdır
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Excel Olarak İndir">
                                <i className="fas fa-file-excel me-1"></i> Excel
                            </button>
                        </div>
                    </div>
                    
                    {/* Sayfalama */}
                    <div className="pagination-container mt-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="items-per-page d-flex align-items-center">
                                <span className="me-2">Sayfa başına:</span>
                                <select 
                                    className="form-select form-select-sm"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(parseInt(e.target.value));
                                        setCurrentPage(1); // Sayfa başına öğe sayısı değiştiğinde ilk sayfaya dön
                                    }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            
                            <nav aria-label="Personel listesi sayfaları">
                                <ul className="pagination pagination-sm">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="fas fa-angle-double-left"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="fas fa-angle-left"></i>
                                        </button>
                                    </li>
                                    
                                    {/* Sayfa numaralarını oluştur */}
                                    {[...Array(paginationInfo.totalPages)].map((_, index) => {
                                        // Aktif sayfanın 2 sayfa öncesi ve sonrasını göster
                                        if (
                                            index + 1 === 1 || // İlk sayfa
                                            index + 1 === paginationInfo.totalPages || // Son sayfa
                                            (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2) // Aktif sayfanın etrafı
                                        ) {
                                            return (
                                                <li 
                                                    key={index}
                                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                >
                                                    <button 
                                                        className="page-link"
                                                        onClick={() => paginate(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            );
                                        }
                                        
                                        // Sayfa arasında boşluk varsa "..." göster
                                        if (
                                            (index + 1 === currentPage - 3 && currentPage > 4) ||
                                            (index + 1 === currentPage + 3 && currentPage < paginationInfo.totalPages - 3)
                                        ) {
                                            return (
                                                <li key={index} className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            );
                                        }
                                        
                                        return null;
                                    })}
                                    
                                    <li className={`page-item ${currentPage === paginationInfo.totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === paginationInfo.totalPages}
                                        >
                                            <i className="fas fa-angle-right"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${currentPage === paginationInfo.totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => paginate(paginationInfo.totalPages)}
                                            disabled={currentPage === paginationInfo.totalPages}
                                        >
                                            <i className="fas fa-angle-double-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            
                            <div className="page-info">
                                <small className="text-muted">
                                    {paginationInfo.indexOfFirstItem + 1}-{Math.min(paginationInfo.indexOfLastItem, filteredEmployees.length)} / {filteredEmployees.length} personel
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showEmployeeModal && (
                <div className="modal show employee-modal" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee 
                                        ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} - Düzenle` 
                                        : 'Yeni Personel Ekle'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowEmployeeModal(false);
                                        setSelectedEmployee(null);
                                        // Formu temizle
                                        setEmployeeForm({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            birthDate: '',
                                            hireDate: '',
                                            phoneNumber: '',
                                            department: '',
                                            position: '',
                                            salary: '',
                                            identityNumber: '',
                                            gender: '',
                                            address: '',
                                            emergencyContact: '',
                                            emergencyPhone: '',
                                        });
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEmployeeSubmit}>
                                    <div className="row">
                                        {/* Kişisel Bilgiler */}
                                        <div className="col-md-6">
                                            <h6 className="mb-3">Kişisel Bilgiler</h6>
                                            <div className="form-group mb-3">
                                                <label>Ad*</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                                                    value={employeeForm.firstName}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        firstName: e.target.value
                                                    })}
                                                    required
                                                />
                                                {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>Soyad*</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                                    value={employeeForm.lastName}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        lastName: e.target.value
                                                    })}
                                                    required
                                                />
                                                {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>TC Kimlik No*</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.identityNumber ? 'is-invalid' : ''}`}
                                                    value={employeeForm.identityNumber}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        identityNumber: e.target.value
                                                    })}
                                                    required
                                                    maxLength={11}
                                                />
                                                {formErrors.identityNumber && <div className="invalid-feedback">{formErrors.identityNumber}</div>}
                                            </div>
                                        </div>

                                        {/* İletişim Bilgileri */}
                                        <div className="col-md-6">
                                            <h6 className="mb-3">İletişim Bilgileri</h6>
                                            <div className="form-group mb-3">
                                                <label>Email*</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                    value={employeeForm.email}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        email: e.target.value
                                                    })}
                                                    required
                                                />
                                                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>Telefon*</label>
                                                <input
                                                    type="tel"
                                                    className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                                                    value={employeeForm.phoneNumber}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        phoneNumber: e.target.value
                                                    })}
                                                    required
                                                    placeholder="555-1234567"
                                                />
                                                {formErrors.phoneNumber && <div className="invalid-feedback">{formErrors.phoneNumber}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        {/* İş Bilgileri */}
                                        <div className="col-md-6">
                                            <h6 className="mb-3">İş Bilgileri</h6>
                                            <div className="form-group mb-3">
                                                <label>Departman*</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.department}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        department: e.target.value
                                                    })}
                                                    required
                                                >
                                                    <option value="">Seçiniz</option>
                                                    <option value="IT">Bilgi Teknolojileri</option>
                                                    <option value="HR">İnsan Kaynakları</option>
                                                    <option value="FINANCE">Finans</option>
                                                    <option value="SALES">Satış</option>
                                                </select>
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>Pozisyon*</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={employeeForm.position}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        position: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="mb-3">Tarih Bilgileri</h6>
                                            <div className="form-group mb-3">
                                                <label>Doğum Tarihi*</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={employeeForm.birthDate}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        birthDate: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group mb-3">
                                                <label>İşe Başlama Tarihi*</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={employeeForm.hireDate}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        hireDate: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <small className="text-muted me-auto">* Zorunlu alanlar</small>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowEmployeeModal(false)}
                                        >
                                            İptal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            {selectedEmployee ? 'Güncelle' : 'Kaydet'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDocumentModal && selectedEmployee && (
                <div className="modal show document-modal" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName} - Belgeler
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDocumentModal(false);
                                        setSelectedEmployee(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                {/* Mevcut Belgeler Tablosu */}
                                <h6 className="section-title">Mevcut Belgeler</h6>
                                <div className="table-responsive mb-4">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Belge Adı</th>
                                                <th>Tür</th>
                                                <th>Yükleme Tarihi</th>
                                                <th>İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents
                                                .filter(doc => doc.employeeId === selectedEmployee.id)
                                                .map(doc => (
                                                    <tr key={doc.id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className={`fas fa-file-${doc.type} me-2`}></i>
                                                                {doc.name}
                                                            </div>
                                                        </td>
                                                        <td>{doc.type}</td>
                                                        <td>{new Date(doc.uploadDate).toLocaleDateString('tr-TR')}</td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <button 
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleDownloadDocument(doc.id)}
                                                                >
                                                                    <i className="fas fa-download"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-info"
                                                                    onClick={() => handlePreviewDocument(doc.id)}
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setShowDocumentModal(false)}
                                    >
                                        Kapat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLeaveModal && selectedEmployee && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName} - İzin Talepleri
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowLeaveModal(false);
                                        setSelectedEmployee(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                        {/* İzin talepleri listesi */}
                                <h6 className="section-title">Mevcut İzin Talepleri</h6>
                                <div className="table-responsive mb-4">
                                    <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Başlangıç</th>
                                        <th>Bitiş</th>
                                        <th>Tür</th>
                                        <th>Durum</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveRequests
                                        .filter(request => request.employeeId === selectedEmployee.id)
                                        .map(request => (
                                            <tr key={request.id}>
                                                <td>{new Date(request.startDate).toLocaleDateString('tr-TR')}</td>
                                                <td>{new Date(request.endDate).toLocaleDateString('tr-TR')}</td>
                                                <td>{request.type}</td>
                                                <td>
                                                            <span className={`badge ${
                                                                request.status === 'approved' ? 'bg-success' : 
                                                                request.status === 'rejected' ? 'bg-danger' : 
                                                                'bg-warning'
                                                    }`}>
                                                        {request.status === 'approved' ? 'Onaylandı' : 
                                                         request.status === 'rejected' ? 'Reddedildi' : 
                                                         'Beklemede'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {request.status === 'pending' && (
                                                        <div className="btn-group">
                                                            <button 
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => handleLeaveRequestStatus(request.id, 'approved')}
                                                            >
                                                                Onayla
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleLeaveRequestStatus(request.id, 'rejected')}
                                                            >
                                                                Reddet
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                                <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowLeaveModal(false)}
                            >
                                Kapat
                            </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAssetModal && selectedEmployee && (
                <div className="modal show asset-modal" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName} - Zimmet Ekle
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAssetModal(false);
                                        setSelectedEmployee(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddAsset}>
                                    {/* Temel Bilgiler */}
                                    <h6 className="section-title">Temel Bilgiler</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label>Zimmet Türü*</label>
                                                <select
                                                    className="form-control"
                                                    value={assetForm.name}
                                                    onChange={(e) => setAssetForm({
                                                        ...assetForm,
                                                        name: e.target.value
                                                    })}
                                                    required
                                                >
                                                    <option value="">Seçiniz</option>
                                                    <option value="LAPTOP">Dizüstü Bilgisayar</option>
                                                    <option value="DESKTOP">Masaüstü Bilgisayar</option>
                                                    <option value="PHONE">Telefon</option>
                                                    <option value="TABLET">Tablet</option>
                                                    <option value="MONITOR">Monitör</option>
                                                    <option value="PRINTER">Yazıcı</option>
                                                    <option value="OTHER">Diğer</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label>Seri Numarası*</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={assetForm.serialNumber}
                                                    onChange={(e) => setAssetForm({
                                                        ...assetForm,
                                                        serialNumber: e.target.value
                                                    })}
                                                    required
                                                    placeholder="Örn: SN123456789"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <small className="text-muted me-auto">* Zorunlu alanlar</small>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowAssetModal(false)}
                                        >
                                            İptal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showBonusModal && selectedEmployee && (
                <div className="modal show bonus-modal" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName} - Prim Ekle
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setShowBonusModal(false);
                                        setSelectedEmployee(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddBonus}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label>Prim Tipi*</label>
                                                <select
                                                    className="form-control"
                                                    value={bonusForm.type}
                                                    onChange={(e) => setBonusForm({
                                                        ...bonusForm,
                                                        type: e.target.value
                                                    })}
                                                    required
                                                >
                                                    <option value="PERFORMANCE">Performans Primi</option>
                                                    <option value="QUARTERLY">Üç Aylık Prim</option>
                                                    <option value="ANNUAL">Yıllık Prim</option>
                                                    <option value="PROJECT">Proje Primi</option>
                                                    <option value="SALES">Satış Primi</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label>Prim Tutarı*</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={bonusForm.amount}
                                                    onChange={(e) => setBonusForm({
                                                        ...bonusForm,
                                                        amount: e.target.value
                                                    })}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <small className="text-muted me-auto">* Zorunlu alanlar</small>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowBonusModal(false)}
                                        >
                                            İptal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                        >
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PersonalManagementPage

