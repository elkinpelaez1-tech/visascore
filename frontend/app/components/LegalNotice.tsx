import React from 'react';
import { ShieldAlert } from 'lucide-react';

const LegalNotice = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 md:p-10 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
          <ShieldAlert className="text-slate-600" size={20} />
        </div>
        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Aviso Legal Importante</h3>
      </div>
      <div className="space-y-4 text-slate-500 text-sm font-medium leading-relaxed">
        <p>
          VisaScore es una herramienta de análisis orientativo basada en variables del formulario DS-160 y en criterios comúnmente evaluados durante procesos de solicitud de visa de no inmigrante.
        </p>
        <p>
          El resultado obtenido representa únicamente una estimación de viabilidad del perfil migratorio del solicitante.
        </p>
        <p className="font-bold text-slate-700">
          La decisión final sobre la aprobación o negación de una visa es potestad exclusiva del oficial consular de la Embajada o Consulado de los Estados Unidos.
        </p>
      </div>
    </div>
  );
};

export default LegalNotice;
