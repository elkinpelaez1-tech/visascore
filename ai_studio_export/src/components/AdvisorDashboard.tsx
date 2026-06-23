import { useState, useEffect } from 'react';
import { 
  Search, Shield, CheckSquare, Square, Save, Eye, ClipboardList, 
  User, Calendar, FileText, Phone, Mail, MapPin, Briefcase, GraduationCap, 
  Tag, Info, CheckCircle2, AlertCircle, RefreshCw, X, Globe
} from 'lucide-react';
import { VisaExpediente, DS160Info, ProcessChecklist, VisaApplicationState } from '../types';

// Helper to load realistic initial mock data if localStorage is empty
const loadInitialMockData = (): VisaExpediente[] => {
  const existing = localStorage.getItem('visa_expedientes');
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      console.error('Error parsing visa_expedientes from localStorage', e);
    }
  }

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

  localStorage.setItem('visa_expedientes', JSON.stringify(mockList));
  return mockList;
};

interface AdvisorDashboardProps {
  onBackToLanding: () => void;
}

export default function AdvisorDashboard({ onBackToLanding }: AdvisorDashboardProps) {
  const [expedientes, setExpedientes] = useState<VisaExpediente[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // DS-160 edit state (for selected client)
  const [ds160Number, setDs160Number] = useState('');
  const [createdAtDate, setCreatedAtDate] = useState('');
  const [formStatus, setFormStatus] = useState<DS160Info['formStatus']>('No iniciado');

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load expedientes on mount
  useEffect(() => {
    const data = loadInitialMockData();
    setExpedientes(data);
    if (data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, []);

  // Update edit form fields whenever selectedId changes
  useEffect(() => {
    if (selectedId) {
      const active = expedientes.find(e => e.id === selectedId);
      if (active) {
        setDs160Number(active.ds160.ds160Number || '');
        setCreatedAtDate(active.ds160.createdAtDate || '');
        setFormStatus(active.ds160.formStatus || 'No iniciado');
        setSaveSuccess(false);
      }
    }
  }, [selectedId, expedientes]);

  const activeExpediente = expedientes.find(e => e.id === selectedId);

  // Save updated DS-160 Info and Checklist for current active record
  const handleSaveAdminInfo = () => {
    if (!selectedId) return;

    const updated = expedientes.map(exp => {
      if (exp.id === selectedId) {
        return {
          ...exp,
          ds160: {
            ds160Number,
            createdAtDate,
            formStatus
          }
        };
      }
      return exp;
    });

    setExpedientes(updated);
    localStorage.setItem('visa_expedientes', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Toggle checklist item status reactively
  const handleToggleChecklistItem = (key: keyof ProcessChecklist) => {
    if (!selectedId) return;

    const updated = expedientes.map(exp => {
      if (exp.id === selectedId) {
        const updatedChecklist = {
          ...exp.checklist,
          [key]: !exp.checklist[key]
        };
        return {
          ...exp,
          checklist: updatedChecklist
        };
      }
      return exp;
    });

    setExpedientes(updated);
    localStorage.setItem('visa_expedientes', JSON.stringify(updated));
  };

  // Delete an expedition record safely
  const handleDeleteRecord = (id: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el expediente ${id}? Esta acción es irreversible.`)) {
      const updated = expedientes.filter(e => e.id !== id);
      setExpedientes(updated);
      localStorage.setItem('visa_expedientes', JSON.stringify(updated));
      if (selectedId === id) {
        setSelectedId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  // Reset list to default initial mocks
  const handleResetToMocks = () => {
    if (confirm('¿Desea restaurar los expedientes demo predeterminados? Se perderán las solicitudes agregadas recientemente.')) {
      localStorage.removeItem('visa_expedientes');
      const data = loadInitialMockData();
      setExpedientes(data);
      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
    }
  };

  // Filtered list based on Search and Status filter
  const filteredExpedientes = expedientes.filter(exp => {
    const matchesSearch = 
      exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.state.personalData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.state.passportData.passportNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || exp.ds160.formStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate completed items for checklist
  const getPercentChecklist = (checklist: ProcessChecklist) => {
    const total = Object.keys(checklist).length;
    const completed = Object.values(checklist).filter(v => v).length;
    return Math.round((completed / total) * 100);
  };

  const getStatusBadgeStyles = (status: DS160Info['formStatus']) => {
    switch (status) {
      case 'No iniciado':
        return 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300';
      case 'En proceso':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Completado':
        return 'bg-blue-50 text-us-blue border-blue-200';
      case 'Enviado':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Banner Control Panel */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-us-blue/10 p-2.5 rounded-2xl border border-us-blue/30 text-us-blue">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Área Administrativa Consular</p>
              <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                Asesores Desk <span className="text-xs font-bold py-0.5 px-2 bg-us-red text-white rounded-full">Gestión Interna</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleResetToMocks}
              title="Restaurar de fábrica / Cargar demos"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-bold rounded-xl transition flex items-center gap-1 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Demos
            </button>
            <button
              onClick={onBackToLanding}
              className="px-4 py-2 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-lg transition"
            >
              Volver a la Web
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Explorer Board */}
        <section className="lg:col-span-4 flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl h-[calc(100vh-170px)] min-h-[500px]">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-us-blue" /> Expedientes de Visa ({filteredExpedientes.length})
          </h2>

          {/* Search Controls */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre, Caso o Pasaporte..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-us-blue text-xs font-bold text-slate-100 placeholder-slate-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filtrar Estado DS-160</label>
              <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['Todos', 'No iniciado', 'En proceso', 'Completado', 'Enviado'].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`py-1.5 px-1 rounded-lg text-[9px] font-bold transition text-center whitespace-nowrap truncate ${
                      statusFilter === f 
                        ? 'bg-us-blue text-white shadow' 
                        : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    {f === 'Todos' ? 'Todos' : f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-850 mb-3" />

          {/* Scrolling client list */}
          <div className="flex-grow overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {filteredExpedientes.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-bold">No se encontraron expedientes con los criterios seleccionados.</p>
              </div>
            ) : (
              filteredExpedientes.map(exp => {
                const isActive = exp.id === selectedId;
                const checklistPercent = getPercentChecklist(exp.checklist);
                return (
                  <div
                    key={exp.id}
                    onClick={() => setSelectedId(exp.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition relative group ${
                      isActive 
                        ? 'bg-slate-850 border-us-blue' 
                        : 'bg-slate-900 hover:bg-slate-850/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] font-extrabold text-us-blue bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-900/30">
                        {exp.id}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(exp.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-us-red transition p-1 hover:bg-slate-800 rounded-lg absolute right-2 top-2"
                        title="Eliminar expediente"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getStatusBadgeStyles(exp.ds160.formStatus)}`}>
                        {exp.ds160.formStatus}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white line-clamp-1">
                      {exp.state.personalData.fullName || 'Sin Nombre Registrado'}
                    </h3>

                    {/* Progress tracking display in left column list */}
                    <div className="mt-3 flex items-center justify-between gap-4 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {exp.submissionDate}
                      </span>
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {checklistPercent}% Proceso
                      </span>
                    </div>

                    {/* Miniature checklist percentage bar chart */}
                    <div className="w-full bg-slate-950 h-1 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          checklistPercent === 100 
                            ? 'bg-emerald-500' 
                            : 'bg-us-blue'
                        }`} 
                        style={{ width: `${checklistPercent}%` }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Expediente Full Detail Card / "Ficha Administrativa" */}
        <section className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl h-[calc(100vh-170px)] min-h-[500px] overflow-hidden">
          {activeExpediente ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Header Details of patient */}
              <div className="border-b border-slate-850 pb-4 mb-4 flex-shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-us-red bg-red-950/20 px-3 py-1 rounded-lg border border-red-900/30">
                      Ficha Oficial del Solicitante
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">
                      {activeExpediente.state.personalData.fullName}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" /> Caso: {activeExpediente.id}
                    </span>
                    <span className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-400" /> Pasaporte: {activeExpediente.state.passportData.passportNumber}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4 text-xs text-slate-450 border-t border-slate-900 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Tel: <strong className="text-slate-200">{activeExpediente.state.addressContact.mobilePhone}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Correo: <strong className="text-slate-200">{activeExpediente.state.addressContact.email}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Radicación: <strong className="text-slate-200">{activeExpediente.submissionDate}</strong>
                  </span>
                </div>
              </div>

              {/* Scrollable detail grid */}
              <div className="flex-grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">

                {/* 1. INFORMACIÓN DS-160 Section (Uso Interno) */}
                <div className="p-5 bg-slate-900/40 border border-blue-900/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-us-blue" />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-us-blue" /> INFORMACIÓN DS-160 (Solo Gestión Interna - Invisible para Cliente)
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Número de Formulario DS-160 *</label>
                      <input
                        type="text"
                        placeholder="Ej. AA00BB11CC"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-755 text-sm font-semibold rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-us-blue"
                        value={ds160Number}
                        onChange={e => setDs160Number(e.target.value.toUpperCase())}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Fecha de Creación DS-160</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-755 text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-us-blue"
                        value={createdAtDate}
                        onChange={e => setCreatedAtDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Estado del Formulario *</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-755 text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-us-blue"
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value as DS160Info['formStatus'])}
                      >
                        <option value="No iniciado">No iniciado</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completado">Completado</option>
                        <option value="Enviado">Enviado</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 font-medium">
                      {activeExpediente.ds160.ds160Number ? (
                        <>DS-160 cargado: <strong className="text-white">{activeExpediente.ds160.ds160Number}</strong> el {activeExpediente.ds160.createdAtDate || 'N/A'}</>
                      ) : (
                        `Sin registrar número de DS-160 en este expediente consular.`
                      )}
                    </p>
                    <button
                      onClick={handleSaveAdminInfo}
                      className="px-4 py-1.5 bg-us-blue hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" /> Guardar Estado
                    </button>
                  </div>

                  {saveSuccess && (
                    <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-md shadow flex items-center gap-1 p-2 font-bold animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" /> ¡Guardado correctamente!
                    </div>
                  )}
                </div>

                {/* 2. LISTA DE VERIFICACIÓN DEL PROCESO Section */}
                <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-us-blue" /> Lista de Verificación del Proceso Consular
                  </h3>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'infoReceived', label: '1. Información recibida' },
                      { key: 'documentsUploaded', label: '2. Documentos cargados' },
                      { key: 'ds160Created', label: '3. DS160 creado' },
                      { key: 'ds160Reviewed', label: '4. DS160 revisado' },
                      { key: 'consularFeesPaid', label: '5. Pago derechos consulares' },
                      { key: 'apptScheduled', label: '6. Cita programada' },
                      { key: 'interviewDone', label: '7. Entrevista realizada' },
                      { key: 'visaApproved', label: '8. Visa aprobada' },
                      { key: 'caseClosed', label: '9. Caso cerrado' }
                    ].map(item => {
                      const isChecked = activeExpediente.checklist[item.key as keyof ProcessChecklist];
                      return (
                        <div
                          key={item.key}
                          onClick={() => handleToggleChecklistItem(item.key as keyof ProcessChecklist)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition select-none ${
                            isChecked 
                              ? 'bg-slate-900/90 border-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400'
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 border border-slate-600 rounded flex-shrink-0" />
                          )}
                          <span className="text-xs font-bold leading-none">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. EXPEDIENTE CLIENTE - FULL FORM DATA SUMMARY */}
                <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl space-y-6">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
                    <FileText className="w-4 h-4 text-us-blue" /> Información Detallada Diligenciada por el Solicitante
                  </h3>

                  {/* Accordion list items categorized */}
                  <div className="space-y-4">
                    
                    {/* A. Datos Personales */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Datos Personales y de Pasaporte</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <p><span className="text-slate-400 block font-bold">Nombre Completo:</span> <span className="text-white font-semibold">{activeExpediente.state.personalData.fullName}</span></p>
                        <p><span className="text-slate-400 block font-bold">Fecha de Nacimiento:</span> <span className="text-white font-semibold">{activeExpediente.state.personalData.birthDate}</span></p>
                        <p><span className="text-slate-400 block font-bold">Género:</span> <span className="text-white font-semibold">{activeExpediente.state.personalData.gender}</span></p>
                        <p><span className="text-slate-400 block font-bold">Lugar de Nacimiento:</span> <span className="text-white font-semibold">{activeExpediente.state.personalData.birthPlace}</span></p>
                        <p><span className="text-slate-400 block font-bold">Nacionalidad:</span> <span className="text-white font-semibold">{activeExpediente.state.personalData.nationality}</span></p>
                        <p><span className="text-slate-400 block font-bold">Dirección Residencial:</span> <span className="text-white font-semibold">{activeExpediente.state.addressContact.residenceAddress}</span></p>
                        <p><span className="text-slate-400 block font-bold">Pasaporte N°:</span> <span className="text-white font-semibold">{activeExpediente.state.passportData.passportNumber}</span></p>
                        <p><span className="text-slate-400 block font-bold">Expedición / Vence:</span> <span className="text-white font-semibold">{activeExpediente.state.passportData.expeditionDate} / {activeExpediente.state.passportData.expirationDate}</span></p>
                      </div>
                    </div>

                    {/* B. Planes de Viaje */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Viaje e Información de Estadía</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <p><span className="text-slate-400 block font-bold">Fecha de Viaje Prevista:</span> <span className="text-white font-semibold">{activeExpediente.state.travelInfo.tentativeTravelDate || 'Ninguna'}</span></p>
                        <p><span className="text-slate-400 block font-bold">Propósito del viaje:</span> <span className="text-white font-semibold">{activeExpediente.state.travelInfo.travelPurpose}</span></p>
                        <p><span className="text-slate-400 block font-bold">¿Quién costea el viaje?:</span> <span className="text-white font-semibold">{activeExpediente.state.travelInfo.travelPayer}</span></p>
                        {activeExpediente.state.travelInfo.travelPayer !== 'Mismo solicitante' && (
                          <p><span className="text-slate-400 block font-bold">Nombre del Patrocinador:</span> <span className="text-white font-semibold">{activeExpediente.state.travelInfo.payerFirstName} {activeExpediente.state.travelInfo.payerLastName} ({activeExpediente.state.travelInfo.payerRelationship})</span></p>
                        )}
                        <p><span className="text-slate-400 block font-bold">¿Tiene Contacto en USA?:</span> <span className="text-white font-semibold">{activeExpediente.state.usContact.hasContact}</span></p>
                        <p><span className="text-slate-400 block font-bold">Detalle de Hospedaje / Contacto en USA:</span> <span className="text-white font-semibold">{activeExpediente.state.usContact.name} ({activeExpediente.state.usContact.relationship || 'Hospedaje'})</span></p>
                        <p><span className="text-slate-400 block font-bold">Dirección en USA:</span> <span className="text-white font-semibold">{activeExpediente.state.usContact.address}</span></p>
                        <p><span className="text-slate-400 block font-bold">Teléfono Hospedaje / Contacto:</span> <span className="text-white font-semibold">{activeExpediente.state.usContact.phone}</span></p>
                      </div>
                    </div>

                    {/* C. Cónyuge e Hijos */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <Tag className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Lazos Civiles, Cónyuge e Hijos</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <p><span className="text-slate-400 block font-bold">Estado Marital / Civil:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.civilStatus}</span></p>
                        {activeExpediente.state.spouseChildren.civilStatus !== 'Soltero(a)' && (
                          <>
                            <p><span className="text-slate-400 block font-bold">Nombre Completo Cónyuge:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.spouseFirstName} {activeExpediente.state.spouseChildren.spouseLastName}</span></p>
                            <p><span className="text-slate-400 block font-bold">Fecha de nacimiento de Cónyuge:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.spouseBirthDate || 'N/A'}</span></p>
                          </>
                        )}
                        
                        {(activeExpediente.state.spouseChildren.civilStatus === 'Separado(a)' || activeExpediente.state.spouseChildren.civilStatus === 'Divorciado(a)') && (
                          <>
                            <p><span className="text-slate-400 block font-bold">Motivo de Separación:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.separationReason || 'N/A'}</span></p>
                            <p><span className="text-slate-400 block font-bold">Fecha de Separación:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.separationDate || 'N/A'}</span></p>
                          </>
                        )}
                        
                        <p><span className="text-slate-400 block font-bold">¿Tiene hijos?:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.hasChildren}</span></p>
                        {activeExpediente.state.spouseChildren.hasChildren === 'Si' && (
                          <p><span className="text-slate-400 block font-bold">Cuántos hijos:</span> <span className="text-white font-semibold">{activeExpediente.state.spouseChildren.childrenCount}</span></p>
                        )}
                      </div>
                    </div>

                    {/* D. Situación Laboral */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Historial y Situación Laboral Activa</span>
                      </div>
                      
                      <div className="text-xs gap-4 mb-2">
                        <p><span className="text-slate-400 font-bold">Situación Laboral actual:</span> <span className="text-white font-black">{activeExpediente.state.currentJob.workStatus || 'Trabajando'}</span></p>
                      </div>

                      {activeExpediente.state.currentJob.workStatus !== 'Pensionado' ? (
                        <div className="grid md:grid-cols-2 gap-4 text-xs mt-3">
                          <p><span className="text-slate-400 block font-bold">Ocupación / Cargo:</span> <span className="text-white font-semibold">{activeExpediente.state.currentJob.occupation}</span></p>
                          <p><span className="text-slate-400 block font-bold">Empresa/Empleador:</span> <span className="text-white font-semibold">{activeExpediente.state.currentJob.companyName}</span></p>
                          <p><span className="text-slate-400 block font-bold">Salario Mensual:</span> <span className="text-white font-semibold">{activeExpediente.state.currentJob.monthlySalary}</span></p>
                          <p><span className="text-slate-400 block font-bold">Fecha de ingreso:</span> <span className="text-white font-semibold">{activeExpediente.state.currentJob.startDate}</span></p>
                          <p className="md:col-span-2"><span className="text-slate-400 block font-bold">Dirección / Teléfono del Trabajo:</span> <span className="text-white font-semibold">{activeExpediente.state.currentJob.workAddress} / Tel: {activeExpediente.state.currentJob.workPhone}</span></p>
                          
                          {activeExpediente.state.currentJob.duty1 && (
                            <div className="md:col-span-2 bg-slate-900 p-2.5 rounded-lg border border-slate-850 space-y-1 mt-2">
                              <span className="text-[10px] uppercase font-black tracking-widest text-[#2c7df7]">Funciones Principales:</span>
                              <ol className="list-decimal pl-4 space-y-1 mt-1 text-[11px] text-slate-350 font-medium">
                                <li>{activeExpediente.state.currentJob.duty1}</li>
                                {activeExpediente.state.currentJob.duty2 && <li>{activeExpediente.state.currentJob.duty2}</li>}
                                {activeExpediente.state.currentJob.duty3 && <li>{activeExpediente.state.currentJob.duty3}</li>}
                              </ol>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-blue-950/20 text-blue-350 border border-blue-900/30 p-3 rounded-lg text-xs mt-2 font-bold select-none">
                          Individuo jubilado legalmente. No registra relación de empleo activo obligatoria.
                        </div>
                      )}
                    </div>

                    {/* E. Estudios */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Historial de Educación y Estudios</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        <p className="mb-2"><span className="font-bold text-slate-400">¿Posee estudios secundarios o profesionales?:</span> <span className="text-white font-bold">{activeExpediente.state.education.hasEducation}</span></p>
                        
                        {activeExpediente.state.education.hasEducation === 'Si' && activeExpediente.state.education.studies.length > 0 && (
                          <div className="space-y-4 mt-3">
                            {activeExpediente.state.education.studies.map((inst, index) => (
                              <div key={index} className="bg-slate-900 p-3 rounded-lg border border-slate-850 space-y-1.5">
                                <p className="font-bold text-white uppercase text-[10px] text-[#2c7df7]">Institución #{index + 1}:</p>
                                <p><span className="font-bold text-slate-400">Centro Educativo:</span> <span className="text-white font-semibold">{inst.institutionName}</span></p>
                                <p><span className="font-bold text-slate-400">Título Obtenido / Grado:</span> <span className="text-white font-semibold">{inst.degreeEarned}</span></p>
                                <p><span className="font-bold text-slate-400">Dirección de Sede:</span> <span className="text-white font-semibold">{inst.institutionAddress || 'N/A'}</span></p>
                                <p><span className="font-bold text-slate-400">Ciudad de Sede:</span> <span className="text-white font-semibold">{inst.institutionCity || 'N/A'}</span></p>
                                <p><span className="font-bold text-slate-400">Teléfono Contacto:</span> <span className="text-white font-semibold">{inst.institutionPhone || 'N/A'}</span></p>
                                <p><span className="font-bold text-slate-400">Fechas Cursado:</span> <span className="text-white font-semibold">{inst.startDate} a {inst.endDate}</span></p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* F. Historial de viajes a USA */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Historial de viajes americanos y mundiales</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <p><span className="text-slate-400 block font-bold">¿Ha viajado a USA antes?:</span> <span className="text-white font-semibold">{activeExpediente.state.usTravelHistory.hasTraveledBefore}</span></p>
                        {activeExpediente.state.usTravelHistory.hasTraveledBefore === 'Si' && (
                          <div className="md:col-span-2 bg-slate-900 p-3 rounded-xl space-y-2 mt-1">
                            <span className="font-bold block text-slate-400 text-[10px]">Viajes recientes:</span>
                            {activeExpediente.state.usTravelHistory.entries.map((entry, idx) => (
                              <p key={idx} className="border-b border-slate-800 pb-1.5 last:border-b-0">
                                Viaje {idx+1}: <strong className="text-white">{entry.entryDate}</strong> al <strong className="text-white">{entry.exitDate}</strong> ({entry.daysStayed} días estadía)
                              </p>
                            ))}
                          </div>
                        )}
                        <p className="md:col-span-2"><span className="text-slate-400 block font-bold">¿Tiene Visa Americana previa?:</span> <span className="text-white font-semibold">{activeExpediente.state.previousVisa.hasPreviousVisa}</span></p>
                        {activeExpediente.state.previousVisa.hasPreviousVisa === 'Si' && (
                          <div className="md:col-span-2 bg-slate-900 p-3 rounded-xl grid md:grid-cols-3 gap-2 mt-1">
                            <p><span className="text-slate-450 block text-[9px] uppercase font-bold">Número Visa:</span> <strong className="text-white">{activeExpediente.state.previousVisa.visaNumber}</strong></p>
                            <p><span className="text-slate-455 block text-[9px] uppercase font-bold">Fecha Emisión:</span> <strong className="text-white">{activeExpediente.state.previousVisa.expeditionDate}</strong></p>
                            <p><span className="text-slate-455 block text-[9px] uppercase font-bold">Fecha Expiración:</span> <strong className="text-white">{activeExpediente.state.previousVisa.expirationDate}</strong></p>
                          </div>
                        )}
                        <p className="md:col-span-2"><span className="text-slate-400 block font-bold">Otros Países Visitados (Últimos 5 años):</span> <span className="text-white font-semibold">{activeExpediente.state.countriesVisited?.countries || 'Ninguno'}</span></p>
                      </div>
                    </div>

                    {/* G. Preguntas de seguridad */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2 text-us-blue border-b border-slate-850 pb-2 mb-3">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-wider">Preguntas de Seguridad</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-xs">
                        <p><span className="text-slate-400 block font-bold">¿Arrestado?:</span> <span className={activeExpediente.state.securityQuestions?.arrested === 'Si' ? 'text-us-red font-black' : 'text-slate-300 font-bold'}>{activeExpediente.state.securityQuestions?.arrested || 'No'}</span></p>
                        <p><span className="text-slate-400 block font-bold">¿Salud pública?:</span> <span className={activeExpediente.state.securityQuestions?.publicHealthIssues === 'Si' ? 'text-us-red font-black' : 'text-slate-300 font-bold'}>{activeExpediente.state.securityQuestions?.publicHealthIssues || 'No'}</span></p>
                        <p><span className="text-slate-400 block font-bold">¿Infracción de visa?:</span> <span className={activeExpediente.state.securityQuestions?.visaViolation === 'Si' ? 'text-us-red font-black' : 'text-slate-300 font-bold'}>{activeExpediente.state.securityQuestions?.visaViolation || 'No'}</span></p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-16">
              <Eye className="w-16 h-16 text-slate-700 animate-pulse mb-4" />
              <p className="text-sm font-bold">Seleccione un expediente de la parte izquierda para visualizar la Ficha de Gestión e Información DS-160.</p>
            </div>
          )}
        </section>

      </main>

      {/* Admin specific humble footer */}
      <footer className="bg-slate-950 border-t border-slate-850 py-3.5 px-6 text-center text-slate-500 text-xs mt-auto flex-shrink-0">
        <p>© 2026 Panel Consultor de Visado. Reservado exclusivamente para propósitos de gestión administrativa e intermediaria del formulario DS-160.</p>
      </footer>
    </div>
  );
}
