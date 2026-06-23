import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, FileText, User, MapPin, 
  Globe, Shield, Calendar, Award, Briefcase, Plus, Trash2, Heart, HeartCrack
} from 'lucide-react';
import { VisaApplicationState, initialFormState, USTravelEntry, PreviousJobEntry, EducationEntry, VisaExpediente } from '../types';
import { saveExpediente } from '../../services/visaService';

interface VisaWizardProps {
  onBackToLanding: () => void;
  logoUrl: string;
}

export default function VisaWizard({ onBackToLanding, logoUrl }: VisaWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<VisaApplicationState>(initialFormState);
  const [caseNumber, setCaseNumber] = useState<string | null>(null);

  // Handlers for adding/removing multiple records
  const addTravelEntry = () => {
    if (state.usTravelHistory.entries.length >= 5) return;
    const newEntry: USTravelEntry = { entryDate: '', exitDate: '', daysStayed: '' };
    setState(prev => ({
      ...prev,
      usTravelHistory: {
        ...prev.usTravelHistory,
        entries: [...prev.usTravelHistory.entries, newEntry]
      }
    }));
  };

  const removeTravelEntry = (index: number) => {
    setState(prev => ({
      ...prev,
      usTravelHistory: {
        ...prev.usTravelHistory,
        entries: prev.usTravelHistory.entries.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTravelEntry = (index: number, field: keyof USTravelEntry, value: string) => {
    setState(prev => {
      const updated = [...prev.usTravelHistory.entries];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        usTravelHistory: { ...prev.usTravelHistory, entries: updated }
      };
    });
  };

  const addJobEntry = () => {
    const newJob: PreviousJobEntry = {
      id: Math.random().toString(),
      companyName: '',
      position: '',
      supervisorName: '',
      startDate: '',
      endDate: ''
    };
    setState(prev => ({
      ...prev,
      previousJobs: {
        ...prev.previousJobs,
        jobs: [...prev.previousJobs.jobs, newJob]
      }
    }));
  };

  const removeJobEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      previousJobs: {
        ...prev.previousJobs,
        jobs: prev.previousJobs.jobs.filter(j => j.id !== id)
      }
    }));
  };

  const updateJobEntry = (id: string, field: keyof Omit<PreviousJobEntry, 'id'>, value: string) => {
    setState(prev => {
      const updated = prev.previousJobs.jobs.map(j => {
        if (j.id === id) {
          return { ...j, [field]: value };
        }
        return j;
      });
      return {
        ...prev,
        previousJobs: { ...prev.previousJobs, jobs: updated }
      };
    });
  };

  const addEducationEntry = () => {
    const newStudy: EducationEntry = {
      id: Math.random().toString(),
      institutionName: '',
      degreeEarned: '',
      startDate: '',
      endDate: '',
      institutionAddress: '',
      institutionCity: '',
      institutionPhone: ''
    };
    setState(prev => ({
      ...prev,
      education: {
        ...prev.education,
        studies: [...prev.education.studies, newStudy]
      }
    }));
  };

  const removeEducationEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      education: {
        ...prev.education,
        studies: prev.education.studies.filter(s => s.id !== id)
      }
    }));
  };

  const updateEducationEntry = (id: string, field: keyof Omit<EducationEntry, 'id'>, value: string) => {
    setState(prev => {
      const updated = prev.education.studies.map(s => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      });
      return {
        ...prev,
        education: { ...prev.education, studies: updated }
      };
    });
  };

  // Submit Flow
  const handleFinalSubmit = () => {
    // Generate dinamic case number like VISA-2026-000189
    const suffix = Math.floor(100000 + Math.random() * 900000);
    const id = `VISA-2026-${suffix}`;
    
    // Create new expediente object
    const newExpediente: VisaExpediente = {
      id,
      submissionDate: new Date().toISOString().split('T')[0],
      state: { ...state },
      ds160: {
        ds160Number: '',
        createdAtDate: '',
        formStatus: 'No iniciado'
      },
      checklist: {
        infoReceived: true, // Auto marked as we completed the wizard
        documentsUploaded: false,
        ds160Created: false,
        ds160Reviewed: false,
        consularFeesPaid: false,
        apptScheduled: false,
        interviewDone: false,
        visaApproved: false,
        caseClosed: false
      }
    };

    // Save expediente through data service
    saveExpediente(newExpediente).catch(e => {
      console.error('Error saving expediente:', e);
    });

    setCaseNumber(id);
    setCurrentStep(15); // Show success screen
  };

  const totalSteps = 14;
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / totalSteps) * 100));

  // Step Validation & Simple Next Check
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return state.personalData.fullName && state.personalData.birthDate && state.personalData.birthPlace;
      case 2:
        return state.addressContact.residenceAddress && state.addressContact.mobilePhone && state.addressContact.email;
      case 3:
        return state.passportData.passportNumber && state.passportData.expeditionDate && state.passportData.expirationDate;
      case 4:
        if (!state.travelInfo.tentativeTravelDate) return false;
        if (state.travelInfo.travelPayer === 'Familiar') {
          return !!(state.travelInfo.payerLastName?.trim() && state.travelInfo.payerFirstName?.trim() && state.travelInfo.payerRelationship);
        }
        return true;
      case 5:
        if (state.usContact.hasContact === '') return false;
        return !!(state.usContact.name?.trim() && state.usContact.address?.trim() && state.usContact.phone?.trim());
      case 6:
        if (state.usTravelHistory.hasTraveledBefore === '') return false;
        if (state.usTravelHistory.hasTraveledBefore === 'Si') {
          return state.usTravelHistory.entries.length > 0 && state.usTravelHistory.entries.every(e => e.entryDate && e.exitDate && e.daysStayed);
        }
        return true;
      case 7:
        if (state.previousVisa.hasPreviousVisa === '') return false;
        if (state.previousVisa.hasPreviousVisa === 'Si') {
          return state.previousVisa.visaNumber && state.previousVisa.expeditionDate && state.previousVisa.expirationDate;
        }
        return true;
      case 8:
        return state.familyInfo.fatherName && state.familyInfo.motherName;
      case 9:
        if (state.spouseChildren.civilStatus !== 'Soltero(a)') {
          if (!state.spouseChildren.spouseLastName?.trim() || !state.spouseChildren.spouseFirstName?.trim() || !state.spouseChildren.spouseBirthDate) {
            return false;
          }
          if (state.spouseChildren.civilStatus === 'Separado(a)' || state.spouseChildren.civilStatus === 'Divorciado(a)') {
            if (!state.spouseChildren.separationReason?.trim() || !state.spouseChildren.separationDate) {
              return false;
            }
          }
        }
        return state.spouseChildren.hasChildren !== '';
      case 10:
        if (state.currentJob.workStatus === 'Pensionado') {
          return true;
        }
        return !!(
          state.currentJob.occupation?.trim() &&
          state.currentJob.companyName?.trim() &&
          state.currentJob.monthlySalary?.trim() &&
          state.currentJob.workAddress?.trim() &&
          state.currentJob.workPhone?.trim() &&
          state.currentJob.startDate &&
          state.currentJob.duty1?.trim() &&
          state.currentJob.duty2?.trim() &&
          state.currentJob.duty3?.trim()
        );
      case 11:
        if (state.previousJobs.hasPreviousJobs === '') return false;
        if (state.previousJobs.hasPreviousJobs === 'Si') {
          return state.previousJobs.jobs.length > 0 && state.previousJobs.jobs.every(j => j.companyName && j.position);
        }
        return true;
      case 12:
        if (state.education.hasEducation === '') return false;
        if (state.education.hasEducation === 'Si') {
          return state.education.studies.length > 0 && state.education.studies.every(s => 
            s.institutionName?.trim() && 
            s.degreeEarned?.trim() && 
            s.institutionAddress?.trim() && 
            s.institutionCity?.trim() && 
            s.institutionPhone?.trim() && 
            s.startDate && 
            s.endDate
          );
        }
        return true;
      case 13:
        return true; // Optional countries visited
      case 14:
        return true;
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Datos Personales";
      case 2: return "Dirección y Contacto";
      case 3: return "Pasaporte";
      case 4: return "Información de Viaje";
      case 5: return "Contacto en Estados Unidos";
      case 6: return "Historial de Viajes a USA";
      case 7: return "Visa Americana Anterior";
      case 8: return "Información Familiar";
      case 9: return "Cónyuge e Hijos";
      case 10: return "Trabajo Actual";
      case 11: return "Trabajos Anteriores";
      case 12: return "Estudios";
      case 13: return "Países Visitados";
      case 14: return "Preguntas de Seguridad";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top bar with back button */}
        {currentStep <= 14 && (
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-slate-500 hover:text-us-blue font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </button>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-us-red animate-pulse" />
              Sesión Segura Encriptada
            </div>
          </div>
        )}

        {currentStep <= 14 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 md:p-10 relative overflow-hidden">
            {/* Top red/blue bars for authentic USA consulate design touches */}
            <div className="absolute top-0 left-0 w-full h-1.5 flex">
              <div className="bg-us-blue w-1/2 h-full" />
              <div className="bg-us-red w-1/2 h-full" />
            </div>

            {/* Header info */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-us-blue uppercase tracking-wider">
                  Trámite de Visa de No Inmigrante
                </span>
                <span className="text-sm font-bold text-slate-400">
                  Paso {currentStep} de {totalSteps}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                {getStepTitle()}
              </h1>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-us-blue to-us-red transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Form Section Views */}
            <div className="min-h-[300px] mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: -20, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* Step 1: Datos Personales */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre completo (Comenzar con Apellidos, luego Nombres, tal cual en pasaporte) *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Pérez Gómez Juan Carlos"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                          value={state.personalData.fullName}
                          onChange={e => setState({ ...state, personalData: { ...state.personalData, fullName: e.target.value } })}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de nacimiento *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.personalData.birthDate}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, birthDate: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Género *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                            value={state.personalData.gender}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, gender: e.target.value } })}
                          >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro / No binario</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Lugar de nacimiento (Ciudad y Estado/Depto) *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Bogotá, D.C."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.personalData.birthPlace}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, birthPlace: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Nacionalidad actual *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Colombia"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.personalData.nationality}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, nationality: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Dirección y Contacto */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Dirección de residencia completa *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Calle, avenida, apto, conjunto, ciudad"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                          value={state.addressContact.residenceAddress}
                          onChange={e => setState({ ...state, addressContact: { ...state.addressContact, residenceAddress: e.target.value } })}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono celular *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="+57 321 000 0000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.addressContact.mobilePhone}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, mobilePhone: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Correo electrónico *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="ejemplo@correo.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.addressContact.email}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, email: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Pasaporte */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Número de pasaporte *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Número único con letras/números"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                          value={state.passportData.passportNumber}
                          onChange={e => setState({ ...state, passportData: { ...state.passportData, passportNumber: e.target.value } })}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de expedición *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.passportData.expeditionDate}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, expeditionDate: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de vencimiento *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.passportData.expirationDate}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, expirationDate: e.target.value } })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">País de emisión *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Colombia"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                          value={state.passportData.issuingCountry}
                          onChange={e => setState({ ...state, passportData: { ...state.passportData, issuingCountry: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Información de Viaje */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha tentativa de viaje *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                            value={state.travelInfo.tentativeTravelDate}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, tentativeTravelDate: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Propósito del viaje *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                            value={state.travelInfo.travelPurpose}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelPurpose: e.target.value } })}
                          >
                            <option value="Turismo (B2)">Turismo / Tratamiento Médico (B2)</option>
                            <option value="Negocios (B1)">Negocios / Conferencias (B1)</option>
                            <option value="Estudios (F1)">Estudios (F1)</option>
                            <option value="Tránsito (C)">Tránsito directo (C)</option>
                            <option value="Otro">Otro propósito</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Quién pagará los gastos de tu viaje? *</label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                          value={state.travelInfo.travelPayer}
                          onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelPayer: e.target.value } })}
                        >
                          <option value="Mismo solicitante">Tú mismo (Mismo solicitante)</option>
                          <option value="Familiar">Un familiar directo (Padre, Madre, Cónyuge)</option>
                          <option value="Empresa">Tu empresa / Empleador</option>
                          <option value="Otra Persona">Otra persona u organización</option>
                        </select>
                      </div>

                      {state.travelInfo.travelPayer === 'Familiar' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6 animate-fadeIn">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Datos del Familiar que Paga</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Apellidos *</label>
                              <input 
                                type="text"
                                required
                                placeholder="Ej. Pérez Gómez"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.travelInfo.payerLastName || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerLastName: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre *</label>
                              <input 
                                type="text"
                                required
                                placeholder="Ej. Juan Carlos"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.travelInfo.payerFirstName || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerFirstName: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Parentesco *</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.travelInfo.payerRelationship || 'Padre'}
                              onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerRelationship: e.target.value } })}
                            >
                              <option value="Padre">Padre</option>
                              <option value="Madre">Madre</option>
                              <option value="Hermano">Hermano</option>
                              <option value="Cónyuge">Cónyuge</option>
                              <option value="Otros">Otros</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 5: Contacto en Estados Unidos */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Tiene un contacto o establecimiento que lo recibirá en Estados Unidos? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No (Iré a un hotel / turismo general)' },
                            { value: 'Si', label: 'Sí (Tengo un familiar, amigo, contacto o empresa)' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                if (state.usContact.hasContact !== opt.value) {
                                  setState({ 
                                    ...state, 
                                    usContact: { 
                                      hasContact: opt.value as 'Si' | 'No',
                                      name: '',
                                      address: '',
                                      phone: '',
                                      email: '',
                                      relationship: 'Familiar',
                                      legalStatus: 'Ciudadano'
                                    } 
                                  });
                                }
                              }}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.usContact.hasContact === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.usContact.hasContact === 'No' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6 animate-fadeIn">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Detalles del Hotel o Hospedaje en USA</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Nombre del Hotel / Hospedaje *</label>
                              <input 
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                value={state.usContact.name || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, name: e.target.value } })}
                                placeholder="Ej. Hilton Midtown New York"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Teléfono del Hotel *</label>
                              <input 
                                type="tel"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                value={state.usContact.phone || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, phone: e.target.value } })}
                                placeholder="Ej. +1 212-555-0199"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Dirección Completa en USA (Dirección, Ciudad, Estado) *</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                              value={state.usContact.address || ''}
                              onChange={e => setState({ ...state, usContact: { ...state.usContact, address: e.target.value } })}
                              placeholder="Ej. 1335 Avenue of the Americas, New York, NY 10019"
                            />
                          </div>
                        </div>
                      )}

                      {state.usContact.hasContact === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6 animate-fadeIn">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Detalles del Contacto en USA</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Nombre Completo del Contacto / Institución *</label>
                              <input 
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.name || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, name: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Relación con usted *</label>
                              <select 
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.relationship || 'Familiar'}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, relationship: e.target.value } })}
                              >
                                <option value="Familiar">Familiar</option>
                                <option value="Amigo">Amigo</option>
                                <option value="Socio de negocios">Socio de negocios</option>
                                <option value="Representante de escuela">Representante de escuela / Universidad</option>
                                <option value="Otro">Otro</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Dirección Completa en USA *</label>
                            <input 
                              type="text"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.usContact.address || ''}
                              onChange={e => setState({ ...state, usContact: { ...state.usContact, address: e.target.value } })}
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Teléfono *</label>
                              <input 
                                type="tel"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.phone || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, phone: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Correo electrónico</label>
                              <input 
                                type="email"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.email || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, email: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Estatus legal en USA</label>
                              <select 
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.legalStatus || 'Ciudadano'}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, legalStatus: e.target.value } })}
                              >
                                <option value="Ciudadano">Ciudadano Americano</option>
                                <option value="Residente">Residente Legal (Green Card)</option>
                                <option value="No Inmigrante">No Inmigrante (Visa de estudio/trabajo)</option>
                                <option value="Otro">Otro / Empresa</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Historial de Viajes a USA */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Ha viajado anteriormente a los Estados Unidos? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No (Soy primerizo)' },
                            { value: 'Si', label: 'Sí (He viajado anteriormente)' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                const newEntries = opt.value === 'Si' && state.usTravelHistory.entries.length === 0 
                                  ? [{ entryDate: '', exitDate: '', daysStayed: '' }] 
                                  : state.usTravelHistory.entries;
                                setState({ 
                                  ...state, 
                                  usTravelHistory: { hasTraveledBefore: opt.value as 'Si' | 'No', entries: newEntries } 
                                });
                              }}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.usTravelHistory.hasTraveledBefore === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.usTravelHistory.hasTraveledBefore === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Últimos viajes a USA (Máximo 5)</h4>
                            {state.usTravelHistory.entries.length < 5 && (
                              <button
                                type="button"
                                onClick={addTravelEntry}
                                className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" /> Agregar Entrada
                              </button>
                            )}
                          </div>

                          {state.usTravelHistory.entries.map((entry, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 relative">
                              {state.usTravelHistory.entries.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTravelEntry(idx)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-us-red"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <p className="text-xs font-bold text-slate-400 mb-3 uppercase">Entrada #{idx + 1}</p>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de ingreso *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-us-blue text-sm"
                                    value={entry.entryDate}
                                    onChange={e => updateTravelEntry(idx, 'entryDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de salida *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-us-blue text-sm"
                                    value={entry.exitDate}
                                    onChange={e => updateTravelEntry(idx, 'exitDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Permanencia (En días) *</label>
                                  <input 
                                    type="number"
                                    placeholder="Ej. 15"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-us-blue text-sm"
                                    value={entry.daysStayed}
                                    onChange={e => updateTravelEntry(idx, 'daysStayed', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 7: Visa Americana Anterior */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Ha tenido visa americana anteriormente? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No' },
                            { value: 'Si', label: 'Sí' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setState({ ...state, previousVisa: { ...state.previousVisa, hasPreviousVisa: opt.value as 'Si' | 'No' } })}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.previousVisa.hasPreviousVisa === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.previousVisa.hasPreviousVisa === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Detalles de la Visa Anterior</h4>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Número de Visa (8 dígitos rojos en la parte inferior derecha) *</label>
                            <input 
                              type="text"
                              placeholder="Ej. 12345678"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.previousVisa.visaNumber || ''}
                              onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, visaNumber: e.target.value } })}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Fecha de expedición *</label>
                              <input 
                                type="date"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.previousVisa.expeditionDate || ''}
                                onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, expeditionDate: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Fecha de vencimiento o expiración *</label>
                              <input 
                                type="date"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.previousVisa.expirationDate || ''}
                                onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, expirationDate: e.target.value } })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 8: Información Familiar */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Información del Padre</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Nombre Completo *</label>
                            <input 
                              type="text"
                              placeholder="Nombre y Apellidos"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.familyInfo.fatherName}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, fatherName: e.target.value } })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de nacimiento</label>
                            <input 
                              type="date"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.familyInfo.fatherBirthDate}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, fatherBirthDate: e.target.value } })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Información de la Madre</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Nombre Completo *</label>
                            <input 
                              type="text"
                              placeholder="Nombre y Apellidos de Soltera"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.familyInfo.motherName}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, motherName: e.target.value } })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de nacimiento</label>
                            <input 
                              type="date"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                              value={state.familyInfo.motherBirthDate}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, motherBirthDate: e.target.value } })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 9: Cónyuge e Hijos */}
                  {currentStep === 9 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Estado civil o Marital *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                            value={state.spouseChildren.civilStatus}
                            onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, civilStatus: e.target.value } })}
                          >
                            <option value="Soltero(a)">Soltero(a)</option>
                            <option value="Casado(a)">Casado(a)</option>
                            <option value="Separado(a)">Separado(a)</option>
                            <option value="Divorciado(a)">Divorciado(a)</option>
                            <option value="Viudo(a)">Viudo(a)</option>
                            <option value="Unión Libre">Unión Libre / Conviviente</option>
                          </select>
                        </div>
                      </div>

                      {state.spouseChildren.civilStatus !== 'Soltero(a)' && (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6 animate-fadeIn">
                          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                            {state.spouseChildren.civilStatus === 'Separado(a)' || state.spouseChildren.civilStatus === 'Divorciado(a)'
                              ? 'Datos de Ex-Cónyuge *'
                              : state.spouseChildren.civilStatus === 'Viudo(a)'
                              ? 'Datos de Cónyuge Fallecido/a *'
                              : state.spouseChildren.civilStatus === 'Unión Libre'
                              ? 'Datos de Conviviente / Pareja *'
                              : 'Datos de Cónyuge *'}
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Apellidos *</label>
                              <input 
                                type="text"
                                required
                                placeholder="Ej. Pérez Gómez"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                value={state.spouseChildren.spouseLastName || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseLastName: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Nombre *</label>
                              <input 
                                type="text"
                                required
                                placeholder="Ej. Juan Carlos"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                value={state.spouseChildren.spouseFirstName || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseFirstName: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Fecha de nacimiento *</label>
                              <input 
                                type="date"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                value={state.spouseChildren.spouseBirthDate || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseBirthDate: e.target.value } })}
                              />
                            </div>
                          </div>

                          {(state.spouseChildren.civilStatus === 'Separado(a)' || state.spouseChildren.civilStatus === 'Divorciado(a)') && (
                            <div className="pt-4 border-t border-slate-200 space-y-6">
                              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Detalles de la Separación / Divorcio</h5>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-2">Motivo de separación *</label>
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Ej. Divorcio de mutuo acuerdo, separación de hecho"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                    value={state.spouseChildren.separationReason || ''}
                                    onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, separationReason: e.target.value } })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-2">Fecha de separación *</label>
                                  <input 
                                    type="date"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm font-semibold text-slate-900"
                                    value={state.spouseChildren.separationDate || ''}
                                    onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, separationDate: e.target.value } })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Tiene hijos? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No' },
                            { value: 'Si', label: 'Sí generé descendientes' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setState({ ...state, spouseChildren: { ...state.spouseChildren, hasChildren: opt.value as 'Si' | 'No' } })}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.spouseChildren.hasChildren === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.spouseChildren.hasChildren === 'Si' && (
                        <div className="p-4 bg-slate-100 rounded-2xl">
                          <label className="block text-xs font-bold text-slate-600 mb-1">Número de hijos *</label>
                          <input 
                            type="number"
                            min="1"
                            className="w-32 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-us-blue text-sm"
                            value={state.spouseChildren.childrenCount || 1}
                            onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, childrenCount: parseInt(e.target.value) || 0 } })}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 10: Trabajo Actual */}
                  {currentStep === 10 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Situación Laboral Actual *</label>
                        <div className="flex gap-4">
                          {[
                            { value: 'Trabajando', label: 'Trabajo actualmente / Independiente' },
                            { value: 'Pensionado', label: 'Pensionado / Jubilado' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setState({ 
                                ...state, 
                                currentJob: { 
                                  ...state.currentJob, 
                                  workStatus: opt.value as 'Trabajando' | 'Pensionado'
                                } 
                              })}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.currentJob.workStatus === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.currentJob.workStatus === 'Pensionado' && (
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl space-y-3 animate-fadeIn">
                          <p className="text-sm font-semibold text-us-blue">退休 / Pensionado</p>
                          <p className="text-sm text-slate-600">
                            Usted ha seleccionado su estado laboral actual como <strong>Pensionado / Jubilado</strong>. En este estado civil, la información de empleo activo no es requerida para el formulario oficial. Puede continuar al siguiente paso de forma segura.
                          </p>
                        </div>
                      )}

                      {state.currentJob.workStatus === 'Trabajando' && (
                        <div className="space-y-6 animate-fadeIn">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Ocupación / Oficio actual *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Ingeniero, Profesor, Independiente"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.occupation}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, occupation: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa o Institución *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Google Colombia / Trabajador Independiente"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.companyName}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, companyName: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Salario mensual estimado (Pesos o Moneda Local) *</label>
                              <input 
                                type="text"
                                placeholder="Ej. $4.500.000 COP"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.monthlySalary}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, monthlySalary: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de ingreso a laborar *</label>
                              <input 
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.startDate}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, startDate: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Dirección del Trabajo *</label>
                              <input 
                                type="text"
                                placeholder="Dirección Física"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.workAddress}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, workAddress: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono de Oficina / Trabajo *</label>
                              <input 
                                type="tel"
                                placeholder="Número con indicativo"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                value={state.currentJob.workPhone}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, workPhone: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Principales funciones que desempeña *</h4>
                            <p className="text-xs text-slate-500 mb-2">Describa de forma clara al menos 3 funciones claves que realiza en su puesto laboral:</p>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Función #1 *</label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="Ej. Supervisión y control de inventario de mercancía"
                                  className="w-full px-4 py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                  value={state.currentJob.duty1 || ''}
                                  onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty1: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Función #2 *</label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="Ej. Elaboración y presentación de reportes financieros mensuales"
                                  className="w-full px-4 py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                  value={state.currentJob.duty2 || ''}
                                  onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty2: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Función #3 *</label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="Ej. Coordinación de relaciones con proveedores locales"
                                  className="w-full px-4 py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm font-semibold text-slate-900 bg-white"
                                  value={state.currentJob.duty3 || ''}
                                  onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty3: e.target.value } })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 11: Trabajos Anteriores */}
                  {currentStep === 11 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Ha tenido empleos anteriores en los últimos 5 años? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No' },
                            { value: 'Si', label: 'Sí (He tenido otros empleos)' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                const newJobs = opt.value === 'Si' && state.previousJobs.jobs.length === 0
                                  ? [{ id: Math.random().toString(), companyName: '', position: '', supervisorName: '', startDate: '', endDate: '' }]
                                  : state.previousJobs.jobs;
                                setState({ 
                                  ...state, 
                                  previousJobs: { hasPreviousJobs: opt.value as 'Si' | 'No', jobs: newJobs } 
                                });
                              }}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.previousJobs.hasPreviousJobs === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.previousJobs.hasPreviousJobs === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Empleos anteriores</h4>
                            <button
                              type="button"
                              onClick={addJobEntry}
                              className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                            >
                              <Plus className="w-3.5 h-3.5" /> Agregar Empleo
                            </button>
                          </div>

                          {state.previousJobs.jobs.map((job, idx) => (
                            <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-200 relative space-y-4">
                              {state.previousJobs.jobs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeJobEntry(job.id)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-us-red"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <p className="text-xs font-bold text-slate-400 uppercase">Empleo #{idx + 1}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Nombre de la Empresa *</label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue"
                                    value={job.companyName}
                                    onChange={e => updateJobEntry(job.id, 'companyName', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Cargo / Puesto *</label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue"
                                    value={job.position}
                                    onChange={e => updateJobEntry(job.id, 'position', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Nombre de supervisor</label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue"
                                    value={job.supervisorName}
                                    onChange={e => updateJobEntry(job.id, 'supervisorName', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de Inicio *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue"
                                    value={job.startDate}
                                    onChange={e => updateJobEntry(job.id, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de Fin *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue"
                                    value={job.endDate}
                                    onChange={e => updateJobEntry(job.id, 'endDate', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 12: Estudios */}
                  {currentStep === 12 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Tiene estudios secundarios u otros estudios profesionales/técnicos? *</span>
                        <div className="flex gap-4">
                          {[
                            { value: 'No', label: 'No' },
                            { value: 'Si', label: 'Sí (Bachillerato, universidad, tecnológico etc.)' }
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                const newStudies = opt.value === 'Si' && state.education.studies.length === 0
                                  ? [{ 
                                      id: Math.random().toString(), 
                                      institutionName: '', 
                                      degreeEarned: '', 
                                      startDate: '', 
                                      endDate: '',
                                      institutionAddress: '',
                                      institutionCity: '',
                                      institutionPhone: ''
                                    }]
                                  : state.education.studies;
                                setState({ 
                                  ...state, 
                                  education: { hasEducation: opt.value as 'Si' | 'No', studies: newStudies } 
                                });
                              }}
                              className={`flex-1 py-4 px-6 rounded-2xl border text-left transition-all font-bold ${
                                state.education.hasEducation === opt.value 
                                ? 'border-us-blue bg-blue-50/50 text-us-blue' 
                                : 'border-slate-250 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.education.hasEducation === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Instituciones académicas</h4>
                            <button
                              type="button"
                              onClick={addEducationEntry}
                              className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                            >
                              <Plus className="w-3.5 h-3.5" /> Agregar Estudio
                            </button>
                          </div>

                          {state.education.studies.map((study, idx) => (
                            <div key={study.id} className="bg-white p-4 rounded-2xl border border-slate-200 relative space-y-4">
                              {state.education.studies.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEducationEntry(study.id)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-us-red"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              <p className="text-xs font-bold text-slate-400 uppercase">Institución #{idx + 1}</p>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Nombre de Institución *</label>
                                  <input 
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.institutionName}
                                    onChange={e => updateEducationEntry(study.id, 'institutionName', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Título / Programas de Grado *</label>
                                  <input 
                                    type="text"
                                    placeholder="Ej. Bachiller / Ingeniero de Sistemas"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.degreeEarned}
                                    onChange={e => updateEducationEntry(study.id, 'degreeEarned', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Dirección de la Institución *</label>
                                  <input 
                                    type="text"
                                    placeholder="Ej. Calle 10 # 5-20"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.institutionAddress || ''}
                                    onChange={e => updateEducationEntry(study.id, 'institutionAddress', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Ciudad *</label>
                                  <input 
                                    type="text"
                                    placeholder="Ej. Medellín"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.institutionCity || ''}
                                    onChange={e => updateEducationEntry(study.id, 'institutionCity', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Teléfono de la Institución *</label>
                                  <input 
                                    type="tel"
                                    placeholder="Ej. 6043334455"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.institutionPhone || ''}
                                    onChange={e => updateEducationEntry(study.id, 'institutionPhone', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de Inicio *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.startDate}
                                    onChange={e => updateEducationEntry(study.id, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de Fin / Graduación *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-us-blue font-semibold text-slate-900 bg-white"
                                    value={study.endDate}
                                    onChange={e => updateEducationEntry(study.id, 'endDate', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 13: Países Visitados */}
                  {currentStep === 13 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Países visitados en los últimos 5 años</label>
                        <p className="text-xs text-slate-500 mb-3">Escriba una lista de los países que ha visitado de vacaciones o negocios separados por comas. Deje en blanco si no ha viajado fuera de su país.</p>
                        <textarea 
                          placeholder="Ej. México, España, Panamá, Canadá"
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue"
                          value={state.countriesVisited.countries}
                          onChange={e => setState({ ...state, countriesVisited: { countries: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 14: Preguntas de Seguridad */}
                  {currentStep === 14 && (
                    <div className="space-y-6">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-red-50 text-us-red p-3 rounded-xl border border-red-100 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Preguntas obligatorias de seguridad nacional DS-160
                      </p>

                      {[
                        {
                          key: 'arrested',
                          label: '¿Ha sido arrestado o condenado por algún delito o crimen en el pasado?'
                        },
                        {
                          key: 'publicHealthIssues',
                          label: '¿Tiene alguna enfermedad transmisible de importancia para la salud pública?'
                        },
                        {
                          key: 'visaViolation',
                          label: '¿Ha violado alguna vez los términos de una visa estadounidense, trabajado ilegalmente o sobrepasado el tiempo de permanencia?'
                        }
                      ].map(q => (
                        <div key={q.key} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed md:max-w-[70%]">
                            {q.label}
                          </p>
                          <div className="flex gap-2 w-full md:w-auto">
                            {['No', 'Si'].map(ans => (
                              <button
                                key={ans}
                                type="button"
                                onClick={() => setState({
                                  ...state,
                                  securityQuestions: {
                                    ...state.securityQuestions,
                                    [q.key]: ans as 'Si' | 'No'
                                  }
                                })}
                                className={`flex-1 md:flex-initial py-2 px-8 rounded-xl font-bold border transition-all text-sm ${
                                  state.securityQuestions[q.key as keyof typeof state.securityQuestions] === ans
                                  ? ans === 'No' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-100 border-red-300 text-red-700'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {ans}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center border-t border-slate-150 pt-6">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    onBackToLanding();
                  }
                }}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-bold text-sm px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>

              {currentStep < 14 ? (
                <button
                  type="button"
                  disabled={!canGoNext()}
                  onClick={() => {
                    if (canGoNext()) {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className={`cta-button inline-flex items-center justify-center font-bold relative px-6 py-3 rounded-full text-white text-sm transition-all focus:outline-none ${
                    canGoNext() 
                    ? 'bg-us-blue hover:bg-blue-900 shadow-md cursor-pointer' 
                    : 'bg-slate-350 cursor-not-allowed opacity-50'
                  }`}
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="cta-button cta-primary inline-flex items-center justify-center font-bold px-8 py-3 rounded-full text-white text-sm shadow-md cursor-pointer"
                >
                  Enviar Formulario <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          
          /* Step 15: PÁGINA FINAL (SOLICITUD RECIBIDA) */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 flex">
              <div className="bg-us-blue w-1/2 h-full" />
              <div className="bg-us-red w-1/2 h-full" />
            </div>

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Solicitud recibida correctamente
            </h1>

            <div className="inline-block bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200 mb-8">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Número de caso asignado
              </span>
              <span className="font-mono text-xl md:text-2xl font-bold text-us-blue tracking-wider">
                {caseNumber}
              </span>
            </div>

            <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
              Tu información ha sido encriptada y cargada exitosamente a nuestro sistema de procesamiento consular. 
              <strong className="block text-us-blue mt-4">Uno de nuestros asesores expertos revisará la información y continuará con tu proceso de acompañamiento.</strong>
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-250 max-w-xl mx-auto mb-8 text-left space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Siguientes pasos:</p>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="bg-us-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Tu analista asignado hará control de calidad de la información para evitar inconsistencias en el DS-160.</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="bg-us-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Se te notificará por correo y WhatsApp para acordar la cita y sesión de preparación presencial/virtual.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onBackToLanding}
                className="cta-button cta-secondary w-full sm:w-auto"
              >
                Volver al Inicio
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
