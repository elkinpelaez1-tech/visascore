import { VisaExpediente } from "../components/types";

const mockList: VisaExpediente[] = [
  {
    id: 'VISA-2026-881204',
    submissionDate: '2026-06-21',
    state: {
      personalData: { fullName: 'Carlos Manuel Santana', birthDate: '1985-05-14', gender: 'Masculino', birthPlace: 'Bogotá', nationality: 'Colombia' },
      addressContact: { residenceAddress: 'Carrera 15 # 93-40, Bogotá', mobilePhone: '3104556677', email: 'carlossantana@gmail.com' },
      passportData: { passportNumber: 'AP485920', expeditionDate: '2021-10-10', expirationDate: '2031-10-10', issuingCountry: 'Colombia' },
      travelInfo: { tentativeTravelDate: '2026-12-15', travelPurpose: 'Turismo (B2)', travelPayer: 'Mismo solicitante', payerLastName: '', payerFirstName: '', payerRelationship: 'Padre' },
      usContact: { hasContact: 'No', name: 'Hilton Midtown New York', address: '1335 Avenue of the Americas, New York, NY 10019', phone: '+1 212-555-0199', email: 'info@hiltonmidtown.com', relationship: 'Familiar', legalStatus: 'Ciudadano' },
      usTravelHistory: { hasTraveledBefore: 'No', entries: [] },
      previousVisa: { hasPreviousVisa: 'No', visaNumber: '', expeditionDate: '', expirationDate: '' },
      familyInfo: { fatherName: 'Ignacio Santana', fatherBirthDate: '1955-08-12', motherName: 'Beatriz Gómez', motherBirthDate: '1959-11-03' },
      spouseChildren: { civilStatus: 'Casado(a)', spouseName: 'Adriana María Pérez', spouseLastName: 'Pérez', spouseFirstName: 'Adriana María', spouseBirthDate: '1988-02-20', separationReason: '', separationDate: '', hasChildren: 'Si', childrenCount: 2 },
      currentJob: { workStatus: 'Trabajando', occupation: 'Gerente de Ventas', companyName: 'Tecnología Global S.A.S.', monthlySalary: '7.800.000 COP', workAddress: 'Calle 100 # 19-50, Bogotá', workPhone: '6013445566', startDate: '2018-03-01', duty1: 'Supervisión de equipo comercial de 12 personas', duty2: 'Planeación de estrategias de mercado regional', duty3: 'Gestión directa de cuentas corporativas clave' },
      previousJobs: { hasPreviousJobs: 'No', jobs: [] },
      education: { hasEducation: 'Si', studies: [{ id: '1', institutionName: 'Universidad Nacional', degreeEarned: 'Administrador de Empresas', startDate: '2003-01-20', endDate: '2008-05-15', institutionAddress: 'Carrera 45 # 26-85', institutionCity: 'Bogotá', institutionPhone: '6013165000' }] },
      countriesVisited: { countries: 'Brasil, Argentina' },
      securityQuestions: { arrested: 'No', publicHealthIssues: 'No', visaViolation: 'No' }
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
      personalData: { fullName: 'Diana Patricia Rojas', birthDate: '1992-09-30', gender: 'Femenino', birthPlace: 'Medellín', nationality: 'Colombia' },
      addressContact: { residenceAddress: 'Calle 32A # 70-15, Medellín', mobilePhone: '3157889900', email: 'dianarojas.92@hotmail.com' },
      passportData: { passportNumber: 'AP902811', expeditionDate: '2023-04-12', expirationDate: '2033-04-12', issuingCountry: 'Colombia' },
      travelInfo: { tentativeTravelDate: '2026-11-20', travelPurpose: 'Negocio/Turismo (B1/B2)', travelPayer: 'Mismo solicitante', payerLastName: '', payerFirstName: '', payerRelationship: 'Padre' },
      usContact: { hasContact: 'Si', name: 'John Miller (Amigo)', address: '840 Brickell Ave, Miami, FL 33131', phone: '+1 305-555-0821', email: 'john.miller@gmail.com', relationship: 'Amigo', legalStatus: 'Residente' },
      usTravelHistory: { hasTraveledBefore: 'Si', entries: [{ entryDate: '2019-06-15', exitDate: '2019-07-02', daysStayed: '17' }] },
      previousVisa: { hasPreviousVisa: 'Si', visaNumber: '12345678', expeditionDate: '2014-07-10', expirationDate: '2024-07-10' },
      familyInfo: { fatherName: 'Fernando Rojas', fatherBirthDate: '1961-04-05', motherName: 'Stella Marín', motherBirthDate: '1964-10-18' },
      spouseChildren: { civilStatus: 'Separado(a)', spouseName: 'Roberto Toro', spouseLastName: 'Toro', spouseFirstName: 'Roberto', spouseBirthDate: '1990-03-12', separationReason: 'Incompatibilidad de caracteres', separationDate: '2023-01-10', hasChildren: 'No', childrenCount: 0 },
      currentJob: { workStatus: 'Trabajando', occupation: 'Diseñadora Visual', companyName: 'Estudio Creativo Medellín', monthlySalary: '5.200.000 COP', workAddress: 'Av El Poblado # 5-80, Medellín', workPhone: '6042661122', startDate: '2020-07-15', duty1: 'Creación de interfaces web responsive', duty2: 'Maquetado en CSS/Tailwind y Figma', duty3: 'Presentación de propuestas de marca a clientes' },
      previousJobs: { hasPreviousJobs: 'Si', jobs: [{ id: 'prev-job-1', companyName: 'Agencia Publicidad Toro', position: 'Diseñadora Junior', supervisorName: 'Jefe Directo', startDate: '2016-01-01', endDate: '2020-06-30' }] },
      education: { hasEducation: 'Si', studies: [{ id: '1', institutionName: 'Universidad Pontificia Bolivariana', degreeEarned: 'Diseñadora Gráfica', startDate: '2010-01-15', endDate: '2015-06-18', institutionAddress: 'Circular 1 # 70-01', institutionCity: 'Medellín', institutionPhone: '6043549000' }] },
      countriesVisited: { countries: 'México, Perú, Panamá' },
      securityQuestions: { arrested: 'No', publicHealthIssues: 'No', visaViolation: 'No' }
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
      personalData: { fullName: 'Diana Valentina Restrepo', birthDate: '1962-11-23', gender: 'Femenino', birthPlace: 'Cali', nationality: 'Colombia' },
      addressContact: { residenceAddress: 'Avenida 6N # 20-35, Cali', mobilePhone: '3179900881', email: 'valentina.restrepo@pensionados.co' },
      passportData: { passportNumber: 'AP111222', expeditionDate: '2025-01-15', expirationDate: '2035-01-15', issuingCountry: 'Colombia' },
      travelInfo: { tentativeTravelDate: '2026-10-05', travelPurpose: 'Turismo (B2)', travelPayer: 'Hijo/a en Colombia', payerLastName: 'Restrepo', payerFirstName: 'Mateo', payerRelationship: 'Hijo/a' },
      usContact: { hasContact: 'No', name: 'Crowne Plaza Orlando', address: '304 W Colonial Dr, Orlando, FL 32801', phone: '+1 407-843-8700', email: 'guest@crowneplaza.com', relationship: 'Familiar', legalStatus: 'Ciudadano' },
      usTravelHistory: { hasTraveledBefore: 'No', entries: [] },
      previousVisa: { hasPreviousVisa: 'No', visaNumber: '', expeditionDate: '', expirationDate: '' },
      familyInfo: { fatherName: 'Benjamín Restrepo', fatherBirthDate: '1935-02-14', motherName: 'Inés Ospina', motherBirthDate: '1938-12-05' },
      spouseChildren: { civilStatus: 'Viudo(a)', spouseName: 'Alonso Valencia', spouseLastName: 'Valencia', spouseFirstName: 'Alonso', spouseBirthDate: '1958-06-03', separationReason: '', separationDate: '', hasChildren: 'Si', childrenCount: 1 },
      currentJob: { workStatus: 'Pensionado', occupation: '', companyName: '', monthlySalary: '', workAddress: '', workPhone: '', startDate: '', duty1: '', duty2: '', duty3: '' },
      previousJobs: { hasPreviousJobs: 'No', jobs: [] },
      education: { hasEducation: 'Si', studies: [{ id: '1', institutionName: 'Colegio Sagrado Corazón Cali', degreeEarned: 'Bachillerato Académico', startDate: '1974-01-15', endDate: '1979-11-25', institutionAddress: 'Calle 15 Norte', institutionCity: 'Cali', institutionPhone: '6026615544' }] },
      countriesVisited: { countries: '' },
      securityQuestions: { arrested: 'No', publicHealthIssues: 'No', visaViolation: 'No' }
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
  // En el futuro: const { data, error } = await supabase.from('visa_expedientes').select('*');
  return loadInitialMockData();
}

export async function getExpedienteById(id: string): Promise<VisaExpediente | null> {
  // En el futuro: const { data, error } = await supabase.from('visa_expedientes').select('*').eq('id', id).single();
  const list = await getExpedientes();
  return list.find(e => e.id === id) || null;
}

export async function saveExpediente(expediente: VisaExpediente): Promise<VisaExpediente> {
  // En el futuro: const { data, error } = await supabase.from('visa_expedientes').insert(expediente).select().single();
  const list = await getExpedientes();
  const updatedList = [expediente, ...list.filter(e => e.id !== expediente.id)];
  localStorage.setItem('visa_expedientes', JSON.stringify(updatedList));
  return expediente;
}

export async function updateExpediente(id: string, updates: Partial<VisaExpediente>): Promise<VisaExpediente | null> {
  // En el futuro: const { data, error } = await supabase.from('visa_expedientes').update(updates).eq('id', id).select().single();
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
  // En el futuro: const { error } = await supabase.from('visa_expedientes').delete().eq('id', id);
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
