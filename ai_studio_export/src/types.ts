export interface PersonalData {
  fullName: string;
  birthDate: string;
  gender: string;
  birthPlace: string;
  nationality: string;
}

export interface AddressContact {
  residenceAddress: string;
  mobilePhone: string;
  email: string;
}

export interface PassportData {
  passportNumber: string;
  expeditionDate: string;
  expirationDate: string;
  issuingCountry: string;
}

export interface TravelInfo {
  tentativeTravelDate: string;
  travelPurpose: string;
  travelPayer: string;
  payerLastName?: string;
  payerFirstName?: string;
  payerRelationship?: string;
}

export interface USContact {
  hasContact: 'No' | 'Si' | '';
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  relationship?: string;
  legalStatus?: string;
}

export interface USTravelEntry {
  entryDate: string;
  exitDate: string;
  daysStayed: string;
}

export interface USTravelHistory {
  hasTraveledBefore: 'No' | 'Si' | '';
  entries: USTravelEntry[];
}

export interface PreviousVisa {
  hasPreviousVisa: 'No' | 'Si' | '';
  visaNumber?: string;
  expeditionDate?: string;
  expirationDate?: string;
}

export interface FamilyInfo {
  fatherName: string;
  fatherBirthDate: string;
  motherName: string;
  motherBirthDate: string;
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
  personalData: { fullName: '', birthDate: '', gender: 'Masculino', birthPlace: '', nationality: 'Colombia' },
  addressContact: { residenceAddress: '', mobilePhone: '', email: '' },
  passportData: { passportNumber: '', expeditionDate: '', expirationDate: '', issuingCountry: 'Colombia' },
  travelInfo: { tentativeTravelDate: '', travelPurpose: 'Turismo (B2)', travelPayer: 'Mismo solicitante', payerLastName: '', payerFirstName: '', payerRelationship: 'Padre' },
  usContact: { hasContact: '', name: '', address: '', phone: '', email: '', relationship: 'Familiar', legalStatus: 'Ciudadano' },
  usTravelHistory: { hasTraveledBefore: '', entries: [] },
  previousVisa: { hasPreviousVisa: '', visaNumber: '', expeditionDate: '', expirationDate: '' },
  familyInfo: { fatherName: '', fatherBirthDate: '', motherName: '', motherBirthDate: '' },
  spouseChildren: { civilStatus: 'Soltero(a)', spouseName: '', spouseLastName: '', spouseFirstName: '', spouseBirthDate: '', separationReason: '', separationDate: '', hasChildren: '', childrenCount: 0 },
  currentJob: { workStatus: 'Trabajando', occupation: '', companyName: '', monthlySalary: '', workAddress: '', workPhone: '', startDate: '', duty1: '', duty2: '', duty3: '' },
  previousJobs: { hasPreviousJobs: '', jobs: [] },
  education: { hasEducation: '', studies: [] },
  countriesVisited: { countries: '' },
  securityQuestions: { arrested: 'No', publicHealthIssues: 'No', visaViolation: 'No' }
};
