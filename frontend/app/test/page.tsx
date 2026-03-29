"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ShieldCheck, Clock, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";

interface Question {
  id: string;
  label: string;
  type: "number" | "select" | "boolean" | "text";
  options?: string[];
  category: string;
}

const QUESTIONS: Question[] = [
  { id: "age", label: "¿Cuál es tu edad?", type: "number", category: "Personal" },
  { id: "maritalStatus", label: "¿Cuál es tu estado civil?", type: "select", options: ["Soltero/a", "Casado/a", "Unión Libre", "Divorciado/a", "Viudo/a"], category: "Personal" },
  { id: "hasChildren", label: "¿Tienes hijos?", type: "boolean", category: "Personal" },
  { id: "educationLevel", label: "Nivel educativo alcanzado", type: "select", options: ["Bachillerato", "Técnico/Tecnólogo", "Universitario", "Posgrado/Maestría"], category: "Personal" },
  { id: "occupation", label: "Ocupación actual", type: "text", category: "Económico" },
  { id: "employmentDurationMonths", label: "Antigüedad laboral (meses)", type: "number", category: "Económico" },
  { id: "monthlyIncomeCop", label: "Ingreso mensual aproximado (COP)", type: "number", category: "Económico" },
  { id: "isCompanyRegistered", label: "¿Tu empresa o negocio está legalmente registrado?", type: "boolean", category: "Económico" },
  { id: "hasProperties", label: "¿Tienes propiedades inmobiliarias a tu nombre?", type: "boolean", category: "Arraigo" },
  { id: "hasVehicle", label: "¿Tienes vehículo propio?", type: "boolean", category: "Arraigo" },
  { id: "bankAccountsCount", label: "¿Cuántas cuentas bancarias activas posees?", type: "number", category: "Arraigo" },
  { id: "familyInHomeCountry", label: "¿Tienes familiares directos en tu país de origen?", type: "boolean", category: "Arraigo" },
  { id: "travelHistoryInternational", label: "¿Has realizado viajes internacionales en los últimos 5 años?", type: "boolean", category: "Viajes" },
  { id: "travelHistoryTier1", label: "¿Has viajado a Europa, Canadá o Reino Unido anteriormente?", type: "boolean", category: "Viajes" },
  { id: "hasPreviousUsVisa", label: "¿Has tenido una visa americana anteriormente?", type: "boolean", category: "Migratorio" },
  { id: "previousVisaUsageCorrect", label: "Si tuviste visa, ¿la usaste correctamente?", type: "boolean", category: "Migratorio" },
  { id: "hasVisaDenial", label: "¿Te han negado una visa americana anteriormente?", type: "boolean", category: "Migratorio" },
  { id: "familyInUs", label: "¿Tienes familiares directos viviendo en Estados Unidos?", type: "boolean", category: "Migratorio" },
  { id: "hasOverstayHistory", label: "¿Te has quedado más tiempo del permitido en algún país?", type: "boolean", category: "Migratorio" },
  { id: "travelPurpose", label: "Motivo principal de tu viaje", type: "select", options: ["Turismo", "Negocios", "Tratamiento Médico", "Visita Familiar"], category: "Migratorio" },
  
  // Nuevas preguntas de Viaje
  { id: "tripPayer", label: "¿Quién va a pagar por su viaje?", type: "select", options: ["Yo mismo", "Familiar en mi país", "Familiar en EE.UU.", "Mi empresa", "Otro"], category: "Viaje" },
  { id: "intendedCities", label: "¿Qué ciudades quiere conocer en los Estados Unidos?", type: "text", category: "Viaje" },
  { id: "intendedDurationDays", label: "¿Cuánto tiempo quiere quedarse en Estados Unidos? (en días)", type: "number", category: "Viaje" },
  { id: "countriesVisited", label: "¿Cuáles países conoce?", type: "text", category: "Viaje" },

  // Redes Sociales
  { id: "socialMediaPlatforms", label: "¿Cuáles redes sociales tiene?", type: "text", category: "Redes Sociales" },
  { id: "allowsSocialMediaCheck", label: "¿Permite que la Embajada investigue sus redes sociales?", type: "boolean", category: "Redes Sociales" },

  // Seguridad y Salud
  { id: "hasCommunicableDisease", label: "¿Tiene usted alguna enfermedad transmisible de importancia para la salud pública?", type: "boolean", category: "Seguridad y Salud" },
  { id: "hasMentalPhysicalDisorder", label: "¿Tiene usted algún trastorno mental o físico?", type: "boolean", category: "Seguridad y Salud" },
  { id: "hasDrugAddiction", label: "¿Es o ha sido usted abusador o adicto a drogas?", type: "boolean", category: "Seguridad y Salud" },
  { id: "hasCriminalRecord", label: "¿Ha sido arrestado o condenado por algún delito o crimen?", type: "boolean", category: "Seguridad y Salud" },
  { id: "hasDeportationHistory", label: "¿Ha sido deportado o removido de Estados Unidos?", type: "boolean", category: "Seguridad y Salud" },
];

function LoadingStep({ label, delay }: { label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: "spring" }}
        className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
      >
        <CheckCircle2 size={12} className="text-white" strokeWidth={4} />
      </motion.div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </motion.div>
  );
}

