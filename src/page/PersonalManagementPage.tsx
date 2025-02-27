import React, { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import './personalmanagement.css'
import swal from 'sweetalert'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Bar, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js'
import { Sidebar } from '../components/Sidebar'
import { API_ENDPOINTS } from '../config/api'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
)

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
    maritalStatus?: string;
    bloodType?: string;
    nationality?: string;
    educationLevel?: string;
    roleId?: number;
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

interface Department {
    name: string;
    icon: string;
    employees: number;
    openPositions: number;
    avgTenure: number;
    color: string;
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
    // Status badge rengini belirle
    const getBadgeClass = (isActive: boolean) => {
        return isActive ? 'bg-success' : 'bg-danger';
    };

    // Cinsiyet ikonunu belirle
    const getGenderIcon = (gender: string) => {
        switch (gender) {
            case 'MALE':
                return <i className="fas fa-male me-1 text-primary"></i>;
            case 'FEMALE':
                return <i className="fas fa-female me-1 text-danger"></i>;
            default:
                return <i className="fas fa-user me-1 text-secondary"></i>;
        }
    };

    // Kan grubu gösterimi
    const getBloodTypeDisplay = (bloodType?: string) => {
        if (!bloodType) return null;
        return (
            <span className="badge bg-danger" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                <i className="fas fa-tint me-1"></i> {bloodType.replace('_', ' ')}
            </span>
        );
    };

    // Eğitim durumu gösterimi
    const getEducationLevelDisplay = (educationLevel?: string) => {
        if (!educationLevel) return null;
        
        const icons: { [key: string]: string } = {
            'PRIMARY': 'fas fa-child',
            'SECONDARY': 'fas fa-book',
            'HIGH_SCHOOL': 'fas fa-graduation-cap',
            'ASSOCIATE': 'fas fa-certificate',
            'BACHELOR': 'fas fa-university',
            'MASTER': 'fas fa-user-graduate',
            'DOCTORATE': 'fas fa-microscope',
            'OTHER': 'fas fa-user-alt'
        };
        
        return (
            <span title={educationLevel} style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                <i className={icons[educationLevel] || 'fas fa-user-graduate'}></i>
            </span>
        );
    };

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
                        <div className="fw-bold d-flex align-items-center">
                            {getGenderIcon(employee.gender)}
                            {employee.firstName} {employee.lastName}
                            {getEducationLevelDisplay(employee.educationLevel)}
                        </div>
                        <small className="text-muted d-flex align-items-center">
                            <i className="fas fa-envelope me-1"></i> {employee.email}
                            {employee.bloodType && (
                                <span className="ms-2">{getBloodTypeDisplay(employee.bloodType)}</span>
                            )}
                        </small>
                    </div>
                </div>
            </td>
            <td>
                <div>
                    <span className="fw-medium">{employee.department}</span>
                    <div className="small text-muted">{employee.position}</div>
                </div>
            </td>
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
                    className={`badge ${getBadgeClass(employee.isActive)}`}
                    onClick={() => onToggleStatus(employee.id, employee.isActive)}
                    style={{ cursor: 'pointer' }}
                    title={employee.isActive ? 'Aktif (Pasif yapmak için tıklayın)' : 'Pasif (Aktif yapmak için tıklayın)'}
                >
                    {employee.isActive ? 'Aktif' : 'Pasif'}
                </span>
                <div className="mt-1 small">
                    <i className="fas fa-calendar-alt me-1"></i> {new Date(employee.hireDate).toLocaleDateString('tr-TR')}
                </div>
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
                            style={{
                                background: 'linear-gradient(145deg, #6366f1, #4f46e5)',
                                border: 'none',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                            }}
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
        id: null as number | null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        status: 'ACTIVE', // Default status
        roleId: null as number | null,
        gender: '',
        phoneNumber: '',
        birthDate: '',
        maritalStatus: '',
        bloodType: '',
        identificationNumber: '',
        nationality: '',
        educationLevel: '',
        hireDate: '', // Not directly from User entity but needed for Employee
        department: '', // Not directly from User entity but needed for display
        position: '', // Not directly from User entity but needed for display
        salary: '', // Not directly from User entity but needed for display
        address: '', // Not directly from User entity but needed for display
        emergencyContact: '', // Not directly from User entity but needed for display
        emergencyPhone: '', // Not directly from User entity but needed for display
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

