"use client";

import { useRouter } from "next/navigation";
import VisaWizard from "../../components/ui/VisaWizard";

export default function TramiteVisaPage() {
  const router = useRouter();

  const handleBackToLanding = () => {
    router.push("/");
  };

  return (
    <VisaWizard 
      onBackToLanding={handleBackToLanding} 
      logoUrl="/VisaScore Transparente.png" 
    />
  );
}
