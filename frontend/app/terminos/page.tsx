import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl w-full mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#002868] font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver a inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Términos y Condiciones – VisaScore</h1>
          
          <div className="space-y-6 text-slate-700 leading-relaxed">
            <p className="font-medium text-slate-800">Al utilizar la plataforma VisaScore, el usuario acepta los siguientes términos y condiciones.</p>
            
            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">1. Naturaleza del servicio</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>VisaScore es una herramienta digital que analiza información proporcionada por el usuario para estimar la viabilidad de una solicitud de visa estadounidense.</li>
                <li>VisaScore no es una entidad gubernamental ni representa a la Embajada de los Estados Unidos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">2. Limitación del servicio</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>El resultado presentado por VisaScore es un análisis probabilístico basado en los datos proporcionados por el usuario.</li>
                <li>La aprobación o negación de una visa es decisión exclusiva del oficial consular correspondiente.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">3. Responsabilidad del usuario</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>El usuario es responsable de proporcionar información veraz y completa en el formulario de evaluación.</li>
                <li>Resultados incorrectos pueden producirse si la información proporcionada no es precisa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">4. Pagos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>El acceso al resultado completo del VisaScore requiere un pago único según el precio mostrado en la plataforma.</li>
                <li>Los pagos son procesados por plataformas externas seguras.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">5. Reembolsos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Debido a la naturaleza digital del servicio y la entrega inmediata del análisis, los pagos realizados no son reembolsables.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">6. Uso del servicio</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>El servicio debe utilizarse únicamente para fines informativos y personales.</li>
                <li>Está prohibido utilizar la plataforma para actividades fraudulentas o automatizadas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold border-l-4 border-[#002868] pl-3 text-slate-900 mb-3 mt-8">7. Contacto</h2>
              <p className="mb-2">Para soporte o asesoría personalizada puedes comunicarte con:</p>
              <p className="font-semibold text-[#002868] bg-blue-50 inline-block px-4 py-2 rounded-lg">Solo WhatsApp: +57 3117287366</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
