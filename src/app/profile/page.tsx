
'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProgress, Badge as BadgeType, QuizResult } from '@/types';
import { Award, BookOpen, CheckCircle, Leaf, Star, Trophy, Bookmark, NotebookText } from 'lucide-react';
import Link from 'next/link';

const badgeDefinitions: Omit<BadgeType, 'achieved'>[] = [
    { id: 'view_1', name: 'Curious Explorer', description: 'View your first plant.', icon: Leaf },
    { id: 'view_5', name: 'Herbalist in Training', description: 'View 5 different plants.', icon: BookOpen },
    { id: 'quiz_1', name: 'First Steps', description: 'Complete your first quiz.', icon: CheckCircle },
    { id: 'quiz_perfect', name: 'Perfect Score!', description: 'Get a 100% score on any quiz.', icon: Star },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 3 quizzes.', icon: Trophy },
];

interface BookmarkedPlant {
    id: string;
    name: string;
    hasNotes: boolean;
}

export default function ProfilePage() {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [badges, setBadges] = useState<BadgeType[]>([]);
    const [bookmarkedPlants, setBookmarkedPlants] = useState<BookmarkedPlant[]>([]);

    useEffect(() => {
        try {
            const storedProgress: UserProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
            setProgress(storedProgress);

            // Award Badges Logic
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

            // Load Bookmarks and Notes
            const storedBookmarks: Record<string, boolean> = JSON.parse(localStorage.getItem('bookmarkedPlants') || '{}');
            const storedNotes: Record<string, string> = JSON.parse(localStorage.getItem('plantNotes') || '{}');
            const storedViewedPlants: Record<string, string> = storedProgress.viewedPlants || {};

            const bookmarksData: BookmarkedPlant[] = Object.keys(storedBookmarks)
                .map(plantId => ({
                    id: plantId,
                    name: storedViewedPlants[plantId] || 'Unknown Plant', // Get name from viewed plants
                    hasNotes: !!storedNotes[plantId]
                }))
                .sort((a,b) => a.name.localeCompare(b.name));

            setBookmarkedPlants(bookmarksData);

        } catch (error) {
            console.error("Failed to load user progress.", error);
            setProgress({});
        }
    }, []);

    const viewedPlantsCount = Object.keys(progress?.viewedPlants || {}).length;
    const quizzesTakenCount = (progress?.quizHistory || []).length;
    const bookmarkedPlantsCount = bookmarkedPlants.length;

    return (
        <AppLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-headline font-semibold text-primary">Your Progress & Badges</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        Track your learning journey through Virtual Vana.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Bookmark className="mr-2 h-5 w-5"/>Plants Bookmarked</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{bookmarkedPlantsCount}</p>
                            <p className="text-sm text-muted-foreground">plants saved for later.</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Bookmarked Plants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookmarkedPlantsCount > 0 ? (
                                <ul className="space-y-2">
                                    {bookmarkedPlants.map(plant => (
                                        <li key={plant.id} className="flex items-center justify-between text-sm hover:text-primary transition-colors">
                                            <Link href={`/plants/${plant.id}`} className="flex-grow">{plant.name}</Link>
                                            {plant.hasNotes && <NotebookText className="h-4 w-4 text-muted-foreground" title="You have notes for this plant" />}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-muted-foreground py-6">
                                    <p>You haven&apos;t bookmarked any plants yet.</p>
                                    <Link href="/plants"><Button variant="link" className="mt-2">Explore Plants</Button></Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                     <Card className="lg:col-span-2">
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
