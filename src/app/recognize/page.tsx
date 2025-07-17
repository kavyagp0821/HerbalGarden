import AppLayout from '@/components/layout/AppLayout';
import PlantRecognitionForm from '@/components/plants/PlantRecognitionForm';

export const metadata = {
  title: 'Plant Recognition | Virtual Vana',
  description: 'Identify medicinal plants by uploading an image. Powered by AI.',
};

export default function RecognizePage() {
  return (
    <AppLayout>
      <PlantRecognitionForm />
    </AppLayout>
  );
}
