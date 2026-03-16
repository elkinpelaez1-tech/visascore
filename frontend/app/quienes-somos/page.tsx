import Link from "next/link";
import { ArrowLeft, Users, Building, ShieldCheck } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#002868] font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver a inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          
          <div className="text-center mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Quiénes Somos</h1>
            <p className="text-lg text-slate-600">Conoce el equipo y la empresa detrás de VisaScore.</p>
          </div>
          
          <div className="space-y-8 text-slate-700 leading-relaxed">
            
            <section className="flex flex-col md:flex-row gap-6 items-start">
               <div className="bg-blue-50 p-4 rounded-full text-[#002868] shrink-0">
                 <Building size={32} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Central de Reservas y Turismo</h2>
                 <p className="text-lg">VisaScore es una plataforma diseñada y operada por <strong>Central de Reservas y Turismo</strong>, una empresa colombiana legalmente constituida.</p>
                 <p className="mt-2 text-slate-600">Nuestro compromiso es brindar transparencia y tecnología aplicada a los procesos migratorios y de visado, garantizando a nuestros usuarios un análisis objetivo de su perfil antes de presentarse ante un oficial consular.</p>
               </div>
            </section>

            <section className="flex flex-col md:flex-row gap-6 items-start mt-8">
               <div className="bg-blue-50 p-4 rounded-full text-[#002868] shrink-0">
                 <ShieldCheck size={32} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Registro Nacional de Turismo y Legalidad</h2>
                 <p>Operamos bajo el cumplimiento de todas las regulaciones colombianas, contando con <strong>Registro Nacional de Turismo (RNT) No. 31276</strong>.</p>
                 <p className="mt-2 text-slate-600">Visita nuestro portal corporativo para conocer más sobre nuestra trayectoria y otros servicios en: <a href="https://www.centraleventis.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">www.centraleventis.com</a></p>
               </div>
            </section>

            <section className="flex flex-col md:flex-row gap-6 items-start mt-8">
               <div className="bg-blue-50 p-4 rounded-full text-[#002868] shrink-0">
                 <Users size={32} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Asesoría Personalizada</h2>
                 <p>Más allá de nuestra herramienta digital, somos un equipo humano dispuesto a ayudarte a alcanzar tu objetivo de viajar a los Estados Unidos.</p>
                 <p className="mt-2 text-slate-600">Si después de tu análisis VisaScore deseas un acompañamiento profesional para tu caso en específico y el diligenciamiento formal de la DS-160, estamos disponibles para asesorarte vía WhatsApp.</p>
                 <div className="mt-4">
                    <p className="font-semibold text-[#002868] bg-blue-50 inline-block px-4 py-2 rounded-lg">Solo WhatsApp: +57 3117287366</p>
                 </div>
               </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
