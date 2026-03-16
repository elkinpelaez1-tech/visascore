import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#002868] font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver a inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Preguntas Frecuentes</h1>
          
          <div className="space-y-8 text-slate-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Qué es VisaScore?</h2>
              <p>VisaScore es una herramienta digital que analiza información proporcionada por el usuario para estimar la viabilidad de obtener una visa estadounidense. El sistema genera un puntaje entre 0 y 1000 que permite identificar fortalezas y posibles riesgos migratorios.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿VisaScore garantiza que mi visa será aprobada?</h2>
              <p>No. VisaScore es únicamente un sistema de análisis informativo. La decisión final sobre la aprobación o negación de una visa es potestad exclusiva del oficial consular de la Embajada o Consulado de los Estados Unidos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Qué información analiza VisaScore?</h2>
              <p className="mb-2">El sistema analiza diferentes variables relacionadas con el perfil del solicitante, como:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Edad y perfil personal</li>
                <li>Estabilidad laboral y económica</li>
                <li>Historial de viajes internacionales</li>
                <li>Vínculos familiares y sociales</li>
                <li>Duración del viaje propuesto</li>
                <li>Información similar a la solicitada en el formulario DS-160</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Cuánto cuesta el análisis?</h2>
              <p className="mb-2">El acceso al resultado completo del VisaScore tiene un costo único de <strong>$50.000 COP</strong>.</p>
              <p className="mb-2">Este pago permite desbloquear:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El puntaje VisaScore</li>
                <li>El análisis de fortalezas y debilidades</li>
                <li>Recomendaciones personalizadas</li>
                <li>El reporte descargable en PDF</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Quién desarrolla VisaScore?</h2>
              <p>VisaScore es operado por Central de Reservas y Turismo, empresa colombiana legalmente constituida con Registro Nacional de Turismo (RNT) No. 31276.</p>
              <p>Puedes conocer más sobre nuestra empresa en: <a href="https://www.centraleventis.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.centraleventis.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Puedo recibir asesoría personalizada para mi visa?</h2>
              <p className="mb-2">Sí. Si deseas acompañamiento profesional para tu proceso de visa puedes comunicarte con nosotros.</p>
              <p className="font-semibold text-[#002868] bg-blue-50 inline-block px-4 py-2 rounded-lg mt-2">Solo WhatsApp: +57 3117287366</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Mi información es confidencial?</h2>
              <p>Sí. La información proporcionada en la plataforma se utiliza exclusivamente para generar el análisis solicitado por el usuario.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#002868] mb-2">¿Puedo obtener recomendaciones para mejorar mi perfil?</h2>
              <p>Sí. VisaScore identifica fortalezas y áreas de riesgo y genera recomendaciones para mejorar el perfil migratorio antes de presentar la solicitud de visa.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
