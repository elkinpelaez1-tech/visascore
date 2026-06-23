export interface PersonalData {
  fullName: string;
  birthDate: string;
  gender: string;
  birthPlace: string;
  nationality: string;
  nationalIdentityType: string; // Cédula de Ciudadanía, etc.
  nationalIdentityNumber: string;
  hasOtherNationality: 'No' | 'Si' | '';
  otherNationalityDetails?: string;
  isResidentOtherCountry: 'No' | 'Si' | '';
}

export interface AddressContact {
  residenceAddress: string;
  residenceCity: string;
  residenceState: string;
  residenceCountry: string;
  mobilePhone: string;
  secondaryPhone?: string;
  email: string;
  hasOtherEmail: 'No' | 'Si' | '';
  otherEmail?: string;
  hasSocialMedia: 'No' | 'Si' | '';
  socialMediaLink?: string; // Enlace completo del perfil
}

export interface PassportData {
  passportNumber: string;
  expeditionDate: string;
  expirationDate: string;
  issuingCountry: string;
  passportType: string; // Regular, Oficial, etc.
  hasLostPassport: 'No' | 'Si' | '';
  lostPassportExplanation?: string;
}

export interface TravelInfo {
  tentativeTravelDate: string;
  travelPurpose: string;
  travelPayer: string;
  payerLastName?: string;
  payerFirstName?: string;
  payerRelationship?: string;
  hasSpecificTravelPlans: 'No' | 'Si' | '';
  arrivalDate?: string;
  departureDate?: string;
  travelDurationDays?: string;
  accommodationPhone?: string;
  accommodationEmail?: string;
}

export interface USContact {
  hasContact: 'No' | 'Si' | '';
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  relationship?: string;
  legalStatus?: string;
  organizationName?: string;
}

export interface USTravelEntry {
  entryDate: string;
  exitDate: string;
  daysStayed: string;
  cityVisited?: string; // Ciudad visitada (opcional)
}

export interface USTravelHistory {
  hasTraveledBefore: 'No' | 'Si' | '';
  entries: USTravelEntry[];
  previousEntriesCount?: string;
}

export interface PreviousVisa {
  hasPreviousVisa: 'No' | 'Si' | '';
  visaNumber?: string;
  expeditionDate?: string;
  expirationDate?: string;
  hasVisaDenial: 'No' | 'Si' | '';
  denialDate?: string;
  denialReason?: string;
}

export interface FamilyInfo {
  fatherName: string;
  fatherBirthDate?: string;
  isFatherInUS?: 'No' | 'Si' | '';
  fatherUSStatus?: string;
  motherName: string;
  motherBirthDate?: string;
  isMotherInUS?: 'No' | 'Si' | '';
  motherUSStatus?: string;
  hasOtherRelativesInUS: 'No' | 'Si' | '';
  otherRelativesDetails?: string;
}

export interface SpouseChildrenInfo {
  civilStatus: string;
  spouseName?: string;
  spouseLastName?: string;
  spouseFirstName?: string;
  spouseBirthDate?: string;
  separationReason?: string;
  separationDate?: string;
  hasChildren: 'No' | 'Si' | '';
  childrenCount?: number;
}

export interface CurrentJob {
  workStatus: 'Trabajando' | 'Pensionado' | '';
  occupation: string;
  companyName: string;
  monthlySalary: string;
  workAddress: string;
  workPhone: string;
  startDate: string;
  duty1?: string;
  duty2?: string;
  duty3?: string;
}

export interface PreviousJobEntry {
  id: string;
  companyName: string;
  position: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  companyAddress?: string;
  companyPhone?: string;
}

export interface PreviousJobsInfo {
  hasPreviousJobs: 'No' | 'Si' | '';
  jobs: PreviousJobEntry[];
}

export interface EducationEntry {
  id: string;
  institutionName: string;
  degreeEarned: string;
  startDate: string;
  endDate: string;
  institutionAddress?: string;
  institutionCity?: string;
  institutionPhone?: string;
}

export interface EducationInfo {
  hasEducation: 'No' | 'Si' | '';
  studies: EducationEntry[];
}

export interface CountriesVisited {
  countries: string; // Comma separated list of countries visited in last 5 years
}

export interface SecurityQuestions {
  arrested: 'No' | 'Si' | '';
  publicHealthIssues: 'No' | 'Si' | '';
  visaViolation: 'No' | 'Si' | '';
  languagesSpoken: string;
  hasMilitaryService: 'No' | 'Si' | '';
  militaryBranch?: string;
  militaryRank?: string;
  militarySpecialty?: string;
  militaryStartDate?: string;
  militaryEndDate?: string;
}

