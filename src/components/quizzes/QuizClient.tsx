
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion, UserProgress } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Link from 'next/link';

interface QuizClientProps {
  questions: QuizQuestion[];
}

const QUIZ_LENGTH = 5;

export default function QuizClient({ questions: allQuestions }: QuizClientProps) {
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const startNewQuiz = () => {
     // Shuffle all questions and take the first QUIZ_LENGTH to ensure a new set each time
     const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
     setCurrentQuizQuestions(shuffled.slice(0, QUIZ_LENGTH));
     
     // Reset all state for the new quiz
     setCurrentQuestionIndex(0);
     setSelectedAnswer(null);
     setScore(0);
     setShowResult(false);
     setQuizFinished(false);
  }

  useEffect(() => {
    if(allQuestions.length > 0) {
      startNewQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions]);


  const currentQuestion = useMemo(() => currentQuizQuestions[currentQuestionIndex], [currentQuizQuestions, currentQuestionIndex]);
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    // Shuffle options for the current question
    return [...currentQuestion.options].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);


  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
      // Save score to localStorage when quiz is finished
      try {
        const progress: UserProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const quizHistory = progress.quizHistory || [];
        // The score state might not be updated yet, so we calculate the final score directly.
        const finalScore = (selectedAnswer === currentQuestion.correctAnswer ? score + 1 : score);
        quizHistory.push({ score: finalScore, total: currentQuizQuestions.length, date: new Date().toISOString() });
        progress.quizHistory = quizHistory;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save quiz progress", error);
      }
    }
  };

  const restartQuiz = () => {
    startNewQuiz();
  };

  if (quizFinished) {
    const finalScore = score;
    const percentage = (finalScore / currentQuizQuestions.length) * 100;
    return (
      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">
            You scored {finalScore} out of {currentQuizQuestions.length} ({percentage.toFixed(0)}%).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {percentage >= 70 ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          )}
          <p className="text-xl mb-6">
            {percentage >= 70 ? "Excellent work!" : "Keep learning and try again!"}
          </p>
          <Link href="/profile">
            <Button variant="outline">View My Progress</Button>
          </Link>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            <RotateCcw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (currentQuizQuestions.length === 0 || !currentQuestion) {
    return (
        <Card className="max-w-xl mx-auto shadow-xl">
            <CardHeader>
                <CardTitle>Loading Quiz...</CardTitle>
            </CardHeader>
             <CardContent>
                <p>Preparing a new set of questions for you.</p>
            </CardContent>
        </Card>
    );
  }
  
  const progressValue = ((currentQuestionIndex + 1) / currentQuizQuestions.length) * 100;

  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl font-headline">AYUSH Plant Quiz</CardTitle>
            <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {currentQuizQuestions.length}</span>
        </div>
        <Progress value={progressValue} aria-label={`${progressValue}% quiz completed`} className="w-full h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold text-foreground">{currentQuestion.question}</p>
        <RadioGroup
          value={selectedAnswer || ''}
          onValueChange={setSelectedAnswer}
          disabled={showResult}
          aria-label="Select your answer"
        >
          {currentOptions.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors
                ${showResult && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-500/10' : ''}
                ${showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-500/10' : ''}
                ${!showResult && selectedAnswer === option ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'}
              `}
            >
              <RadioGroupItem value={option} id={`option-${index}`} className="mr-3" />
              <span>{option}</span>
              {showResult && option === currentQuestion.correctAnswer && <CheckCircle className="ml-auto w-5 h-5 text-green-500" />}
              {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircle className="ml-auto w-5 h-5 text-red-500" />}
            </Label>
          ))}
        </RadioGroup>

        {showResult && (
          <Alert variant={selectedAnswer === currentQuestion.correctAnswer ? "default" : "destructive"} className={selectedAnswer === currentQuestion.correctAnswer ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}>
            {selectedAnswer === currentQuestion.correctAnswer ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}</AlertTitle>
            <AlertDescription>
              {selectedAnswer !== currentQuestion.correctAnswer && `The correct answer is: ${currentQuestion.correctAnswer}`}
            </AlertDescription>
          </Alert>
        )}

      </CardContent>
      <CardFooter>
        {showResult ? (
          <Button onClick={handleNextQuestion} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {currentQuestionIndex < currentQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        ) : (
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Lightbulb className="mr-2 h-4 w-4" /> Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
