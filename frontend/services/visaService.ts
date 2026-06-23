import { VisaExpediente } from "../components/types";

const mockList: VisaExpediente[] = [
  {
    id: 'VISA-2026-881204',
    submissionDate: '2026-06-21',
    state: {
      personalData: {
        fullName: 'Carlos Manuel Santana',
        birthDate: '1985-05-14',
        gender: 'Masculino',
        birthPlace: 'Bogotá',
        nationality: 'Colombia',
        nationalIdentityType: 'Cédula de Ciudadanía',
        nationalIdentityNumber: '80123456',
        hasOtherNationality: 'No',
        otherNationalityDetails: '',
        isResidentOtherCountry: 'No'
      },
      addressContact: {
        residenceAddress: 'Carrera 15 # 93-40',
        residenceCity: 'Bogotá',
        residenceState: 'Bogotá, D.C.',
        residenceCountry: 'Colombia',
        mobilePhone: '3104556677',
        secondaryPhone: '6013221100',
        email: 'carlossantana@gmail.com',
        hasOtherEmail: 'No',
        otherEmail: '',
        hasSocialMedia: 'Si',
        socialMediaLink: 'https://instagram.com/carlossantana'
      },
      passportData: {
        passportNumber: 'AP485920',
        expeditionDate: '2021-10-10',
        expirationDate: '2031-10-10',
        issuingCountry: 'Colombia',
        passportType: 'Regular',
        hasLostPassport: 'No',
        lostPassportExplanation: ''
      },
      travelInfo: {
        tentativeTravelDate: '2026-12-15',
        travelPurpose: 'Turismo (B2)',
        travelPayer: 'Mismo solicitante',
        payerLastName: '',
        payerFirstName: '',
        payerRelationship: 'Padre',
        hasSpecificTravelPlans: 'No',
        arrivalDate: '',
        departureDate: '',
        travelDurationDays: '15',
        accommodationPhone: '+1 212-555-0199',
        accommodationEmail: 'info@hiltonmidtown.com'
      },
      usContact: {
        hasContact: 'No',
        name: 'Hilton Midtown New York',
        address: '1335 Avenue of the Americas, New York, NY 10019',
        phone: '+1 212-555-0199',
        email: 'info@hiltonmidtown.com',
        relationship: 'Familiar',
        legalStatus: 'Ciudadano',
        organizationName: ''
      },
      usTravelHistory: {
        hasTraveledBefore: 'No',
        entries: [],
        previousEntriesCount: '0'
      },
      previousVisa: {
        hasPreviousVisa: 'No',
        visaNumber: '',
        expeditionDate: '',
        expirationDate: '',
        hasVisaDenial: 'No',
        denialDate: '',
        denialReason: ''
      },
      familyInfo: {
        fatherName: 'Ignacio Santana',
        fatherBirthDate: '1955-08-12',
        isFatherInUS: 'No',
        fatherUSStatus: 'Ciudadano',
        motherName: 'Beatriz Gómez',
        motherBirthDate: '1959-11-03',
        isMotherInUS: 'No',
        motherUSStatus: 'Ciudadano',
        hasOtherRelativesInUS: 'No',
        otherRelativesDetails: ''
      },
      spouseChildren: {
        civilStatus: 'Casado(a)',
        spouseName: 'Adriana María Pérez',
        spouseLastName: 'Pérez',
        spouseFirstName: 'Adriana María',
        spouseBirthDate: '1988-02-20',
        separationReason: '',
        separationDate: '',
        hasChildren: 'Si',
        childrenCount: 2
      },
      currentJob: {
        workStatus: 'Trabajando',
        occupation: 'Gerente de Ventas',
        companyName: 'Tecnología Global S.A.S.',
        monthlySalary: '7.800.000 COP',
        workAddress: 'Calle 100 # 19-50, Bogotá',
        workPhone: '6013445566',
        startDate: '2018-03-01',
        duty1: 'Supervisión de equipo comercial de 12 personas',
        duty2: 'Planeación de estrategias de mercado regional',
        duty3: 'Gestión directa de cuentas corporativas clave'
      },
      previousJobs: {
        hasPreviousJobs: 'No',
        jobs: []
      },
      education: {
        hasEducation: 'Si',
        studies: [
          {
            id: '1',
            institutionName: 'Universidad Nacional',
            degreeEarned: 'Administrador de Empresas',
            startDate: '2003-01-20',
            endDate: '2008-05-15',
            institutionAddress: 'Carrera 45 # 26-85',
            institutionCity: 'Bogotá',
            institutionPhone: '6013165000'
          }
        ]
      },
      countriesVisited: {
        countries: 'Brasil, Argentina'
      },
      securityQuestions: {
        arrested: 'No',
        publicHealthIssues: 'No',
        visaViolation: 'No',
        languagesSpoken: 'Español, Inglés',
        hasMilitaryService: 'No',
        militaryBranch: '',
        militaryRank: '',
        militarySpecialty: '',
        militaryStartDate: '',
        militaryEndDate: ''
      }
    },
    ds160: {
      ds160Number: 'AA00EF81D9',
      createdAtDate: '2026-06-22',
      formStatus: 'En proceso'
    },
    checklist: {
      infoReceived: true,
      documentsUploaded: true,
      ds160Created: true,
      ds160Reviewed: false,
      consularFeesPaid: false,
      apptScheduled: false,
      interviewDone: false,
      visaApproved: false,
      caseClosed: false
    }
  },
  {
    id: 'VISA-2026-440192',
    submissionDate: '2026-06-20',
    state: {
      personalData: {
        fullName: 'Diana Patricia Rojas',
        birthDate: '1992-09-30',
        gender: 'Femenino',
        birthPlace: 'Medellín',
        nationality: 'Colombia',
        nationalIdentityType: 'Cédula de Ciudadanía',
        nationalIdentityNumber: '10203040',
        hasOtherNationality: 'No',
        otherNationalityDetails: '',
        isResidentOtherCountry: 'No'
      },
      addressContact: {
        residenceAddress: 'Calle 32A # 70-15',
        residenceCity: 'Medellín',
        residenceState: 'Antioquia',
        residenceCountry: 'Colombia',
        mobilePhone: '3157889900',
        secondaryPhone: '',
        email: 'dianarojas.92@hotmail.com',
        hasOtherEmail: 'No',
        otherEmail: '',
        hasSocialMedia: 'No',
        socialMediaLink: ''
      },
      passportData: {
        passportNumber: 'AP902811',
        expeditionDate: '2023-04-12',
        expirationDate: '2033-04-12',
        issuingCountry: 'Colombia',
        passportType: 'Regular',
        hasLostPassport: 'No',
        lostPassportExplanation: ''
      },
      travelInfo: {
        tentativeTravelDate: '2026-11-20',
        travelPurpose: 'Negocio/Turismo (B1/B2)',
        travelPayer: 'Mismo solicitante',
        payerLastName: '',
        payerFirstName: '',
        payerRelationship: 'Padre',
        hasSpecificTravelPlans: 'Si',
        arrivalDate: '2026-11-20',
        departureDate: '2026-11-28',
        travelDurationDays: '8',
        accommodationPhone: '+1 305-555-0821',
        accommodationEmail: 'john.miller@gmail.com'
      },
      usContact: {
        hasContact: 'Si',
        name: 'John Miller',
        address: '840 Brickell Ave, Miami, FL 33131',
        phone: '+1 305-555-0821',
        email: 'john.miller@gmail.com',
        relationship: 'Amigo',
        legalStatus: 'Residente',
        organizationName: ''
      },
      usTravelHistory: {
        hasTraveledBefore: 'Si',
        entries: [
          {
            entryDate: '2019-06-15',
            exitDate: '2019-07-02',
            daysStayed: '17',
            cityVisited: 'Miami'
          }
        ],
        previousEntriesCount: '1'
      },
      previousVisa: {
        hasPreviousVisa: 'Si',
        visaNumber: '12345678',
        expeditionDate: '2014-07-10',
        expirationDate: '2024-07-10',
        hasVisaDenial: 'No',
        denialDate: '',
        denialReason: ''
      },
      familyInfo: {
        fatherName: 'Fernando Rojas',
        fatherBirthDate: '1961-04-05',
        isFatherInUS: 'No',
        fatherUSStatus: 'Ciudadano',
        motherName: 'Stella Marín',
        motherBirthDate: '1964-10-18',
        isMotherInUS: 'No',
        motherUSStatus: 'Ciudadano',
        hasOtherRelativesInUS: 'No',
        otherRelativesDetails: ''
      },
      spouseChildren: {
        civilStatus: 'Separado(a)',
        spouseName: 'Roberto Toro',
        spouseLastName: 'Toro',
        spouseFirstName: 'Roberto',
        spouseBirthDate: '1990-03-12',
        separationReason: 'Incompatibilidad de caracteres',
        separationDate: '2023-01-10',
        hasChildren: 'No',
        childrenCount: 0
      },
      currentJob: {
        workStatus: 'Trabajando',
        occupation: 'Diseñadora Visual',
        companyName: 'Estudio Creativo Medellín',
        monthlySalary: '5.200.000 COP',
        workAddress: 'Av El Poblado # 5-80, Medellín',
        workPhone: '6042661122',
        startDate: '2020-07-15',
        duty1: 'Creación de interfaces web responsive',
        duty2: 'Maquetado en CSS/Tailwind y Figma',
        duty3: 'Presentación de propuestas de marca a clientes'
      },
      previousJobs: {
        hasPreviousJobs: 'Si',
        jobs: [
          {
            id: 'prev-job-1',
            companyName: 'Agencia Publicidad Toro',
            position: 'Diseñadora Junior',
            supervisorName: 'Jefe Directo',
            startDate: '2016-01-01',
            endDate: '2020-06-30',
            companyAddress: 'Calle 10 # 43-20, Medellín',
            companyPhone: '6043112233'
          }
        ]
      },
      education: {
        hasEducation: 'Si',
        studies: [
          {
            id: '1',
            institutionName: 'Universidad Pontificia Bolivariana',
            degreeEarned: 'Diseñadora Gráfica',
            startDate: '2010-01-15',
            endDate: '2015-06-18',
            institutionAddress: 'Circular 1 # 70-01',
            institutionCity: 'Medellín',
            institutionPhone: '6043549000'
          }
        ]
      },
      countriesVisited: {
        countries: 'México, Perú, Panamá'
      },
      securityQuestions: {
        arrested: 'No',
        publicHealthIssues: 'No',
        visaViolation: 'No',
        languagesSpoken: 'Español',
        hasMilitaryService: 'No',
        militaryBranch: '',
        militaryRank: '',
        militarySpecialty: '',
        militaryStartDate: '',
        militaryEndDate: ''
      }
    },
    ds160: {
      ds160Number: 'AA00CD4991',
      createdAtDate: '2026-06-20',
      formStatus: 'Completado'
    },
    checklist: {
      infoReceived: true,
      documentsUploaded: true,
      ds160Created: true,
      ds160Reviewed: true,
      consularFeesPaid: true,
      apptScheduled: true,
      interviewDone: false,
      visaApproved: false,
      caseClosed: false
    }
  },
  {
    id: 'VISA-2026-109283',
    submissionDate: '2026-06-22',
    state: {
      personalData: {
        fullName: 'Diana Valentina Restrepo',
        birthDate: '1962-11-23',
        gender: 'Femenino',
        birthPlace: 'Cali',
        nationality: 'Colombia',
        nationalIdentityType: 'Cédula de Ciudadanía',
        nationalIdentityNumber: '31456789',
        hasOtherNationality: 'No',
        otherNationalityDetails: '',
        isResidentOtherCountry: 'No'
      },
      addressContact: {
        residenceAddress: 'Avenida 6N # 20-35',
        residenceCity: 'Cali',
        residenceState: 'Valle del Cauca',
        residenceCountry: 'Colombia',
        mobilePhone: '3179900881',
        secondaryPhone: '',
        email: 'valentina.restrepo@pensionados.co',
        hasOtherEmail: 'No',
        otherEmail: '',
        hasSocialMedia: 'No',
        socialMediaLink: ''
      },
      passportData: {
        passportNumber: 'AP111222',
        expeditionDate: '2025-01-15',
        expirationDate: '2035-01-15',
        issuingCountry: 'Colombia',
        passportType: 'Regular',
        hasLostPassport: 'No',
        lostPassportExplanation: ''
      },
      travelInfo: {
        tentativeTravelDate: '2026-10-05',
        travelPurpose: 'Turismo (B2)',
        travelPayer: 'Hijo/a en Colombia',
        payerLastName: 'Restrepo',
        payerFirstName: 'Mateo',
        payerRelationship: 'Hijo/a',
        hasSpecificTravelPlans: 'No',
        arrivalDate: '',
        departureDate: '',
        travelDurationDays: '10',
        accommodationPhone: '+1 407-843-8700',
        accommodationEmail: 'guest@crowneplaza.com'
      },
      usContact: {
        hasContact: 'No',
        name: 'Crowne Plaza Orlando',
        address: '304 W Colonial Dr, Orlando, FL 32801',
        phone: '+1 407-843-8700',
        email: 'guest@crowneplaza.com',
        relationship: 'Familiar',
        legalStatus: 'Ciudadano',
        organizationName: ''
      },
      usTravelHistory: {
        hasTraveledBefore: 'No',
        entries: [],
        previousEntriesCount: '0'
      },
      previousVisa: {
        hasPreviousVisa: 'No',
        visaNumber: '',
        expeditionDate: '',
        expirationDate: '',
        hasVisaDenial: 'Si',
        denialDate: '2024-05-10',
        denialReason: 'Falta de arraigos económicos suficientes en el país de origen.'
      },
      familyInfo: {
        fatherName: 'Benjamín Restrepo',
        fatherBirthDate: '1935-02-14',
        isFatherInUS: 'No',
        fatherUSStatus: 'Ciudadano',
        motherName: 'Inés Ospina',
        motherBirthDate: '1938-12-05',
        isMotherInUS: 'No',
        motherUSStatus: 'Ciudadano',
        hasOtherRelativesInUS: 'No',
        otherRelativesDetails: ''
      },
      spouseChildren: {
        civilStatus: 'Viudo(a)',
        spouseName: 'Alonso Valencia',
        spouseLastName: 'Valencia',
        spouseFirstName: 'Alonso',
        spouseBirthDate: '1958-06-03',
        separationReason: '',
        separationDate: '',
        hasChildren: 'Si',
        childrenCount: 1
      },
      currentJob: {
        workStatus: 'Pensionado',
        occupation: '',
        companyName: '',
        monthlySalary: '',
        workAddress: '',
        workPhone: '',
        startDate: '',
        duty1: '',
        duty2: '',
        duty3: ''
      },
      previousJobs: {
        hasPreviousJobs: 'No',
        jobs: []
      },
      education: {
        hasEducation: 'Si',
        studies: [
          {
            id: '1',
            institutionName: 'Colegio Sagrado Corazón Cali',
            degreeEarned: 'Bachillerato Académico',
            startDate: '1974-01-15',
            endDate: '1979-11-25',
            institutionAddress: 'Calle 15 Norte',
            institutionCity: 'Cali',
            institutionPhone: '6026615544'
          }
        ]
      },
      countriesVisited: {
        countries: ''
      },
      securityQuestions: {
        arrested: 'No',
        publicHealthIssues: 'No',
        visaViolation: 'No',
        languagesSpoken: 'Español',
        hasMilitaryService: 'No',
        militaryBranch: '',
        militaryRank: '',
        militarySpecialty: '',
        militaryStartDate: '',
        militaryEndDate: ''
      }
    },
    ds160: {
      ds160Number: '',
      createdAtDate: '',
      formStatus: 'No iniciado'
    },
    checklist: {
      infoReceived: true,
      documentsUploaded: false,
      ds160Created: false,
      ds160Reviewed: false,
      consularFeesPaid: false,
      apptScheduled: false,
      interviewDone: false,
      visaApproved: false,
      caseClosed: false
    }
  }
];

