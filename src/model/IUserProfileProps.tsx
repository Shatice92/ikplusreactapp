export interface IUserProfileProps {
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      gender: UserGender; // Enum olarak tanımlandı
      phoneNumber: string;
      birthDate: string;
      maritalStatus: UserMaritalStatus; // Enum olarak tanımlandı
      bloodType: UserBloodType; // Enum olarak tanımlandı
      identificationNumber: string;
      nationality: string;
      educationLevel: UserEducationLevel; // Enum olarak tanımlandı
      status: UserStatus; // Enum olarak tanımlandı
    };
  }
  
  export enum UserGender {
    FEMALE = "FEMALE",
    MALE = "MALE",
  }
  
  export enum UserMaritalStatus {
    SINGLE = "SINGLE",
    MARRIED = "MARRIED",
  }
  
  export enum UserBloodType {
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-",
  }
  
  export enum UserEducationLevel {
    PRIMARY_SCHOOL = "İlkokul",
    MIDDLE_SCHOOL = "Ortaokul",
    HIGH_SCHOOL = "Lise",
    UNIVERSITY = "Üniversite",
    MASTER = "Yüksek Lisans",
    DOCTORATE = "Doktora",
  }
  
  export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
  }
  


