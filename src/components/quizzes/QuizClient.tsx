'use client';

import { useState, useMemo } from 'react';
import type { QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface QuizClientProps {
  questions: QuizQuestion[];
}

export default function QuizClient({ questions: initialQuestions }: QuizClientProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState(() => 
    [...initialQuestions].sort(() => Math.random() - 0.5)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = useMemo(() => shuffledQuestions[currentQuestionIndex], [shuffledQuestions, currentQuestionIndex]);
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
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
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setShuffledQuestions([...initialQuestions].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">
            You scored {score} out of {shuffledQuestions.length}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {score / shuffledQuestions.length >= 0.7 ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          )}
          <p className="text-xl mb-6">
            {score / shuffledQuestions.length >= 0.7 ? "Excellent work!" : "Keep learning and try again!"}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            <RotateCcw className="mr-2 h-5 w-5" /> Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return <p>Loading quiz...</p>; // Or some other loading state
  }
  
  const progressValue = ((currentQuestionIndex +1) / shuffledQuestions.length) * 100;

  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl font-headline">AYUSH Plant Quiz</CardTitle>
            <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
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
            {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
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