const loadInitialMockData = (): VisaExpediente[] => {
  if (typeof window === 'undefined') return [];
  const existing = localStorage.getItem('visa_expedientes');
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      console.error('Error parsing visa_expedientes from localStorage', e);
    }
  }
  localStorage.setItem('visa_expedientes', JSON.stringify(mockList));
  return mockList;
};

export async function getExpedientes(): Promise<VisaExpediente[]> {
  return loadInitialMockData();
}

export async function getExpedienteById(id: string): Promise<VisaExpediente | null> {
  const list = await getExpedientes();
  return list.find(e => e.id === id) || null;
}

export async function saveExpediente(expediente: VisaExpediente): Promise<VisaExpediente> {
  const list = await getExpedientes();
  const updatedList = [expediente, ...list.filter(e => e.id !== expediente.id)];
  localStorage.setItem('visa_expedientes', JSON.stringify(updatedList));
  return expediente;
}

export async function updateExpediente(id: string, updates: Partial<VisaExpediente>): Promise<VisaExpediente | null> {
  const list = await getExpedientes();
  let found: VisaExpediente | null = null;
  const updatedList = list.map(item => {
    if (item.id === id) {
      found = { ...item, ...updates } as VisaExpediente;
      if (updates.ds160) {
        found.ds160 = { ...item.ds160, ...updates.ds160 };
      }
      if (updates.checklist) {
        found.checklist = { ...item.checklist, ...updates.checklist };
      }
      return found;
    }
    return item;
  });
  if (!found) return null;
  localStorage.setItem('visa_expedientes', JSON.stringify(updatedList));
  return found;
}

export async function deleteExpediente(id: string): Promise<boolean> {
  const list = await getExpedientes();
  const filtered = list.filter(e => e.id !== id);
  localStorage.setItem('visa_expedientes', JSON.stringify(filtered));
  return true;
}

export async function resetExpedientes(): Promise<VisaExpediente[]> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('visa_expedientes');
  }
  return getExpedientes();
}
