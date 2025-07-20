'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, NotebookText, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface PlantInteractionsProps {
  plantId: string;
  plantName: string;
}

export default function PlantInteractions({ plantId, plantName }: PlantInteractionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesSaved, setShowNotesSaved] = useState(false);
  const { toast } = useToast();

  // Effect to track viewed plants
  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      const viewedPlants = progress.viewedPlants || {};
      if (!viewedPlants[plantId]) {
        viewedPlants[plantId] = plantName;
        progress.viewedPlants = viewedPlants;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      }
    } catch (error) {
      console.error("Failed to update user progress for viewed plants.", error);
    }
  }, [plantId, plantName]);

  useEffect(() => {
    // Load bookmark status from localStorage
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPlants') || '{}');
    setIsBookmarked(!!storedBookmarks[plantId]);

    // Load notes from localStorage
    const storedNotes = JSON.parse(localStorage.getItem('plantNotes') || '{}');
    setNotes(storedNotes[plantId] || '');
  }, [plantId]);

  const toggleBookmark = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPlants') || '{}');
    if (newBookmarkStatus) {
      storedBookmarks[plantId] = true;
      toast({ title: `${plantName} bookmarked!`, description: "You can find it in your favorites." });
    } else {
      delete storedBookmarks[plantId];
      toast({ title: `${plantName} bookmark removed.`, variant: 'default' });
    }
    localStorage.setItem('bookmarkedPlants', JSON.stringify(storedBookmarks));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const saveNotes = () => {
    const storedNotes = JSON.parse(localStorage.getItem('plantNotes') || '{}');
    storedNotes[plantId] = notes;
    localStorage.setItem('plantNotes', JSON.stringify(storedNotes));
    setShowNotesSaved(true);
    toast({ title: `Notes for ${plantName} saved!`, description: "Your notes have been updated."});
    setTimeout(() => setShowNotesSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <NotebookText className="w-6 h-6 mr-2 text-primary" />
            Your Notes for {plantName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Write your notes about ${plantName} here...`}
            value={notes}
            onChange={handleNotesChange}
            rows={5}
            className="bg-background"
          />
          <div className="flex justify-between items-center">
             <Button onClick={saveNotes} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {showNotesSaved ? <Check className="mr-2 h-4 w-4" /> : null}
              {showNotesSaved ? 'Notes Saved!' : 'Save Notes'}
            </Button>
            <Button
              onClick={toggleBookmark}
              variant="outline"
              className="text-primary border-primary hover:bg-primary/10"
              aria-pressed={isBookmarked}
            >
              <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark Plant'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
