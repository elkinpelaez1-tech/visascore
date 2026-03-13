import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

const ProfessionalAdvisory = () => {
  const whatsappUrl = "https://wa.me/573117287366?text=Hola,%20realicé%20mi%20análisis%20en%20VisaScore%20y%20me%20gustaría%20recibir%20asesoría%20para%20mi%20trámite%20de%20visa.";

  return (
    <div className="bg-usa-blue text-white rounded-[40px] p-8 md:p-12 mt-8 shadow-2xl shadow-blue-900/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          Servicio Premium
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black font-heading mb-6 leading-tight">
          ¿Prefieres que un experto revise tu caso?
        </h3>
        
        <p className="text-blue-100 text-lg font-medium mb-10 max-w-xl leading-relaxed">
          Nuestro equipo puede analizar tu perfil migratorio a profundidad y acompañarte paso a paso en todo el proceso de solicitud de visa.
        </p>
        
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <MessageCircle size={24} fill="currentColor" />
          Hablar con un experto
          <ArrowRight size={20} className="ml-2" />
        </a>
      </div>
    </div>
  );
};

export default ProfessionalAdvisory;