export interface VisaApplicationState {
  personalData: PersonalData;
  addressContact: AddressContact;
  passportData: PassportData;
  travelInfo: TravelInfo;
  usContact: USContact;
  usTravelHistory: USTravelHistory;
  previousVisa: PreviousVisa;
  familyInfo: FamilyInfo;
  spouseChildren: SpouseChildrenInfo;
  currentJob: CurrentJob;
  previousJobs: PreviousJobsInfo;
  education: EducationInfo;
  countriesVisited: CountriesVisited;
  securityQuestions: SecurityQuestions;
}

export interface DS160Info {
  ds160Number: string;
  createdAtDate: string;
  formStatus: 'No iniciado' | 'En proceso' | 'Completado' | 'Enviado';
}

export interface ProcessChecklist {
  infoReceived: boolean;
  documentsUploaded: boolean;
  ds160Created: boolean;
  ds160Reviewed: boolean;
  consularFeesPaid: boolean;
  apptScheduled: boolean;
  interviewDone: boolean;
  visaApproved: boolean;
  caseClosed: boolean;
}

export interface VisaExpediente {
  id: string; // Dynamic case number assigned (e.g. VISA-2026-000189)
  submissionDate: string;
  state: VisaApplicationState;
  ds160: DS160Info;
  checklist: ProcessChecklist;
}

export const initialFormState: VisaApplicationState = {
  personalData: { fullName: '', birthDate: '', gender: 'Masculino', birthPlace: '', nationality: 'Colombia', nationalIdentityType: 'Cédula de Ciudadanía', nationalIdentityNumber: '', hasOtherNationality: 'No', otherNationalityDetails: '', isResidentOtherCountry: 'No' },
  addressContact: { residenceAddress: '', residenceCity: '', residenceState: '', residenceCountry: 'Colombia', mobilePhone: '', secondaryPhone: '', email: '', hasOtherEmail: 'No', otherEmail: '', hasSocialMedia: 'No', socialMediaLink: '' },
  passportData: { passportNumber: '', expeditionDate: '', expirationDate: '', issuingCountry: 'Colombia', passportType: 'Regular', hasLostPassport: 'No', lostPassportExplanation: '' },
  travelInfo: { tentativeTravelDate: '', travelPurpose: 'Turismo (B2)', travelPayer: 'Mismo solicitante', payerLastName: '', payerFirstName: '', payerRelationship: 'Padre', hasSpecificTravelPlans: 'No', arrivalDate: '', departureDate: '', travelDurationDays: '', accommodationPhone: '', accommodationEmail: '' },
  usContact: { hasContact: '', name: '', address: '', phone: '', email: '', relationship: 'Familiar', legalStatus: 'Ciudadano', organizationName: '' },
  usTravelHistory: { hasTraveledBefore: '', entries: [], previousEntriesCount: '' },
  previousVisa: { hasPreviousVisa: '', visaNumber: '', expeditionDate: '', expirationDate: '', hasVisaDenial: 'No', denialDate: '', denialReason: '' },
  familyInfo: { fatherName: '', fatherBirthDate: '', isFatherInUS: 'No', fatherUSStatus: 'Ciudadano', motherName: '', motherBirthDate: '', isMotherInUS: 'No', motherUSStatus: 'Ciudadano', hasOtherRelativesInUS: 'No', otherRelativesDetails: '' },
  spouseChildren: { civilStatus: 'Soltero(a)', spouseName: '', spouseLastName: '', spouseFirstName: '', spouseBirthDate: '', separationReason: '', separationDate: '', hasChildren: '', childrenCount: 0 },
  currentJob: { workStatus: 'Trabajando', occupation: '', companyName: '', monthlySalary: '', workAddress: '', workPhone: '', startDate: '', duty1: '', duty2: '', duty3: '' },
  previousJobs: { hasPreviousJobs: '', jobs: [] },
  education: { hasEducation: '', studies: [] },
  countriesVisited: { countries: '' },
  securityQuestions: { arrested: 'No', publicHealthIssues: 'No', visaViolation: 'No', languagesSpoken: '', hasMilitaryService: 'No', militaryBranch: '', militaryRank: '', militarySpecialty: '', militaryStartDate: '', militaryEndDate: '' }
};
