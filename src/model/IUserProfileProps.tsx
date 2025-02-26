export interface IUserProfileProps {
    userData: {
      [x: string]: any;
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
    KADIN = "KADIN",
    ERKEK = "ERKEK",
  }
  
  export enum UserMaritalStatus {
    BEKAR = "BEKAR",
    EVLI = "EVLI",
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
    ILKOKUL = "ILKOKUL",
    ORTAOKUL = "ORTAOKUL",
    LISEL = "LISE",
    UNIVERSITE = "UNIVERSITE",
    YUKSEK_LISANS = "Yüksek Lisans",
  
  }
  
  export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
  }
  


