
import AppLayout from '@/components/layout/AppLayout';
import PlantRecognitionForm from '@/components/plants/PlantRecognitionForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Plant Recognition | Virtual Vana',
  description: 'Identify medicinal plants by uploading an image. Powered by AI.',
};

export default function RecognizePage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in-up">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <PlantRecognitionForm />
      </div>
    </AppLayout>
  );
}
