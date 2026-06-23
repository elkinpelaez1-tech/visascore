import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'terms' | 'habeas' | 'cookies' | null;
}

export default function LegalModal({ isOpen, onClose, documentType }: LegalModalProps) {
  if (!isOpen || !documentType) return null;

  const content = {
    terms: {
      title: "Términos y Condiciones de Uso",
      subtitle: "VISASCORE.INFO",
      lastUpdated: "Última actualización: Junio de 2026",
      body: (
        <div className="space-y-6 text-slate-600 text-[14px] leading-relaxed">
          <p>
            Bienvenido a <strong>VisaScore.info</strong>. Al acceder y utilizar este sitio web, el usuario acepta los presentes Términos y Condiciones.
          </p>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">1. OBJETO DEL SERVICIO</h4>
            <p>
              VisaScore.info es una plataforma de orientación y acompañamiento para procesos relacionados con visas americanas. La plataforma ofrece herramientas de evaluación, formularios de captura de información y servicios de asesoría migratoria.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">2. NO GARANTÍA DE APROBACIÓN</h4>
            <p>
              VisaScore.info no garantiza la aprobación de visas ni representa a ninguna entidad gubernamental, embajada o consulado.
            </p>
            <p className="mt-2">
              La decisión final sobre la aprobación o negación de una visa corresponde exclusivamente a las autoridades migratorias competentes.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">3. RESPONSABILIDAD DE LA INFORMACIÓN</h4>
            <p>
              El usuario declara que toda la información suministrada es veraz, completa y actualizada.
              VisaScore.info no será responsable por consecuencias derivadas de información falsa, incompleta o incorrecta proporcionada por el usuario.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">4. SERVICIOS PAGOS</h4>
            <p>
              Los valores informados corresponden exclusivamente a los servicios de asesoría, diligenciamiento y acompañamiento prestados por VisaScore.info.
            </p>
            <p className="mt-2">
              Los derechos consulares y demás tarifas oficiales son cobrados directamente por las autoridades competentes y no forman parte de los honorarios de VisaScore.info.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">5. PROPIEDAD INTELECTUAL</h4>
            <p>
              Todos los contenidos, diseños, textos, logotipos, imágenes y herramientas presentes en la plataforma son propiedad de VisaScore.info o de sus respectivos titulares.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">6. LIMITACIÓN DE RESPONSABILIDAD</h4>
            <p>
              VisaScore.info presta servicios de orientación y apoyo administrativo. No asume responsabilidad por decisiones adoptadas por embajadas, consulados o autoridades migratorias.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">7. MODIFICACIONES</h4>
            <p>
              VisaScore.info podrá modificar estos términos en cualquier momento. Las actualizaciones serán publicadas en este sitio web.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">8. LEGISLACIÓN APLICABLE</h4>
            <p>
              Estos términos se rigen por las leyes de la República de Colombia.
            </p>
          </div>
        </div>
      )
    },
    habeas: {
      title: "Política de Tratamiento de Datos Personales (Habeas Data)",
      subtitle: "VISASCORE.INFO",
      lastUpdated: "Última actualización: Junio de 2026",
      body: (
        <div className="space-y-6 text-slate-600 text-[14px] leading-relaxed">
          <p>
            VisaScore.info reconoce la importancia de la privacidad y protección de los datos personales de sus usuarios, en cumplimiento de la Ley 1581 de 2012 y demás normas aplicables en Colombia.
          </p>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">1. DATOS RECOPILADOS</h4>
            <p className="mb-2">Podemos recopilar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombres y apellidos</li>
              <li>Documento de identidad</li>
              <li>Fecha de nacimiento</li>
              <li>Correo electrónico</li>
              <li>Número telefónico</li>
              <li>Información de pasaporte</li>
              <li>Información laboral y académica</li>
              <li>Información migratoria</li>
              <li>Documentos adjuntos</li>
              <li>Información necesaria para procesos de visa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">2. FINALIDAD DEL TRATAMIENTO</h4>
            <p className="mb-2">Los datos podrán ser utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prestar servicios de asesoría migratoria</li>
              <li>Gestionar solicitudes de visa</li>
              <li>Contactar al usuario</li>
              <li>Generar reportes y documentos relacionados con el servicio</li>
              <li>Cumplir obligaciones legales</li>
              <li>Mejorar nuestros servicios</li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">3. DERECHOS DEL TITULAR</h4>
            <p className="mb-2">El titular tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conocer sus datos personales</li>
              <li>Actualizar información</li>
              <li>Rectificar datos</li>
              <li>Solicitar eliminación de información cuando proceda</li>
              <li>Revocar autorizaciones otorgadas</li>
              <li>Presentar consultas y reclamos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">4. SEGURIDAD DE LA INFORMACIÓN</h4>
            <p>
              VisaScore.info implementa medidas técnicas y administrativas razonables para proteger la información contra pérdida, acceso no autorizado o uso indebido.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">5. AUTORIZACIÓN</h4>
            <p>
              Al enviar información a través de los formularios de VisaScore.info, el usuario autoriza expresamente el tratamiento de sus datos para las finalidades aquí descritas.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">6. CONTACTO</h4>
            <p>
              Las solicitudes relacionadas con protección de datos podrán realizarse a través de los canales de contacto oficiales publicados en VisaScore.info.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">7. VIGENCIA</h4>
            <p>
              La información será conservada durante el tiempo necesario para cumplir las finalidades del servicio y las obligaciones legales aplicables.
            </p>
          </div>
        </div>
      )
    },
    cookies: {
      title: "Política de Cookies",
      subtitle: "VISASCORE.INFO",
      lastUpdated: "Última actualización: Junio de 2026",
      body: (
        <div className="space-y-6 text-slate-600 text-[14px] leading-relaxed">
          <p>
            VisaScore.info utiliza cookies y tecnologías similares para mejorar la experiencia de navegación, analizar el comportamiento de los usuarios y optimizar nuestros servicios.
          </p>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">¿QUÉ SON LAS COOKIES?</h4>
            <p>
              Las cookies son pequeños archivos almacenados en el navegador del usuario que permiten recordar preferencias y recopilar información estadística.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">TIPOS DE COOKIES UTILIZADAS</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Cookies esenciales:</strong> Permiten el funcionamiento básico de la plataforma.</li>
              <li><strong>Cookies analíticas:</strong> Nos ayudan a comprender cómo interactúan los usuarios con el sitio web mediante herramientas como Google Analytics.</li>
              <li><strong>Cookies de rendimiento:</strong> Permiten mejorar la velocidad y funcionamiento del sitio.</li>
              <li><strong>Cookies de personalización:</strong> Guardan preferencias y configuraciones del usuario.</li>
            </ol>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">GESTIÓN DE COOKIES</h4>
            <p>
              El usuario puede configurar su navegador para bloquear o eliminar cookies en cualquier momento. Algunas funcionalidades podrían verse afectadas.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">TERCEROS</h4>
            <p>
              Podemos utilizar servicios externos como Google Analytics para recopilar estadísticas de uso de forma agregada y anónima.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-[15px] mb-2">CONTACTO</h4>
            <p>
              Para consultas relacionadas con esta política puede escribir a los canales oficiales de atención publicados en VisaScore.info.
            </p>
          </div>
        </div>
      )
    }
  }[documentType];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" id="legal-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-black text-[#002868] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full inline-block mb-2">
                  {content.subtitle}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-snug">
                  {content.title}
                </h3>
                <span className="text-xs text-slate-400 font-medium block mt-1">
                  {content.lastUpdated}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 p-1.5 rounded-full transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {content.body}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Cerrar documento
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
