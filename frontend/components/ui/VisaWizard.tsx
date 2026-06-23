import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, FileText, User, MapPin, 
  Globe, Shield, Calendar, Award, Briefcase, Plus, Trash2, Heart, HeartCrack, Globe2
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
    if (state.usTravelHistory.entries.length >= 10) return; // Permite al menos 5 o hasta 10 registros
    const newEntry: USTravelEntry = { entryDate: '', exitDate: '', daysStayed: '', cityVisited: '' };
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
      endDate: '',
      companyAddress: '',
      companyPhone: ''
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
    const suffix = Math.floor(100000 + Math.random() * 900000);
    const id = `VISA-2026-${suffix}`;
    
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
    };

    saveExpediente(newExpediente).catch(e => {
      console.error('Error saving expediente:', e);
    });

    setCaseNumber(id);
    setCurrentStep(15); // Success screen
  };

  const totalSteps = 14;
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / totalSteps) * 100));

  // Validation
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        if (!state.personalData.fullName || !state.personalData.birthDate || !state.personalData.birthPlace || !state.personalData.nationalIdentityNumber) return false;
        if (state.personalData.hasOtherNationality === 'Si' && !state.personalData.otherNationalityDetails) return false;
        return true;
      case 2:
        if (!state.addressContact.residenceAddress || !state.addressContact.residenceCity || !state.addressContact.residenceState || !state.addressContact.mobilePhone || !state.addressContact.email) return false;
        if (state.addressContact.hasOtherEmail === 'Si' && !state.addressContact.otherEmail) return false;
        if (state.addressContact.hasSocialMedia === 'Si' && !state.addressContact.socialMediaLink) return false;
        return true;
      case 3:
        if (!state.passportData.passportNumber || !state.passportData.expeditionDate || !state.passportData.expirationDate) return false;
        if (state.passportData.hasLostPassport === 'Si' && !state.passportData.lostPassportExplanation) return false;
        return true;
      case 4:
        if (state.travelInfo.hasSpecificTravelPlans === 'Si') {
          if (!state.travelInfo.arrivalDate || !state.travelInfo.departureDate) return false;
        } else {
          if (!state.travelInfo.tentativeTravelDate || !state.travelInfo.travelDurationDays) return false;
        }
        if (state.travelInfo.travelPayer === 'Familiar') {
          return !!(state.travelInfo.payerLastName?.trim() && state.travelInfo.payerFirstName?.trim() && state.travelInfo.payerRelationship);
        }
        return true;
      case 5:
        if (state.usContact.hasContact === '') return false;
        if (state.usContact.hasContact === 'No') {
          return !!(state.usContact.name?.trim() && state.usContact.address?.trim() && state.usContact.phone?.trim());
        }
        return !!(state.usContact.name?.trim() && state.usContact.address?.trim() && state.usContact.phone?.trim() && state.usContact.relationship);
      case 6:
        if (state.usTravelHistory.hasTraveledBefore === '') return false;
        if (state.usTravelHistory.hasTraveledBefore === 'Si') {
          return state.usTravelHistory.entries.length > 0 && state.usTravelHistory.entries.every(e => e.entryDate && e.exitDate && e.daysStayed);
        }
        return true;
      case 7:
        if (state.previousVisa.hasPreviousVisa === '') return false;
        if (state.previousVisa.hasPreviousVisa === 'Si') {
          if (!state.previousVisa.visaNumber || !state.previousVisa.expeditionDate || !state.previousVisa.expirationDate) return false;
        }
        if (state.previousVisa.hasVisaDenial === '') return false;
        if (state.previousVisa.hasVisaDenial === 'Si') {
          return !!(state.previousVisa.denialDate && state.previousVisa.denialReason);
        }
        return true;
      case 8:
        if (!state.familyInfo.fatherName || !state.familyInfo.motherName) return false;
        if (state.familyInfo.isFatherInUS === 'Si' && !state.familyInfo.fatherUSStatus) return false;
        if (state.familyInfo.isMotherInUS === 'Si' && !state.familyInfo.motherUSStatus) return false;
        return true;
      case 9:
        if (state.spouseChildren.civilStatus !== 'Soltero(a)') {
          if (!state.spouseChildren.spouseLastName?.trim() || !state.spouseChildren.spouseFirstName?.trim() || !state.spouseChildren.spouseBirthDate) {
            return false;
          }
        }
        return state.spouseChildren.hasChildren !== '';
      case 10:
        if (state.currentJob.workStatus === 'Pensionado') return true;
        return !!(
          state.currentJob.occupation?.trim() &&
          state.currentJob.companyName?.trim() &&
          state.currentJob.monthlySalary?.trim() &&
          state.currentJob.workAddress?.trim() &&
          state.currentJob.workPhone?.trim() &&
          state.currentJob.startDate &&
          state.currentJob.duty1?.trim()
        );
      case 11:
        if (state.previousJobs.hasPreviousJobs === '') return false;
        if (state.previousJobs.hasPreviousJobs === 'Si') {
          return state.previousJobs.jobs.length > 0 && state.previousJobs.jobs.every(j => j.companyName && j.position && j.startDate && j.endDate);
        }
        return true;
      case 12:
        if (state.education.hasEducation === '') return false;
        if (state.education.hasEducation === 'Si') {
          return state.education.studies.length > 0 && state.education.studies.every(s => 
            s.institutionName?.trim() && 
            s.degreeEarned?.trim() && 
            s.startDate && 
            s.endDate
          );
        }
        return true;
      case 13:
        if (!state.securityQuestions.languagesSpoken) return false;
        if (state.securityQuestions.hasMilitaryService === 'Si') {
          return !!(state.securityQuestions.militaryBranch && state.securityQuestions.militaryRank && state.securityQuestions.militarySpecialty && state.securityQuestions.militaryStartDate && state.securityQuestions.militaryEndDate);
        }
        return true;
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
      case 7: return "Visa Americana y Negaciones";
      case 8: return "Información Familiar";
      case 9: return "Cónyuge e Hijos";
      case 10: return "Trabajo Actual";
      case 11: return "Trabajos Anteriores";
      case 12: return "Estudios";
      case 13: return "Información Adicional";
      case 14: return "Preguntas de Seguridad";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        {currentStep <= 14 && (
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-slate-500 hover:text-us-blue font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </button>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-us-red animate-pulse" />
              Sesión Segura Encriptada
            </div>
          </div>
        )}

        {currentStep <= 14 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 flex">
              <div className="bg-us-blue w-1/2 h-full" />
              <div className="bg-us-red w-1/2 h-full" />
            </div>

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
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-us-blue to-us-red transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

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
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre completo (Apellidos y Nombres, tal cual en pasaporte) *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Pérez Gómez Juan Carlos"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
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
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.personalData.birthDate}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, birthDate: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Género *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.personalData.gender}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, gender: e.target.value } })}
                          >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Lugar de nacimiento (Ciudad y Estado/Depto) *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Bogotá, Cundinamarca"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
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
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.personalData.nationality}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, nationality: e.target.value } })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de documento de identidad *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.personalData.nationalIdentityType}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, nationalIdentityType: e.target.value } })}
                          >
                            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Número de documento *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ingresa el número"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.personalData.nationalIdentityNumber}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, nationalIdentityNumber: e.target.value } })}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Tiene o ha tenido alguna nacionalidad distinta a la actual? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, personalData: { ...state.personalData, hasOtherNationality: val as any, otherNationalityDetails: val === 'No' ? '' : state.personalData.otherNationalityDetails } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.personalData.hasOtherNationality === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.personalData.hasOtherNationality === 'Si' && (
                          <input 
                            type="text" 
                            placeholder="Especifique el país y detalles de la otra nacionalidad"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm animate-fadeIn"
                            value={state.personalData.otherNationalityDetails}
                            onChange={e => setState({ ...state, personalData: { ...state.personalData, otherNationalityDetails: e.target.value } })}
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Es usted residente de otro país distinto a su país de nacionalidad actual? *</label>
                        <div className="flex gap-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, personalData: { ...state.personalData, isResidentOtherCountry: val as any } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.personalData.isResidentOtherCountry === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Step 2: Dirección y Contacto */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Dirección de residencia (Calle, Apto, Conjunto) *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Calle 100 # 15-30"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.residenceAddress}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, residenceAddress: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Bogotá"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.residenceCity}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, residenceCity: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Departamento / Estado *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Cundinamarca"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.residenceState}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, residenceState: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">País *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Colombia"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.residenceCountry}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, residenceCountry: e.target.value } })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono principal *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="+57 321 000 0000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.mobilePhone}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, mobilePhone: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Otro teléfono de contacto (Opcional)</label>
                          <input 
                            type="tel" 
                            placeholder="+57 601 000 0000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.addressContact.secondaryPhone}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, secondaryPhone: e.target.value } })}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Correo electrónico *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm mb-4"
                          value={state.addressContact.email}
                          onChange={e => setState({ ...state, addressContact: { ...state.addressContact, email: e.target.value } })}
                        />
                        
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Maneja otro correo electrónico? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, addressContact: { ...state.addressContact, hasOtherEmail: val as any, otherEmail: val === 'No' ? '' : state.addressContact.otherEmail } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.addressContact.hasOtherEmail === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.addressContact.hasOtherEmail === 'Si' && (
                          <input 
                            type="email" 
                            placeholder="Ingrese su otro correo electrónico"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm animate-fadeIn"
                            value={state.addressContact.otherEmail}
                            onChange={e => setState({ ...state, addressContact: { ...state.addressContact, otherEmail: e.target.value } })}
                          />
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Maneja redes sociales en los últimos 5 años? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, addressContact: { ...state.addressContact, hasSocialMedia: val as any, socialMediaLink: val === 'No' ? '' : state.addressContact.socialMediaLink } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.addressContact.hasSocialMedia === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.addressContact.hasSocialMedia === 'Si' && (
                          <div className="space-y-2 animate-fadeIn">
                            <span className="block text-xs font-bold text-us-red">
                              ⚠️ IMPORTANTE: Por favor copia y pega el enlace (link) completo de tu perfil de red social (ej. https://www.facebook.com/tu.usuario), no solamente el nombre de usuario.
                            </span>
                            <input 
                              type="url" 
                              placeholder="Ej. https://www.instagram.com/tu_usuario"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                              value={state.addressContact.socialMediaLink}
                              onChange={e => setState({ ...state, addressContact: { ...state.addressContact, socialMediaLink: e.target.value } })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Pasaporte */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de pasaporte *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.passportData.passportType}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, passportType: e.target.value } })}
                          >
                            <option value="Regular">Regular / Oficial Ordinario</option>
                            <option value="Oficial">Oficial / Oficial de Servicio</option>
                            <option value="Diplomático">Diplomático</option>
                            <option value="Otro">Otro Tipo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Número de pasaporte *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ingresa tu número de pasaporte"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.passportData.passportNumber}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, passportNumber: e.target.value } })}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de expedición *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.passportData.expeditionDate}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, expeditionDate: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de vencimiento *</label>
                          <input 
                            type="date" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                          value={state.passportData.issuingCountry}
                          onChange={e => setState({ ...state, passportData: { ...state.passportData, issuingCountry: e.target.value } })}
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Ha perdido o le han robado su pasaporte alguna vez? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, passportData: { ...state.passportData, hasLostPassport: val as any, lostPassportExplanation: val === 'No' ? '' : state.passportData.lostPassportExplanation } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.passportData.hasLostPassport === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.passportData.hasLostPassport === 'Si' && (
                          <textarea 
                            rows={3}
                            placeholder="Explique detalladamente cuándo y cómo perdió o le robaron su pasaporte anterior"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm animate-fadeIn"
                            value={state.passportData.lostPassportExplanation}
                            onChange={e => setState({ ...state, passportData: { ...state.passportData, lostPassportExplanation: e.target.value } })}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Información de Viaje */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Propósito del viaje *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.travelInfo.travelPurpose}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelPurpose: e.target.value } })}
                          >
                            <option value="Turismo (B2)">Turismo / Tratamiento Médico (B2)</option>
                            <option value="Negocios (B1)">Negocios / Conferencias (B1)</option>
                            <option value="Negocio/Turismo (B1/B2)">Negocios y Turismo Combinados (B1/B2)</option>
                            <option value="Estudios (F1)">Estudios (F1)</option>
                            <option value="Otro">Otro propósito</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">¿Quién pagará los gastos de tu viaje? *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.travelInfo.travelPayer}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelPayer: e.target.value } })}
                          >
                            <option value="Mismo solicitante">Tú mismo (Mismo solicitante)</option>
                            <option value="Familiar">Un familiar directo (Padre, Madre, Cónyuge)</option>
                            <option value="Empresa">Tu empresa / Empleador</option>
                            <option value="Otra Persona">Otra persona u organización</option>
                          </select>
                        </div>
                      </div>

                      {state.travelInfo.travelPayer === 'Familiar' && (
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Datos del Familiar que Paga</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Apellidos *</label>
                              <input 
                                type="text"
                                placeholder="Pérez Gómez"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.payerLastName || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerLastName: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Nombres *</label>
                              <input 
                                type="text"
                                placeholder="Juan Carlos"
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.payerFirstName || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerFirstName: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Parentesco *</label>
                            <select 
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                              value={state.travelInfo.payerRelationship || 'Padre'}
                              onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, payerRelationship: e.target.value } })}
                            >
                              <option value="Padre">Padre / Madre</option>
                              <option value="Hermano">Hermano / Hermana</option>
                              <option value="Cónyuge">Cónyuge</option>
                              <option value="Otros">Otros Parientes</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Ha realizado planes específicos de viaje a EE.UU.? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ 
                                ...state, 
                                travelInfo: { 
                                  ...state.travelInfo, 
                                  hasSpecificTravelPlans: val as any, 
                                  arrivalDate: val === 'No' ? '' : state.travelInfo.arrivalDate,
                                  departureDate: val === 'No' ? '' : state.travelInfo.departureDate,
                                  tentativeTravelDate: val === 'Si' ? '' : state.travelInfo.tentativeTravelDate
                                } 
                              })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.travelInfo.hasSpecificTravelPlans === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>

                        {state.travelInfo.hasSpecificTravelPlans === 'Si' ? (
                          <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Fecha de llegada a EE.UU. *</label>
                              <input 
                                type="date"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.arrivalDate || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, arrivalDate: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Fecha de salida de EE.UU. *</label>
                              <input 
                                type="date"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.departureDate || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, departureDate: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Días totales de permanencia *</label>
                              <input 
                                type="number"
                                placeholder="Ej. 10"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.travelDurationDays || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelDurationDays: e.target.value } })}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Fecha tentativa de viaje *</label>
                              <input 
                                type="date"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.tentativeTravelDate}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, tentativeTravelDate: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Días estimados de permanencia *</label>
                              <input 
                                type="number"
                                placeholder="Ej. 15"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.travelInfo.travelDurationDays || ''}
                                onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, travelDurationDays: e.target.value } })}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono del lugar de hospedaje en EE.UU. *</label>
                          <input 
                            type="tel"
                            placeholder="Ej. +1 305-000-0000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.travelInfo.accommodationPhone || ''}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, accommodationPhone: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Correo electrónico del hospedaje (Opcional)</label>
                          <input 
                            type="email"
                            placeholder="Ej. hotel@correo.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                            value={state.travelInfo.accommodationEmail || ''}
                            onChange={e => setState({ ...state, travelInfo: { ...state.travelInfo, accommodationEmail: e.target.value } })}
                          />
                        </div>
                      </div>
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
                                setState({ 
                                  ...state, 
                                  usContact: { 
                                    hasContact: opt.value as 'Si' | 'No',
                                    name: '',
                                    address: '',
                                    phone: '',
                                    email: '',
                                    relationship: 'Familiar',
                                    legalStatus: 'Ciudadano',
                                    organizationName: ''
                                  } 
                                });
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
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Detalles del Contacto / Institución en USA</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Nombre de la persona que lo conoce *</label>
                              <input 
                                type="text"
                                placeholder="Ingresa nombre de contacto"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.name || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, name: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Nombre de la organización (Opcional)</label>
                              <input 
                                type="text"
                                placeholder="Ej. Universidad o Empresa"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.organizationName || ''}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, organizationName: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Relación con usted *</label>
                              <select 
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white"
                                value={state.usContact.relationship || 'Familiar'}
                                onChange={e => setState({ ...state, usContact: { ...state.usContact, relationship: e.target.value } })}
                              >
                                <option value="Familiar">Familiar</option>
                                <option value="Amigo">Amigo / Conocido</option>
                                <option value="Socio de negocios">Socio de negocios / Empleador</option>
                                <option value="Representante de escuela">Representante de escuela / Universidad</option>
                                <option value="Otro">Otro</option>
                              </select>
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
                                <option value="Otro">Otro / No Aplica</option>
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
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Teléfono de contacto *</label>
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
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Historial de Viajes a USA (Repetible dinámico) */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Ha estado o viajado anteriormente a los Estados Unidos? *</span>
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
                                  ? [{ entryDate: '', exitDate: '', daysStayed: '', cityVisited: '' }] 
                                  : state.usTravelHistory.entries;
                                setState({ 
                                  ...state, 
                                  usTravelHistory: { ...state.usTravelHistory, hasTraveledBefore: opt.value as any, entries: newEntries } 
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
                          <div className="grid md:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">¿Cuántas entradas totales ha tenido a EE.UU.? *</label>
                              <input 
                                type="number"
                                placeholder="Ej. 3"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.usTravelHistory.previousEntriesCount || ''}
                                onChange={e => setState({ ...state, usTravelHistory: { ...state.usTravelHistory, previousEntriesCount: e.target.value } })}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Registros de Viajes (Mínimo 5 permitidos)</h4>
                            <button
                              type="button"
                              onClick={addTravelEntry}
                              className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" /> Agregar Viaje
                            </button>
                          </div>

                          <div className="space-y-4">
                            {state.usTravelHistory.entries.map((entry, index) => (
                              <div key={index} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm relative space-y-3">
                                {state.usTravelHistory.entries.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTravelEntry(index)}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <span className="block text-xs font-bold text-slate-400 uppercase">Viaje #{index + 1}</span>
                                
                                <div className="grid md:grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha Ingreso *</label>
                                    <input 
                                      type="date"
                                      required
                                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-white"
                                      value={entry.entryDate}
                                      onChange={e => updateTravelEntry(index, 'entryDate', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha Salida *</label>
                                    <input 
                                      type="date"
                                      required
                                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-white"
                                      value={entry.exitDate}
                                      onChange={e => updateTravelEntry(index, 'exitDate', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Días Permanencia *</label>
                                    <input 
                                      type="number"
                                      required
                                      placeholder="Ej. 12"
                                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-white"
                                      value={entry.daysStayed}
                                      onChange={e => updateTravelEntry(index, 'daysStayed', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Ciudad Visitada (Opcional)</label>
                                    <input 
                                      type="text"
                                      placeholder="Ej. Miami"
                                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-xs bg-white"
                                      value={entry.cityVisited || ''}
                                      onChange={e => updateTravelEntry(index, 'cityVisited', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 7: Visa Americana y Negaciones */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Alguna vez le han emitido una visa americana? *</span>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ 
                                ...state, 
                                previousVisa: { 
                                  ...state.previousVisa, 
                                  hasPreviousVisa: val as any, 
                                  visaNumber: val === 'No' ? '' : state.previousVisa.visaNumber,
                                  expeditionDate: val === 'No' ? '' : state.previousVisa.expeditionDate,
                                  expirationDate: val === 'No' ? '' : state.previousVisa.expirationDate
                                } 
                              })}
                              className={`flex-1 py-3 px-4 rounded-xl border text-center transition font-bold text-sm ${state.previousVisa.hasPreviousVisa === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>

                        {state.previousVisa.hasPreviousVisa === 'Si' && (
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Detalles de la Visa Anterior</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Número de Visa *</label>
                                <input 
                                  type="text"
                                  placeholder="Ej. 12345678"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                  value={state.previousVisa.visaNumber || ''}
                                  onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, visaNumber: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Fecha Expedición *</label>
                                <input 
                                  type="date"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                  value={state.previousVisa.expeditionDate || ''}
                                  onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, expeditionDate: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Fecha Vencimiento *</label>
                                <input 
                                  type="date"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                  value={state.previousVisa.expirationDate || ''}
                                  onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, expirationDate: e.target.value } })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Le han negado una visa americana alguna vez? *</span>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ 
                                ...state, 
                                previousVisa: { 
                                  ...state.previousVisa, 
                                  hasVisaDenial: val as any, 
                                  denialDate: val === 'No' ? '' : state.previousVisa.denialDate,
                                  denialReason: val === 'No' ? '' : state.previousVisa.denialReason
                                } 
                              })}
                              className={`flex-1 py-3 px-4 rounded-xl border text-center transition font-bold text-sm ${state.previousVisa.hasVisaDenial === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>

                        {state.previousVisa.hasVisaDenial === 'Si' && (
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-us-red text-sm uppercase tracking-wide">Detalles de la Negación</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de la Negación *</label>
                                <input 
                                  type="date"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                  value={state.previousVisa.denialDate || ''}
                                  onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, denialDate: e.target.value } })}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-600 mb-1">Motivo / Explicación *</label>
                                <input 
                                  type="text"
                                  placeholder="Ej. Falta de arraigo económico"
                                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                  value={state.previousVisa.denialReason || ''}
                                  onChange={e => setState({ ...state, previousVisa: { ...state.previousVisa, denialReason: e.target.value } })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 8: Información Familiar */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Información del Padre</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Nombre completo del padre *</label>
                          <input 
                            type="text"
                            placeholder="Nombre del Padre"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.familyInfo.fatherName}
                            onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, fatherName: e.target.value } })}
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Fecha de nacimiento (Padre)</label>
                            <input 
                              type="date"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                              value={state.familyInfo.fatherBirthDate || ''}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, fatherBirthDate: e.target.value } })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">¿Su padre está en EE.UU.?</label>
                            <select 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                              value={state.familyInfo.isFatherInUS || 'No'}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, isFatherInUS: e.target.value as any } })}
                            >
                              <option value="No">No</option>
                              <option value="Si">Sí</option>
                            </select>
                          </div>
                          {state.familyInfo.isFatherInUS === 'Si' && (
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Estatus legal en EE.UU.</label>
                              <select 
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                                value={state.familyInfo.fatherUSStatus || 'Ciudadano'}
                                onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, fatherUSStatus: e.target.value } })}
                              >
                                <option value="Ciudadano">Ciudadano Americano</option>
                                <option value="Residente">Residente Legal (Green Card)</option>
                                <option value="No Inmigrante">No Inmigrante (Visa)</option>
                                <option value="Otro">Otro</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Información de la Madre</h4>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Nombre completo de la madre *</label>
                          <input 
                            type="text"
                            placeholder="Nombre de la Madre"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.familyInfo.motherName}
                            onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, motherName: e.target.value } })}
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Fecha de nacimiento (Madre)</label>
                            <input 
                              type="date"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                              value={state.familyInfo.motherBirthDate || ''}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, motherBirthDate: e.target.value } })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">¿Su madre está en EE.UU.?</label>
                            <select 
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                              value={state.familyInfo.isMotherInUS || 'No'}
                              onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, isMotherInUS: e.target.value as any } })}
                            >
                              <option value="No">No</option>
                              <option value="Si">Sí</option>
                            </select>
                          </div>
                          {state.familyInfo.isMotherInUS === 'Si' && (
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5">Estatus legal en EE.UU.</label>
                              <select 
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-us-blue bg-white text-xs"
                                value={state.familyInfo.motherUSStatus || 'Ciudadano'}
                                onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, motherUSStatus: e.target.value } })}
                              >
                                <option value="Ciudadano">Ciudadano Americano</option>
                                <option value="Residente">Residente Legal (Green Card)</option>
                                <option value="No Inmigrante">No Inmigrante (Visa)</option>
                                <option value="Otro">Otro</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Tiene otros parientes directos en los Estados Unidos? (Hijos, hermanos, tíos) *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, familyInfo: { ...state.familyInfo, hasOtherRelativesInUS: val as any, otherRelativesDetails: val === 'No' ? '' : state.familyInfo.otherRelativesDetails } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.familyInfo.hasOtherRelativesInUS === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.familyInfo.hasOtherRelativesInUS === 'Si' && (
                          <textarea 
                            rows={3}
                            placeholder="Especifique parentesco, nombres completos y estatus migratorio (Ej. Tío, Juan Pérez, Residente)"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm animate-fadeIn"
                            value={state.familyInfo.otherRelativesDetails}
                            onChange={e => setState({ ...state, familyInfo: { ...state.familyInfo, otherRelativesDetails: e.target.value } })}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 9: Cónyuge e Hijos */}
                  {currentStep === 9 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Estado civil *</label>
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                            value={state.spouseChildren.civilStatus}
                            onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, civilStatus: e.target.value } })}
                          >
                            <option value="Soltero(a)">Soltero(a)</option>
                            <option value="Casado(a)">Casado(a)</option>
                            <option value="Unión Libre">Unión Libre</option>
                            <option value="Separado(a)">Separado(a)</option>
                            <option value="Divorciado(a)">Divorciado(a)</option>
                            <option value="Viudo(a)">Viudo(a)</option>
                          </select>
                        </div>
                      </div>

                      {state.spouseChildren.civilStatus !== 'Soltero(a)' && (
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 animate-fadeIn">
                          <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide">Datos del Cónyuge / Pareja</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Apellidos *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Pérez Gómez"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.spouseChildren.spouseLastName || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseLastName: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Nombres *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Adriana María"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.spouseChildren.spouseFirstName || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseFirstName: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de nacimiento *</label>
                              <input 
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                                value={state.spouseChildren.spouseBirthDate || ''}
                                onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, spouseBirthDate: e.target.value } })}
                              />
                            </div>
                          </div>

                          {(state.spouseChildren.civilStatus === 'Separado(a)' || state.spouseChildren.civilStatus === 'Divorciado(a)') && (
                            <div className="pt-4 border-t border-slate-200 space-y-4">
                              <h5 className="text-xs font-bold text-us-red uppercase">Detalles de la Separación / Divorcio</h5>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de separación/divorcio *</label>
                                  <input 
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none bg-white text-sm"
                                    value={state.spouseChildren.separationDate || ''}
                                    onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, separationDate: e.target.value } })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1">Motivo / Explicación *</label>
                                  <input 
                                    type="text"
                                    placeholder="Ej. Incompatibilidad de caracteres"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none bg-white text-sm"
                                    value={state.spouseChildren.separationReason || ''}
                                    onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, separationReason: e.target.value } })}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Tiene hijos? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ ...state, spouseChildren: { ...state.spouseChildren, hasChildren: val as any, childrenCount: val === 'No' ? 0 : state.spouseChildren.childrenCount } })}
                              className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.spouseChildren.hasChildren === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        {state.spouseChildren.hasChildren === 'Si' && (
                          <div className="animate-fadeIn">
                            <label className="block text-xs font-bold text-slate-600 mb-1.5">Cantidad de hijos *</label>
                            <input 
                              type="number"
                              placeholder="Ej. 2"
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm bg-white"
                              value={state.spouseChildren.childrenCount || ''}
                              onChange={e => setState({ ...state, spouseChildren: { ...state.spouseChildren, childrenCount: Number(e.target.value) } })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 10: Trabajo Actual */}
                  {currentStep === 10 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Estado laboral actual *</label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue bg-white text-sm"
                          value={state.currentJob.workStatus}
                          onChange={e => setState({ ...state, currentJob: { ...state.currentJob, workStatus: e.target.value as any } })}
                        >
                          <option value="Trabajando">Trabajando / Empleado / Independiente</option>
                          <option value="Pensionado">Pensionado / Jubilado</option>
                        </select>
                      </div>

                      {state.currentJob.workStatus === 'Trabajando' && (
                        <div className="space-y-6 animate-fadeIn">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Profesión u Ocupación *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Gerente de Ventas"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.occupation}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, occupation: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa o Negocio *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Tecnología Global S.A.S."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.companyName}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, companyName: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Ingresos mensuales aproximados (COP) *</label>
                              <input 
                                type="text"
                                placeholder="Ej. 7.800.000 COP"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.monthlySalary}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, monthlySalary: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de inicio en este empleo *</label>
                              <input 
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.startDate}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, startDate: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Dirección física del trabajo *</label>
                              <input 
                                type="text"
                                placeholder="Ej. Calle 100 # 19-50, Bogotá"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.workAddress}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, workAddress: e.target.value } })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono de la empresa *</label>
                              <input 
                                type="tel"
                                placeholder="Ej. 6013445566"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                                value={state.currentJob.workPhone}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, workPhone: e.target.value } })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Describa sus funciones principales (Mínimo 1 función) *</label>
                            <div className="space-y-3">
                              <input 
                                type="text"
                                placeholder="Función 1: Supervisión de equipo comercial"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                value={state.currentJob.duty1}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty1: e.target.value } })}
                              />
                              <input 
                                type="text"
                                placeholder="Función 2 (Opcional)"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                value={state.currentJob.duty2}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty2: e.target.value } })}
                              />
                              <input 
                                type="text"
                                placeholder="Función 3 (Opcional)"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                                value={state.currentJob.duty3}
                                onChange={e => setState({ ...state, currentJob: { ...state.currentJob, duty3: e.target.value } })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 11: Trabajos Anteriores (Repetible dinámico) */}
                  {currentStep === 11 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Ha estado empleado anteriormente en los últimos 5 años? *</span>
                        <div className="flex gap-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                const newJobs = val === 'Si' && state.previousJobs.jobs.length === 0
                                  ? [{ id: Math.random().toString(), companyName: '', position: '', supervisorName: '', startDate: '', endDate: '', companyAddress: '', companyPhone: '' }]
                                  : state.previousJobs.jobs;
                                setState({ ...state, previousJobs: { hasPreviousJobs: val as any, jobs: newJobs } });
                              }}
                              className={`flex-1 py-3 px-4 rounded-xl border text-center transition font-bold text-sm ${state.previousJobs.hasPreviousJobs === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.previousJobs.hasPreviousJobs === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide font-heading">Historial de Empleos Anteriores</h4>
                            <button
                              type="button"
                              onClick={addJobEntry}
                              className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                            >
                              <Plus className="w-3.5 h-3.5" /> Agregar Empleo
                            </button>
                          </div>

                          <div className="space-y-4">
                            {state.previousJobs.jobs.map((job, index) => (
                              <div key={job.id} className="p-4 bg-white rounded-2xl border border-slate-200 relative space-y-3 shadow-sm">
                                {state.previousJobs.jobs.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeJobEntry(job.id)}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <span className="block text-xs font-bold text-slate-400 uppercase">Empleo Anterior #{index + 1}</span>
                                
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre de la Empresa *</label>
                                    <input 
                                      type="text" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.companyName}
                                      onChange={e => updateJobEntry(job.id, 'companyName', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Cargo *</label>
                                    <input 
                                      type="text" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.position}
                                      onChange={e => updateJobEntry(job.id, 'position', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Dirección de la empresa *</label>
                                    <input 
                                      type="text" placeholder="Ej. Calle 50 # 10-20, Cali"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.companyAddress || ''}
                                      onChange={e => updateJobEntry(job.id, 'companyAddress', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Teléfono de la empresa *</label>
                                    <input 
                                      type="tel" placeholder="Ej. 6023221100"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.companyPhone || ''}
                                      onChange={e => updateJobEntry(job.id, 'companyPhone', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Jefe inmediato *</label>
                                    <input 
                                      type="text" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.supervisorName}
                                      onChange={e => updateJobEntry(job.id, 'supervisorName', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Inicio *</label>
                                    <input 
                                      type="date" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.startDate}
                                      onChange={e => updateJobEntry(job.id, 'startDate', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Retiro *</label>
                                    <input 
                                      type="date" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={job.endDate}
                                      onChange={e => updateJobEntry(job.id, 'endDate', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 12: Estudios (Repetible dinámico) */}
                  {currentStep === 12 && (
                    <div className="space-y-6">
                      <div>
                        <span className="block text-sm font-bold text-slate-700 mb-4">¿Tiene estudios secundarios, técnicos o universitarios? *</span>
                        <div className="flex gap-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                const newStudies = val === 'Si' && state.education.studies.length === 0
                                  ? [{ id: Math.random().toString(), institutionName: '', degreeEarned: '', startDate: '', endDate: '', institutionAddress: '', institutionCity: '', institutionPhone: '' }]
                                  : state.education.studies;
                                setState({ ...state, education: { hasEducation: val as any, studies: newStudies } });
                              }}
                              className={`flex-1 py-3 px-4 rounded-xl border text-center transition font-bold text-sm ${state.education.hasEducation === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.education.hasEducation === 'Si' && (
                        <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-6 animate-fadeIn">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-us-blue text-sm uppercase tracking-wide font-heading">Historial Académico</h4>
                            <button
                              type="button"
                              onClick={addEducationEntry}
                              className="flex items-center gap-1.5 bg-us-blue hover:bg-blue-900 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                            >
                              <Plus className="w-3.5 h-3.5" /> Agregar Estudio
                            </button>
                          </div>

                          <div className="space-y-4">
                            {state.education.studies.map((study, index) => (
                              <div key={study.id} className="p-4 bg-white rounded-2xl border border-slate-200 relative space-y-3 shadow-sm">
                                {state.education.studies.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEducationEntry(study.id)}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <span className="block text-xs font-bold text-slate-400 uppercase">Institución #{index + 1}</span>
                                
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre de la Institución *</label>
                                    <input 
                                      type="text" required
                                      placeholder="Ej. Universidad Nacional"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.institutionName}
                                      onChange={e => updateEducationEntry(study.id, 'institutionName', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Título obtenido / Grado *</label>
                                    <input 
                                      type="text" required
                                      placeholder="Ej. Ingeniero o Bachiller"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.degreeEarned}
                                      onChange={e => updateEducationEntry(study.id, 'degreeEarned', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-3">
                                  <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Dirección de Sede *</label>
                                    <input 
                                      type="text"
                                      placeholder="Ej. Carrera 45 # 26-85"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.institutionAddress || ''}
                                      onChange={e => updateEducationEntry(study.id, 'institutionAddress', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Ciudad de Sede *</label>
                                    <input 
                                      type="text"
                                      placeholder="Ej. Bogotá"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.institutionCity || ''}
                                      onChange={e => updateEducationEntry(study.id, 'institutionCity', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Teléfono Contacto *</label>
                                    <input 
                                      type="tel"
                                      placeholder="Ej. 6013165000"
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.institutionPhone || ''}
                                      onChange={e => updateEducationEntry(study.id, 'institutionPhone', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Inicio *</label>
                                    <input 
                                      type="date" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.startDate}
                                      onChange={e => updateEducationEntry(study.id, 'startDate', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Retiro/Terminación *</label>
                                    <input 
                                      type="date" required
                                      className="w-full px-3 py-2 rounded border border-slate-200 text-xs bg-white"
                                      value={study.endDate}
                                      onChange={e => updateEducationEntry(study.id, 'endDate', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 13: Información Adicional */}
                  {currentStep === 13 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Países que ha visitado en los últimos 5 años *</label>
                        <input 
                          type="text"
                          placeholder="Ej. México, España, Panamá (Separados por comas)"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                          value={state.countriesVisited.countries}
                          onChange={e => setState({ ...state, countriesVisited: { countries: e.target.value } })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Qué idiomas habla? *</label>
                        <input 
                          type="text"
                          placeholder="Ej. Español, Inglés, Francés"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-us-blue text-sm"
                          value={state.securityQuestions.languagesSpoken}
                          onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, languagesSpoken: e.target.value } })}
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">¿Ha prestado servicio militar o pertenecido a alguna fuerza de defensa? *</label>
                        <div className="flex gap-4 mb-4">
                          {['Si', 'No'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setState({ 
                                ...state, 
                                securityQuestions: { 
                                  ...state.securityQuestions, 
                                  hasMilitaryService: val as any,
                                  militaryBranch: val === 'No' ? '' : state.securityQuestions.militaryBranch,
                                  militaryRank: val === 'No' ? '' : state.securityQuestions.militaryRank,
                                  militarySpecialty: val === 'No' ? '' : state.securityQuestions.militarySpecialty,
                                  militaryStartDate: val === 'No' ? '' : state.securityQuestions.militaryStartDate,
                                  militaryEndDate: val === 'No' ? '' : state.securityQuestions.militaryEndDate
                                } 
                              })}
                              className={`flex-1 py-2.5 px-4 rounded-xl border text-center transition font-bold text-sm ${state.securityQuestions.hasMilitaryService === val ? 'border-us-blue bg-blue-50/50 text-us-blue' : 'border-slate-200 bg-white text-slate-600'}`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>

                        {state.securityQuestions.hasMilitaryService === 'Si' && (
                          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-us-blue text-xs uppercase tracking-wide">Datos del Servicio Militar</h4>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Rama del Servicio *</label>
                                <input 
                                  type="text" placeholder="Ej. Ejército"
                                  className="w-full px-3 py-2 rounded border border-slate-250 bg-white text-xs"
                                  value={state.securityQuestions.militaryBranch || ''}
                                  onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, militaryBranch: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Rango *</label>
                                <input 
                                  type="text" placeholder="Ej. Subteniente"
                                  className="w-full px-3 py-2 rounded border border-slate-250 bg-white text-xs"
                                  value={state.securityQuestions.militaryRank || ''}
                                  onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, militaryRank: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Especialidad militar *</label>
                                  <input 
                                  type="text" placeholder="Ej. Infantería"
                                  className="w-full px-3 py-2 rounded border border-slate-250 bg-white text-xs"
                                  value={state.securityQuestions.militarySpecialty || ''}
                                  onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, militarySpecialty: e.target.value } })}
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Inicio *</label>
                                <input 
                                  type="date"
                                  className="w-full px-3 py-2 rounded border border-slate-250 bg-white text-xs"
                                  value={state.securityQuestions.militaryStartDate || ''}
                                  onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, militaryStartDate: e.target.value } })}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Fecha de Retiro *</label>
                                <input 
                                  type="date"
                                  className="w-full px-3 py-2 rounded border border-slate-250 bg-white text-xs"
                                  value={state.securityQuestions.militaryEndDate || ''}
                                  onChange={e => setState({ ...state, securityQuestions: { ...state.securityQuestions, militaryEndDate: e.target.value } })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 14: Preguntas de Seguridad */}
                  {currentStep === 14 && (
                    <div className="space-y-6">
                      {([
                        { key: 'arrested', label: '¿Ha sido arrestado o condenado por algún delito o crimen en cualquier lugar?' },
                        { key: 'publicHealthIssues', label: '¿Tiene alguna enfermedad contagiosa de importancia para la salud pública?' },
                        { key: 'visaViolation', label: '¿Ha violado alguna vez los términos de una visa estadounidense o ha sido deportado?' }
                      ] as { key: 'arrested' | 'publicHealthIssues' | 'visaViolation'; label: string }[]).map((item) => (
                        <div key={item.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <label className="block text-sm font-bold text-slate-700 leading-snug">{item.label}</label>
                          <div className="flex gap-4">
                            {['No', 'Si'].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setState({ 
                                  ...state, 
                                  securityQuestions: { ...state.securityQuestions, [item.key]: val as any } 
                                })}
                                className={`flex-1 py-2 px-4 rounded-xl border text-center transition font-bold text-sm ${state.securityQuestions[item.key] === val ? 'border-us-red bg-red-50/50 text-us-red' : 'border-slate-200 bg-white text-slate-600'}`}
                              >
                                {val}
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
          
          /* Success Screen */
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

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-heading">
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