    // Filtreleme için state'ler
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterEducationLevel, setFilterEducationLevel] = useState('');
    const [filterBloodType, setFilterBloodType] = useState('');
    const [filterMaritalStatus, setFilterMaritalStatus] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterMinSalary, setFilterMinSalary] = useState('');
    const [filterMaxSalary, setFilterMaxSalary] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    
    // Sıralama için state'ler
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Sayfalama için state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Sidebar için state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Form için error state'i ekleyelim
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Sidebar toggle fonksiyonu
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    useEffect(() => {
        // API'den personel verilerini çek
        fetchData();
    }, []);

    // Tüm verileri eşzamanlı yükleme
    const fetchData = async () => {
      setLoading(true);
      try {
        // Promise.allSettled kullanarak tüm isteklerin sonucunu bekleyin
        const results = await Promise.allSettled([
          fetchEmployees(),
          fetchDocuments(),
          fetchLeaveRequests(),
          fetchAssets(),
          fetchBonuses()
        ]);
        
        // Başarısız olan istekleri kontrol edin
        const failedRequests = results.filter(result => result.status === 'rejected');
        if (failedRequests.length > 0) {
          console.error("Bazı veriler yüklenemedi:", failedRequests);
          swal("Uyarı", "Bazı veriler yüklenemedi. Sayfayı yenileyip tekrar deneyebilirsiniz.", "warning");
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        swal("Hata", "Veriler yüklenirken bir hata oluştu.", "error");
      } finally {
        setLoading(false);
      }
    };

    // API'den gelen veriyi frontend formatına dönüştürme
    const mapApiEmployeeToFrontend = (apiEmployee: any): Employee => {
      return {
        id: apiEmployee.id,
        firstName: apiEmployee.firstName || '',
        lastName: apiEmployee.lastName || '',
        photoUrl: apiEmployee.photoUrl,
        birthDate: apiEmployee.birthDate || '',
        hireDate: apiEmployee.hireDate || '',
        isActive: apiEmployee.status === 'ACTIVE',
        email: apiEmployee.email || '',
        phoneNumber: apiEmployee.phoneNumber || '',
        department: apiEmployee.department || '',
        position: apiEmployee.position || '',
        salary: apiEmployee.salary?.toString() || '',
        identityNumber: apiEmployee.identificationNumber || '',
        gender: apiEmployee.gender || '',
        address: apiEmployee.address || '',
        emergencyContact: apiEmployee.emergencyContact || '',
        emergencyPhone: apiEmployee.emergencyPhone || '',
        maritalStatus: apiEmployee.maritalStatus || '',
        bloodType: apiEmployee.bloodType || '',
        nationality: apiEmployee.nationality || '',
        educationLevel: apiEmployee.educationLevel || '',
        roleId: apiEmployee.roleId
      };
    };

    // Kimlik doğrulama token'ını alma
    const getAuthToken = () => {
      return localStorage.getItem('authToken'); // veya başka bir yerden token alma yöntemi
    };

    // İstek yapma fonksiyonu - hata düzeltmesi
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers as Record<string, string>)
      };
      
      return fetch(url, {
        ...options,
        headers
      });
    };

    // fetchEmployees içinde kullanımı
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(API_ENDPOINTS.EMPLOYEES);
        
        if (!response.ok) {
          // 401 veya 403 hatası durumunda yetkilendirme sorunları olabilir
          if (response.status === 401 || response.status === 403) {
            // Oturumu sonlandırma veya login sayfasına yönlendirme
            handleAuthError();
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const mappedEmployees = (data.content || data).map(mapApiEmployeeToFrontend);
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Personel verileri alınamadı:", error);
        swal("Hata", "Personel verileri yüklenirken bir sorun oluştu.", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchDocuments = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.DOCUMENTS);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setDocuments(data.content || data);
        } catch (error) {
            console.error("Belgeler alınamadı:", error);
            swal("Hata", "Belgeler yüklenirken bir sorun oluştu.", "error");
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.LEAVE_REQUESTS);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setLeaveRequests(data.content || data);
        } catch (error) {
            console.error("İzin talepleri alınamadı:", error);
            swal("Hata", "İzin talepleri yüklenirken bir sorun oluştu.", "error");
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.ASSETS);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setAssets(data.content || data);
        } catch (error) {
            console.error("Zimmet verileri alınamadı:", error);
            swal("Hata", "Zimmet verileri yüklenirken bir sorun oluştu.", "error");
        }
    };

    const fetchBonuses = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.BONUSES);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setBonuses(data.content || data);
        } catch (error) {
            console.error("Prim verileri alınamadı:", error);
            swal("Hata", "Prim verileri yüklenirken bir sorun oluştu.", "error");
        }
    };

    // Yetkilendirme hatası durumunda
    const handleAuthError = () => {
      localStorage.removeItem('authToken');
      swal("Oturum Süresi Doldu", "Lütfen tekrar giriş yapın.", "warning")
        .then(() => {
          window.location.href = '/login'; // Login sayfasına yönlendir
        });
    };

    // Form doğrulama işlevi
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        // TC Kimlik No doğrulama
        if (!/^[0-9]{11}$/.test(employeeForm.identificationNumber)) {
            errors.identificationNumber = "TC Kimlik No 11 haneli ve sadece rakam olmalıdır";
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
            // User entity oluştur
            const userData = {
                id: employeeForm.id,
                firstName: employeeForm.firstName,
                lastName: employeeForm.lastName,
                email: employeeForm.email,
                password: employeeForm.password,
                status: employeeForm.status,
                roleId: employeeForm.roleId,
                gender: employeeForm.gender,
                phoneNumber: employeeForm.phoneNumber,
                birthDate: employeeForm.birthDate ? new Date(employeeForm.birthDate) : null,
                maritalStatus: employeeForm.maritalStatus,
                bloodType: employeeForm.bloodType,
                identificationNumber: employeeForm.identificationNumber,
                nationality: employeeForm.nationality,
                educationLevel: employeeForm.educationLevel,
                createdAt: null, // Backend'de otomatik oluşturulacak
                updatedAt: null, // Backend'de otomatik güncellenecek
                authId: null, // Backend'de otomatik oluşturulacak
            };

            // Employee entity için ayrı veri hazırla
            const employeeData = {
                userId: employeeForm.id, // Mevcut kullanıcı ID'si veya null (yeni kayıt için)
                companyId: 1, // Default şirket ID'si
                position: employeeForm.position,
                hireDate: employeeForm.hireDate ? new Date(employeeForm.hireDate) : null,
                status: employeeForm.status,
                salary: employeeForm.salary,
                department: employeeForm.department,
                address: employeeForm.address,
                emergencyContact: employeeForm.emergencyContact,
                emergencyPhone: employeeForm.emergencyPhone,
            };

            // API'ye gönderilecek ana veri
            const requestData = {
                user: userData,
                employee: employeeData
            };

            const response = await fetch('http://localhost:9090/v1/dev/employee/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.code === 200) {
                    swal("Başarılı", "Personel başarıyla kaydedildi", "success");
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
                        id: null,
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        status: 'ACTIVE',
                        roleId: null,
                        gender: '',
                        phoneNumber: '',
                        birthDate: '',
                        maritalStatus: '',
                        bloodType: '',
                        identificationNumber: '',
                        nationality: '',
                        educationLevel: '',
                        hireDate: '',
                        department: '',
                        position: '',
                        salary: '',
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
            
            const response = await fetch(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !isActive })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

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
            console.error("Personel durumu güncellenirken bir hata oluştu:", error);
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
            id: employee.id,
            firstName: employee.firstName || '',
            lastName: employee.lastName || '',
            email: employee.email || '',
            password: '', // Güvenlik nedeniyle boş bırak, değiştirilmek istenirse kullanıcı dolduracak
            status: employee.isActive ? 'ACTIVE' : 'INACTIVE',
            roleId: null, // API'den alınacak değer
            gender: employee.gender || '',
            phoneNumber: employee.phoneNumber || '',
            birthDate: employee.birthDate ? employee.birthDate.split('T')[0] : '',
            maritalStatus: employee.maritalStatus || '',
            bloodType: employee.bloodType || '',
            identificationNumber: employee.identityNumber || '',
            nationality: employee.nationality || 'TR',
            educationLevel: employee.educationLevel || '',
            hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
            department: employee.department || '',
            position: employee.position || '',
            salary: employee.salary || '',
            address: employee.address || '',
            emergencyContact: employee.emergencyContact || '',
            emergencyPhone: employee.emergencyPhone || '',
        });
        
        // Mevcut personel için ek bilgileri API'den almak için
        fetchUserDetails(employee.id);
        
        setShowEmployeeModal(true);
    };
    
    // Personel detaylarını API'den getirme fonksiyonu
    const fetchUserDetails = async (userId: number) => {
        try {
            // Gerçek bir API çağrısı olacak
            const response = await fetch(`http://localhost:9090/v1/dev/user/${userId}`);
            
            if (response.ok) {
                const userData = await response.json();
                
                // API'den gelen verileri form state'ine aktar
                setEmployeeForm(prevState => ({
                    ...prevState,
                    // User entity'den gelen veriler
                    maritalStatus: userData.maritalStatus || '',
                    bloodType: userData.bloodType || '',
                    educationLevel: userData.educationLevel || '',
                    nationality: userData.nationality || 'TR',
                    roleId: userData.roleId || null,
                }));
            }
        } catch (error) {
            console.error("Kullanıcı detayları alınamadı:", error);
            // Hata durumunda kullanıcıyı bilgilendir
            swal("Uyarı", "Bazı kullanıcı detayları yüklenemedi, lütfen formu kontrol ediniz.", "warning");
        }
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
                // Gerçek API çağrısı 
                const response = await fetch(`${API_ENDPOINTS.EMPLOYEES}/${employeeId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Başarılı silme işlemi sonrası
                setEmployees(employees.filter(emp => emp.id !== employeeId));

                swal({
                    title: "Başarılı!",
                    text: `${employeeToDelete.firstName} ${employeeToDelete.lastName} başarıyla silindi.`,
                    icon: "success",
                });
            }
        } catch (error) {
            console.error("Personel silinirken bir hata oluştu:", error);
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
            .filter(employee => {
                // Arama filtresi
                const searchFilter = 
                    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.position.toLowerCase().includes(searchTerm.toLowerCase());

                // Departman filtresi
                const departmentFilter = filterDepartment === '' || employee.department === filterDepartment;
                
                // Durum filtresi
                const statusFilter = filterStatus === '' ||
                    (filterStatus === 'active' && employee.isActive) ||
                    (filterStatus === 'inactive' && !employee.isActive);
                
                // Cinsiyet filtresi
                const genderFilter = filterGender === '' || employee.gender === filterGender;
                
                // Eğitim seviyesi filtresi
                const educationFilter = filterEducationLevel === '' || employee.educationLevel === filterEducationLevel;
                
                // Kan grubu filtresi
                const bloodTypeFilter = filterBloodType === '' || employee.bloodType === filterBloodType;
                
                // Medeni durum filtresi
                const maritalStatusFilter = filterMaritalStatus === '' || employee.maritalStatus === filterMaritalStatus;
                
                // İşe giriş tarihi aralığı filtresi
                const hireStartDateFilter = filterStartDate === '' || new Date(employee.hireDate) >= new Date(filterStartDate);
                const hireEndDateFilter = filterEndDate === '' || new Date(employee.hireDate) <= new Date(filterEndDate);
                
                // Maaş aralığı filtresi
                const minSalaryFilter = filterMinSalary === '' || (employee.salary && parseFloat(employee.salary) >= parseFloat(filterMinSalary));
                const maxSalaryFilter = filterMaxSalary === '' || (employee.salary && parseFloat(employee.salary) <= parseFloat(filterMaxSalary));
                
                // Tüm filtreleri birleştir
                return searchFilter && departmentFilter && statusFilter && 
                    genderFilter && educationFilter && bloodTypeFilter && maritalStatusFilter &&
                    hireStartDateFilter && hireEndDateFilter && minSalaryFilter && maxSalaryFilter;
            })
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
                } else if (sortField === 'salary') {
                    const salaryA = parseFloat(a.salary || '0');
                    const salaryB = parseFloat(b.salary || '0');
                    return sortDirection === 'asc' ? salaryA - salaryB : salaryB - salaryA;
                }
                return 0;
            });
    }, [employees, searchTerm, filterDepartment, filterStatus, filterGender, 
        filterEducationLevel, filterBloodType, filterMaritalStatus, 
        filterStartDate, filterEndDate, filterMinSalary, filterMaxSalary, 
        sortField, sortDirection]);

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

    const departmentIcons: { [key: string]: string } = {
        'IT': 'fas fa-laptop-code',
        'HR': 'fas fa-users',
        'FINANCE': 'fas fa-chart-line',
        'SALES': 'fas fa-handshake',
        'MARKETING': 'fas fa-bullhorn',
        'OPERATIONS': 'fas fa-cogs',
        'default': 'fas fa-building'
    };

    const departmentStats = useMemo(() => {
        if (!employees || employees.length === 0) return [];

        const stats = employees.reduce((acc: { [key: string]: { current: number, previous: number } }, emp) => {
            if (emp.department) {
                if (!acc[emp.department]) {
                    acc[emp.department] = { current: 0, previous: 0 };
                }
                acc[emp.department].current += 1;
                // Simüle edilmiş önceki ay verisi
                acc[emp.department].previous = Math.floor(acc[emp.department].current * 0.9);
            }
            return acc;
        }, {});

        return Object.entries(stats).map(([name, data]) => {
            const growth = ((data.current - data.previous) / data.previous) * 100;
            return {
                name,
                count: data.current,
                previousCount: data.previous,
                growth: growth.toFixed(1),
                icon: departmentIcons[name] || departmentIcons.default
            };
        });
    }, [employees]);

    useEffect(() => {
        console.log('Employees:', employees); // Debug için
        console.log('Department Stats:', departmentStats); // Debug için
    }, [employees, departmentStats]);

    // Sayfalama kontrolü
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Departman dağılımı için veri
    const departmentData = {
        labels: ['Yazılım', 'Enerji', 'Otomotiv', 'Eğitim', 'Sağlık'],
        datasets: [
            {
                label: 'Çalışan Sayısı',
                data: [45, 30, 35, 15, 20],
                backgroundColor: 'rgba(75, 85, 255, 0.7)',
                borderColor: 'rgba(75, 85, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // İşe alım ve ayrılma trendi için veri
    const trendData = {
        labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
        datasets: [
            {
                label: 'İşe Alım',
                data: [8, 12, 15, 10, 14, 18],
                borderColor: 'rgba(75, 85, 255, 1)',
                backgroundColor: 'rgba(75, 85, 255, 0.2)',
                tension: 0.4,
            },
            {
                label: 'İşten Ayrılma',
                data: [3, 4, 6, 5, 4, 7],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Departman Dağılımı',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'İşe Alım ve Ayrılma Trendi',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const departments: Department[] = [
        {
            name: 'Yazılım',
            icon: 'fa-code',
            employees: 25,
            openPositions: 3,
            avgTenure: 2.5,
            color: '#4e54c8'
        },
        {
            name: 'İnsan Kaynakları',
            icon: 'fa-users',
            employees: 12,
            openPositions: 1,
            avgTenure: 3.2,
            color: '#11998e'
        },
        {
            name: 'Finans',
            icon: 'fa-money-bill-wave',
            employees: 15,
            openPositions: 2,
            avgTenure: 4.1,
            color: '#f2994a'
        },
        {
            name: 'Satış',
            icon: 'fa-chart-line',
            employees: 30,
            openPositions: 4,
            avgTenure: 2.8,
            color: '#ee0979'
        }
    ];

    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);

    // Define enum option lists for dropdown selects
    const genderOptions = ['MALE', 'FEMALE', 'OTHER'];
    const maritalStatusOptions = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
    const bloodTypeOptions = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 
                             'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
    const educationLevelOptions = ['PRIMARY', 'SECONDARY', 'HIGH_SCHOOL', 'ASSOCIATE', 
                                  'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'];
    const statusOptions = ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'];

    return (
        <div className="personal-management-container">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                {/* İstatistik Kartları */}
                <div className="dashboard-stats">
                    <div className="stats-header">
                        <h2>Personel İstatistikleri</h2>
                        <p>Güncel departman ve personel verileri</p>
                    </div>

                    {/* Özet Kartları */}
                    <div className="stats-summary">
                        <div className="stat-card total">
                            <div className="stat-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{employeeStats.total}</h3>
                                <p>Toplam Personel</p>
                            </div>
                            <div className="stat-trend">
                                <span className="trend-up">
                                    <i className="fas fa-arrow-up"></i> 12%
                                </span>
                            </div>
                        </div>

                        <div className="stat-card active">
                            <div className="stat-icon">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{employeeStats.active}</h3>
                                <p>Aktif Personel</p>
                            </div>
                            <div className="stat-trend">
                                <span className="trend-up">
                                    <i className="fas fa-arrow-up"></i> 8%
                                </span>
                            </div>
                        </div>

                        <div className="stat-card departments">
                            <div className="stat-icon">
                                <i className="fas fa-sitemap"></i>
                            </div>
                            <div className="stat-info">
                                <h3>{employeeStats.departments}</h3>
                                <p>Departman</p>
                            </div>
                            <div className="stat-trend">
                                <span className="trend-stable">
                                    <i className="fas fa-equals"></i>
                                </span>
                            </div>
                        </div>

                        <div className="stat-card turnover">
                            <div className="stat-icon">
                                <i className="fas fa-exchange-alt"></i>
                            </div>
                            <div className="stat-info">
                                <h3>4.2%</h3>
                                <p>Personel Devir Hızı</p>
                            </div>
                            <div className="stat-trend">
                                <span className="trend-down">
                                    <i className="fas fa-arrow-down"></i> 2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Grafikler */}
                    <div className="charts-container">
                        <div className="chart-row">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Departman Dağılımı</h3>
                                    <div className="chart-actions">
                                        <button className="chart-action-btn">
                                            <i className="fas fa-download"></i>
                                        </button>
                                        <button className="chart-action-btn">
                                            <i className="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                                <Bar data={departmentData} options={barOptions} />
                            </div>
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>İşe Alım ve Ayrılma Trendi</h3>
                                    <div className="chart-actions">
                                        <button className="chart-action-btn">
                                            <i className="fas fa-download"></i>
                                        </button>
                                        <button className="chart-action-btn">
                                            <i className="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                                <Line data={trendData} options={lineOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Departman Detayları */}
                    <div className="department-details">
                        <div className="details-header">
                            <h3>Departman Detayları</h3>
                            <div className="details-actions">
                                <select className="details-select">
                                    <option>Son 30 Gün</option>
                                    <option>Son 3 Ay</option>
                                    <option>Son 6 Ay</option>
                                    <option>Son 1 Yıl</option>
                                </select>
                            </div>
                        </div>
                        <div className="details-grid">
                            {departments.map((dept, index) => (
                                <div key={index} className="detail-card">
                                    <div className="detail-header">
                                        <span className="detail-icon">
                                            <i className={`fas ${dept.icon}`}></i>
                                        </span>
                                        <h4>{dept.name}</h4>
                                    </div>
                                    <div className="detail-stats">
                                        <div className="stat">
                                            <span className="stat-value">{dept.employees}</span>
                                            <span className="stat-label">Çalışan</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">{dept.openPositions}</span>
                                            <span className="stat-label">Açık Pozisyon</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">{dept.avgTenure}</span>
                                            <span className="stat-label">Ort. Kıdem (Yıl)</span>
                                        </div>
                                    </div>
                                    <div className="detail-footer">
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${(dept.employees / totalEmployees) * 100}%`,
                                                    backgroundColor: dept.color
                                                }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">
                                            Toplam Çalışanların {((dept.employees / totalEmployees) * 100).toFixed(1)}%'i
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mevcut içerik */}
                <div className="employee-list">
                    <div className="list-header">
                        <h3>Personel Listesi</h3>
                        <div className="list-header-actions">
                            <div className="search-box">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Personel Ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="fas fa-search search-icon"></i>
                            </div>
                            <button
                                className="add-employee-btn"
                                onClick={() => {
                                    setSelectedEmployee(null);
                                    setShowEmployeeModal(true);
                                }}
                            >
                                <i className="fas fa-user-plus"></i> Yeni Personel
                            </button>
                        </div>
                    </div>

                    <div className="filters-sorting">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <label className="form-label">Departman</label>
                                <select
                                    className="form-select"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    {departmentList.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Durum</label>
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Tümü</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Sıralama</label>
                                <select
                                    className="form-select"
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <option value="name">İsim</option>
                                    <option value="department">Departman</option>
                                    <option value="position">Pozisyon</option>
                                    <option value="hireDate">İşe Giriş Tarihi</option>
                                    <option value="salary">Maaş</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Yön</label>
                                <div className="btn-group w-100">
                                    <button
                                        className={`btn ${sortDirection === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSortDirection('asc')}
                                    >
                                        <i className="fas fa-sort-amount-down-alt"></i> Artan
                                    </button>
                                    <button
                                        className={`btn ${sortDirection === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSortDirection('desc')}
                                    >
                                        <i className="fas fa-sort-amount-down"></i> Azalan
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-1">
                                <label className="form-label">&nbsp;</label>
                                <div className="d-flex gap-2">
                                    <button 
                                        className={`btn ${showAdvancedFilters ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center justify-content-center`}
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        style={{ 
                                            borderRadius: '50%',
                                            width: '38px',
                                            height: '38px',
                                            padding: '0'
                                        }}
                                        title={showAdvancedFilters ? 'Gelişmiş Filtreleri Gizle' : 'Gelişmiş Filtreler'}
                                    >
                                        <i className={`fas fa-${showAdvancedFilters ? 'chevron-up' : 'filter'}`} 
                                        style={{ fontSize: '0.9rem' }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {showAdvancedFilters && (
                            <div className="advanced-filters mt-3 p-3 border rounded bg-light"
                                style={{
                                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                                    borderColor: 'rgba(255, 65, 108, 0.1)',
                                    animation: 'fadeIn 0.3s ease-out'
                                }}
                            >
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Cinsiyet</label>
                                        <select
                                            className="form-select"
                                            value={filterGender}
                                            onChange={(e) => setFilterGender(e.target.value)}
                                            style={filterGender ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        >
                                            <option value="">Tümü</option>
                                            {genderOptions.map((gender) => (
                                                <option key={gender} value={gender}>
                                                    {gender === 'MALE' ? 'Erkek' : 
                                                     gender === 'FEMALE' ? 'Kadın' : 
                                                     gender === 'OTHER' ? 'Diğer' : gender}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Eğitim Seviyesi</label>
                                        <select
                                            className="form-select"
                                            value={filterEducationLevel}
                                            onChange={(e) => setFilterEducationLevel(e.target.value)}
                                            style={filterEducationLevel ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        >
                                            <option value="">Tümü</option>
                                            {educationLevelOptions.map((level) => (
                                                <option key={level} value={level}>
                                                    {level === 'PRIMARY' ? 'İlkokul' : 
                                                     level === 'SECONDARY' ? 'Ortaokul' : 
                                                     level === 'HIGH_SCHOOL' ? 'Lise' : 
                                                     level === 'ASSOCIATE' ? 'Önlisans' : 
                                                     level === 'BACHELOR' ? 'Lisans' : 
                                                     level === 'MASTER' ? 'Yüksek Lisans' : 
                                                     level === 'DOCTORATE' ? 'Doktora' : 
                                                     level === 'OTHER' ? 'Diğer' : level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Kan Grubu</label>
                                        <select
                                            className="form-select"
                                            value={filterBloodType}
                                            onChange={(e) => setFilterBloodType(e.target.value)}
                                            style={filterBloodType ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        >
                                            <option value="">Tümü</option>
                                            {bloodTypeOptions.map((type) => (
                                                <option key={type} value={type}>
                                                    {type.replace('_POSITIVE', '(+)').replace('_NEGATIVE', '(-)')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Medeni Durum</label>
                                        <select
                                            className="form-select"
                                            value={filterMaritalStatus}
                                            onChange={(e) => setFilterMaritalStatus(e.target.value)}
                                            style={filterMaritalStatus ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        >
                                            <option value="">Tümü</option>
                                            {maritalStatusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status === 'SINGLE' ? 'Bekar' : 
                                                     status === 'MARRIED' ? 'Evli' : 
                                                     status === 'DIVORCED' ? 'Boşanmış' : 
                                                     status === 'WIDOWED' ? 'Dul' : status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">İşe Giriş (Başlangıç)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={filterStartDate}
                                            onChange={(e) => setFilterStartDate(e.target.value)}
                                            style={filterStartDate ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">İşe Giriş (Bitiş)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={filterEndDate}
                                            onChange={(e) => setFilterEndDate(e.target.value)}
                                            style={filterEndDate ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                            } : undefined}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Minimum Maaş</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Min"
                                                value={filterMinSalary}
                                                onChange={(e) => setFilterMinSalary(e.target.value)}
                                                style={filterMinSalary ? {
                                                    borderColor: 'var(--primary)',
                                                    boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                                } : undefined}
                                            />
                                            <span className="input-group-text">₺</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Maksimum Maaş</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Max"
                                                value={filterMaxSalary}
                                                onChange={(e) => setFilterMaxSalary(e.target.value)}
                                                style={filterMaxSalary ? {
                                                    borderColor: 'var(--primary)',
                                                    boxShadow: '0 0 0 2px rgba(255, 65, 108, 0.1)'
                                                } : undefined}
                                            />
                                            <span className="input-group-text">₺</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Temizleme butonu */}
                                {(filterGender || filterEducationLevel || filterBloodType || filterMaritalStatus || 
                                 filterStartDate || filterEndDate || filterMinSalary || filterMaxSalary) && (
                                    <div className="row mt-3">
                                        <div className="col-12 d-flex justify-content-end">
                                            <button 
                                                className="btn btn-danger d-flex align-items-center justify-content-center"
                                                onClick={() => {
                                                    setFilterGender('');
                                                    setFilterEducationLevel('');
                                                    setFilterBloodType('');
                                                    setFilterMaritalStatus('');
                                                    setFilterStartDate('');
                                                    setFilterEndDate('');
                                                    setFilterMinSalary('');
                                                    setFilterMaxSalary('');
                                                }}
                                                style={{ padding: '0.5rem 1rem' }}
                                            >
                                                <i className="fas fa-trash-alt me-2" style={{ fontSize: '0.9rem' }}></i>
                                                Tüm Filtreleri Temizle
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '250px' }}>Personel Bilgisi</th>
                                    <th style={{ minWidth: '150px' }}>Departman / Pozisyon</th>
                                    <th style={{ minWidth: '200px' }}>İletişim Bilgileri</th>
                                    <th style={{ minWidth: '120px' }}>Durum / İşe Giriş</th>
                                    <th style={{ width: '150px' }}>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginationInfo.currentItems.map((employee) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-container">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="items-per-page">
                                <select
                                    className="form-select"
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                >
                                    <option value="5">5 satır</option>
                                    <option value="10">10 satır</option>
                                    <option value="20">20 satır</option>
                                    <option value="50">50 satır</option>
                                </select>
                            </div>
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => paginate(number)}
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === paginationInfo.totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === paginationInfo.totalPages}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            <div className="page-info">
                                Toplam {filteredEmployees.length} kayıttan {paginationInfo.indexOfFirstItem + 1} - {Math.min(paginationInfo.indexOfLastItem, filteredEmployees.length)} arası gösteriliyor
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Employee Modal */}
            {showEmployeeModal && (
                <div className="modal employee-modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedEmployee ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowEmployeeModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEmployeeSubmit}>
                                    <h6>Temel Bilgiler</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Ad</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Ad"
                                                    value={employeeForm.firstName}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        firstName: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Soyad</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Soyad"
                                                    value={employeeForm.lastName}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        lastName: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>E-posta</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="E-posta"
                                                    value={employeeForm.email}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        email: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Parola</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Parola"
                                                    value={employeeForm.password}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        password: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Durum</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.status}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        status: e.target.value
                                                    })}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status === 'ACTIVE' ? 'Aktif' : 
                                                             status === 'INACTIVE' ? 'Pasif' : 
                                                             status === 'PENDING' ? 'Beklemede' : 
                                                             status === 'BLOCKED' ? 'Engelli' : status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Rol ID</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Rol ID"
                                                    value={employeeForm.roleId || ''}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        roleId: e.target.value ? Number(e.target.value) : null
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <h6>Kişisel Bilgiler</h6>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Cinsiyet</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.gender}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        gender: e.target.value
                                                    })}
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {genderOptions.map((gender) => (
                                                        <option key={gender} value={gender}>
                                                            {gender === 'MALE' ? 'Erkek' : 
                                                             gender === 'FEMALE' ? 'Kadın' : 
                                                             gender === 'OTHER' ? 'Diğer' : gender}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Telefon</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="Telefon"
                                                    value={employeeForm.phoneNumber}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        phoneNumber: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>TC Kimlik No</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="TC Kimlik No"
                                                    value={employeeForm.identificationNumber}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        identificationNumber: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Uyruk</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Uyruk"
                                                    value={employeeForm.nationality}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        nationality: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Doğum Tarihi</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={employeeForm.birthDate}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        birthDate: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Medeni Durum</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.maritalStatus}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        maritalStatus: e.target.value
                                                    })}
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {maritalStatusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status === 'SINGLE' ? 'Bekar' : 
                                                             status === 'MARRIED' ? 'Evli' : 
                                                             status === 'DIVORCED' ? 'Boşanmış' : 
                                                             status === 'WIDOWED' ? 'Dul' : status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Kan Grubu</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.bloodType}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        bloodType: e.target.value
                                                    })}
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {bloodTypeOptions.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type.replace('_POSITIVE', '(+)').replace('_NEGATIVE', '(-)')}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Eğitim Düzeyi</label>
                                                <select
                                                    className="form-control"
                                                    value={employeeForm.educationLevel}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        educationLevel: e.target.value
                                                    })}
                                                >
                                                    <option value="">Seçiniz</option>
                                                    {educationLevelOptions.map((level) => (
                                                        <option key={level} value={level}>
                                                            {level === 'PRIMARY' ? 'İlkokul' : 
                                                             level === 'SECONDARY' ? 'Ortaokul' : 
                                                             level === 'HIGH_SCHOOL' ? 'Lise' : 
                                                             level === 'ASSOCIATE' ? 'Önlisans' : 
                                                             level === 'BACHELOR' ? 'Lisans' : 
                                                             level === 'MASTER' ? 'Yüksek Lisans' : 
                                                             level === 'DOCTORATE' ? 'Doktora' : 
                                                             level === 'OTHER' ? 'Diğer' : level}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <h6>Çalışma Bilgileri</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>İşe Giriş Tarihi</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={employeeForm.hireDate}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        hireDate: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Departman</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Departman"
                                                    value={employeeForm.department}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        department: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Pozisyon</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Pozisyon"
                                                    value={employeeForm.position}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        position: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Maaş</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Maaş"
                                                    value={employeeForm.salary}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        salary: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <h6>İletişim ve Acil Durum</h6>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="form-group">
                                                <label>Adres</label>
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Adres"
                                                    value={employeeForm.address}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        address: e.target.value
                                                    })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Acil Durum Kişisi</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Acil Durum Kişisi"
                                                    value={employeeForm.emergencyContact}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        emergencyContact: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group">
                                                <label>Acil Durum Telefonu</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="Acil Durum Telefonu"
                                                    value={employeeForm.emergencyPhone}
                                                    onChange={(e) => setEmployeeForm({
                                                        ...employeeForm,
                                                        emergencyPhone: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowEmployeeModal(false)}
                                >
                                    İptal
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={handleEmployeeSubmit}
                                >
                                    {selectedEmployee ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PersonalManagementPage