export default function TestPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isCapping, setIsCapping] = useState(false);
  const router = useRouter();

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL);
    if (step === 0) console.log('[Analytics] test_started');
  }, [step]);

  const handleNext = async () => {
  if (step < QUESTIONS.length - 1) {
    setStep(step + 1);
  } else {
    setLoading(true);
    console.log('[Analytics] test_completed');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000"}/visa-test/submit`,
        formData
      );

      // Simulation of smart intelligence
      setIsCapping(true);
      setTimeout(async () => {
        // En vez de ir al paywall intermedio, vamos directo a Wompi
        try {
          const paymentResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000"}/payments/create`,
            { testId: response.data.testId }
          );
          
          if (paymentResponse.data.checkoutUrl) {
            window.location.href = paymentResponse.data.checkoutUrl;
          } else {
            console.error("No checkoutUrl received");
            alert("No se pudo generar el link de pago. Por favor intenta de nuevo.");
            setLoading(false);
            setIsCapping(false);
          }
        } catch (err) {
          console.error("Direct redirect failed", err);
          alert("Error al conectar con la pasarela de pago.");
          setLoading(false);
          setIsCapping(false);
        }
      }, 4500);

    } catch (error: any) {
      console.error("Error submitting test", error);
      setLoading(false);
      setIsCapping(false);
      alert("Ocurrió un error al procesar tu formulario. Por favor revisa tu conexión e intenta de nuevo.");
    }
  }
};

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateField = (val: any) => {
    setFormData({ ...formData, [currentQuestion.id]: val });
    // Auto-advance for simple choice questions after a small delay
    if (currentQuestion.type === "boolean" || currentQuestion.type === "select") {
       setTimeout(() => {
          if (step < QUESTIONS.length - 1) handleNext();
       }, 300);
    }
  };

  if (isCapping) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-[32px] border-4 border-blue-100 border-t-white"
            />
            <ShieldCheck className="text-white w-10 h-10 relative z-10" />
          </motion.div>

          <h2 className="text-3xl font-black font-heading text-slate-900 mb-8 leading-tight">
            Analizando tu perfil<br/>migratorio...
          </h2>

          <div className="space-y-4 text-left bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
            <LoadingStep label="Evaluación completada" delay={0.5} />
            <LoadingStep label="Perfil analizado" delay={1.5} />
            <LoadingStep label="VisaScore calculado" delay={2.5} />
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5 }}
              className="h-full bg-blue-600"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
            Procesando variables del DS-160
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img 
              src="/VisaScore Transparente.png" 
              alt="VisaScore Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-600">
             <Clock size={16} />
             <span className="text-sm font-semibold tracking-wide">Pregunta {step + 1} de {QUESTIONS.length}</span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-10 overflow-hidden">
          <motion.div 
            className="h-full bg-[#002868] rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col relative"
          >
            <div className="flex-1">
              {/* Section Header */}
              <div className="mb-6">
                 <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#002868] bg-blue-50 px-3 py-1 rounded-full">
                    {/* Icon depending on category */}
                    {currentQuestion.category === "Personal" && <CheckCircle2 size={16} />}
                    {currentQuestion.category === "Económico" && <Clock size={16} />}
                    {currentQuestion.category === "Arraigo" && <ShieldCheck size={16} />}
                    {currentQuestion.category === "Viajes" && <CheckCircle2 size={16} />}
                    {currentQuestion.category === "Migratorio" && <Clock size={16} />}
                    {currentQuestion.category === "Viaje" && <ShieldCheck size={16} />}
                    {currentQuestion.category === "Redes Sociales" && <CheckCircle2 size={16} />}
                    {currentQuestion.category === "Seguridad y Salud" && <ShieldCheck size={16} />}
                    {currentQuestion.category}
                 </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 transition-all duration-200 mb-8">
                <h2 className="text-lg md:text-xl font-medium mb-6 text-slate-800 leading-relaxed">
                  {currentQuestion.label}
                </h2>

                <div className="space-y-4">
                  {currentQuestion.type === "boolean" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => updateField(true)}
                        className={`p-6 rounded-xl border-2 font-medium text-lg transition-all duration-200 flex items-center justify-between ${formData[currentQuestion.id] === true ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300'}`}
                      >
                        SÍ <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData[currentQuestion.id] === true ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>{formData[currentQuestion.id] === true && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </button>
                      <button 
                        onClick={() => updateField(false)}
                        className={`p-6 rounded-xl border-2 font-medium text-lg transition-all duration-200 flex items-center justify-between ${formData[currentQuestion.id] === false ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300'}`}
                      >
                        NO <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData[currentQuestion.id] === false ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>{formData[currentQuestion.id] === false && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                      </button>
                    </div>
                  )}

                  {currentQuestion.type === "select" && (
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuestion.options?.map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => updateField(opt)}
                          className={`p-5 rounded-xl border-2 font-medium text-left transition-all duration-200 flex items-center justify-between shadow-sm ${formData[currentQuestion.id] === opt ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                          {opt}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${formData[currentQuestion.id] === opt ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                             {formData[currentQuestion.id] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {(currentQuestion.type === "number" || currentQuestion.type === "text") && (
                    <input 
                      type={currentQuestion.type}
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => updateField(currentQuestion.type === "number" ? Number(e.target.value) : e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#002868] focus:border-[#002868] transition outline-none text-lg font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="Escribe tu respuesta..."
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={handlePrev}
                disabled={step === 0}
                className="flex items-center gap-2 text-slate-500 font-medium text-sm hover:text-blue-600 disabled:opacity-0 transition-colors py-2 px-4 -ml-4"
              >
                <ChevronLeft size={20} /> Atrás
              </button>
              <button 
                onClick={handleNext}
                disabled={formData[currentQuestion.id] === undefined || loading}
                className="flex items-center gap-2 bg-[#002868] hover:bg-[#001f4d] text-white px-8 py-3 rounded-xl shadow-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#002868]"
              >
                {loading ? "Procesando..." : step === QUESTIONS.length - 1 ? "Completar Evaluación" : "Continuar"}
                {!loading && <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"
        >
          <Lock size={12} className="text-usa-blue" />
          Toda tu información está protegida por encriptación avanzada de 256 bits.
        </motion.div>
      </div>
    </div>
  );
}
