
'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProgress, Badge as BadgeType, QuizResult } from '@/types';
import { Award, BookOpen, CheckCircle, Leaf, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const badgeDefinitions: Omit<BadgeType, 'achieved'>[] = [
    { id: 'view_1', name: 'Curious Explorer', description: 'View your first plant.', icon: Leaf },
    { id: 'view_5', name: 'Herbalist in Training', description: 'View 5 different plants.', icon: BookOpen },
    { id: 'quiz_1', name: 'First Steps', description: 'Complete your first quiz.', icon: CheckCircle },
    { id: 'quiz_perfect', name: 'Perfect Score!', description: 'Get a 100% score on any quiz.', icon: Star },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 3 quizzes.', icon: Trophy },
];

export default function ProfilePage() {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [badges, setBadges] = useState<BadgeType[]>([]);

    useEffect(() => {
        try {
            const storedProgress: UserProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
            setProgress(storedProgress);

            const viewedCount = Object.keys(storedProgress.viewedPlants || {}).length;
            const quizCount = (storedProgress.quizHistory || []).length;
            const hasPerfectScore = (storedProgress.quizHistory || []).some(q => q.score === q.total);

            const awardedBadges = badgeDefinitions.map(def => ({
                ...def,
                achieved: 
                    (def.id === 'view_1' && viewedCount >= 1) ||
                    (def.id === 'view_5' && viewedCount >= 5) ||
                    (def.id === 'quiz_1' && quizCount >= 1) ||
                    (def.id === 'quiz_perfect' && hasPerfectScore) ||
                    (def.id === 'quiz_master' && quizCount >= 3)
            }));
            setBadges(awardedBadges);

        } catch (error) {
            console.error("Failed to load user progress.", error);
            setProgress({});
        }
    }, []);

    const viewedPlantsCount = Object.keys(progress?.viewedPlants || {}).length;
    const quizzesTakenCount = (progress?.quizHistory || []).length;

    return (
        <AppLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-headline font-semibold text-primary">Your Progress & Badges</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Track your learning journey through the AYUSH Virtual Garden.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Leaf className="mr-2 h-5 w-5"/> Plants Explored</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{viewedPlantsCount}</p>
                            <p className="text-sm text-muted-foreground">different plants viewed.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><CheckCircle className="mr-2 h-5 w-5"/>Quizzes Taken</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{quizzesTakenCount}</p>
                            <p className="text-sm text-muted-foreground">quizzes completed.</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6"/> Your Badges</CardTitle>
                        <CardDescription>Earn badges as you explore and learn.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {badges.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {badges.map(badge => (
                                    <div key={badge.id} className={`text-center p-4 border rounded-lg ${badge.achieved ? 'border-primary/50 bg-primary/10' : 'opacity-50 bg-muted'}`}>
                                        <badge.icon className={`w-12 h-12 mx-auto mb-2 ${badge.achieved ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <h3 className="font-semibold text-sm">{badge.name}</h3>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-muted-foreground">Start exploring to earn badges!</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Viewed Plants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {viewedPlantsCount > 0 ? (
                                <ul className="space-y-2">
                                    {Object.entries(progress?.viewedPlants || {}).map(([id, name]) => (
                                        <li key={id} className="text-sm hover:text-primary"><Link href={`/plants/${id}`}>{name}</Link></li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-muted-foreground py-6">
                                    <p>You haven&apos;t viewed any plants yet.</p>
                                    <Link href="/plants"><Button variant="link" className="mt-2">Explore Plants</Button></Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {quizzesTakenCount > 0 ? (
                                <ul className="space-y-3">
                                    {progress?.quizHistory?.map((result, index) => (
                                       <li key={index} className="text-sm flex justify-between items-center">
                                           <span>{new Date(result.date).toLocaleDateString()}</span>
                                           <UiBadge variant={result.score === result.total ? 'default' : 'secondary'}>
                                                Score: {result.score} / {result.total}
                                           </UiBadge>
                                       </li>
                                    )).reverse()}
                                </ul>
                            ) : (
                                <div className="text-center text-muted-foreground py-6">
                                    <p>You haven&apos;t taken any quizzes yet.</p>
                                    <Link href="/quizzes"><Button variant="link" className="mt-2">Take a Quiz</Button></Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    )
}
