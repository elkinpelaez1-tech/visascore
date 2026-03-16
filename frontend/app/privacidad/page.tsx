import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#002868] font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver a inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Política de Privacidad – VisaScore</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p className="font-medium text-slate-800">En VisaScore respetamos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información proporcionada en nuestra plataforma.</p>
            
            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">1. Información que recopilamos</h2>
              <p className="mb-2">Para ofrecer nuestro servicio de evaluación de viabilidad de visa, podemos recopilar información como:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Edad y perfil personal</li>
                <li>Información laboral y financiera</li>
                <li>Historial de viajes</li>
                <li>Información proporcionada en el formulario de evaluación similar al DS-160</li>
                <li>Dirección de correo electrónico</li>
                <li>Datos necesarios para generar el reporte VisaScore</li>
              </ul>
              <p className="mt-4 font-medium italic">Esta información se utiliza exclusivamente para generar el análisis solicitado por el usuario.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">2. Uso de la información</h2>
              <p className="mb-2">La información recopilada se utiliza para:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Generar el análisis de viabilidad de visa (VisaScore)</li>
                <li>Identificar fortalezas y debilidades del perfil migratorio</li>
                <li>Generar recomendaciones personalizadas</li>
                <li>Mejorar la calidad de nuestros servicios</li>
                <li>Enviar el reporte solicitado por el usuario</li>
              </ul>
              <p className="mt-4 font-semibold text-[#002868] bg-blue-50 inline-block px-4 py-2 rounded-lg">VisaScore no vende ni comparte información personal con terceros.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">3. Pagos</h2>
              <p>Los pagos dentro de la plataforma son procesados a través de proveedores externos seguros como Wompi de Bancolombia. VisaScore no almacena información de tarjetas de crédito.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">4. Seguridad</h2>
              <p>Implementamos medidas razonables de seguridad para proteger la información proporcionada por los usuarios.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">5. Limitación de responsabilidad</h2>
              <p>VisaScore es una herramienta de análisis informativo. La decisión final sobre la aprobación o negación de una visa es potestad exclusiva del oficial consular de la Embajada o Consulado de los Estados Unidos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">6. Contacto</h2>
              <p className="mb-2">Para preguntas relacionadas con esta política, puedes contactarnos en:</p>
              <p className="font-semibold text-[#002868] bg-blue-50 inline-block px-4 py-2 rounded-lg">Solo WhatsApp: +57 3117287366</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
