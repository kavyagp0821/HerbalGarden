import AppLayout from '@/components/layout/AppLayout';
import QuizClient from '@/components/quizzes/QuizClient';
import { plantService } from '@/services/plant.service';

export const metadata = {
  title: 'Quizzes | Virtual Vana',
  description: 'Test your knowledge about medicinal plants with interactive quizzes.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function QuizzesPage() {
  const questions = await plantService.getQuizQuestions();

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-headline font-semibold text-primary">Test Your Knowledge</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Engage in interactive quizzes to reinforce your learning about AYUSH medicinal plants.
          </p>
        </header>
        <QuizClient questions={questions} />
      </div>
    </AppLayout>
  );
}
