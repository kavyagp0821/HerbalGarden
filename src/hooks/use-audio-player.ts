// src/hooks/use-audio-player.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cardAudioFlow } from '@/ai/flows/card-audio-flow';
import { useToast } from '@/hooks/use-toast';

// This will hold the single audio element for the entire app
let audio: HTMLAudioElement | null = null;
// This will hold a reference to the currently active stop function
let currentStopCallback: (() => void) | null = null;
// This will hold the ID of the currently playing/loading item
let currentAudioId: string | null = null;

export const useAudioPlayer = (id: string, textToSpeak: string) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isCancelled = useRef(false);

  // This effect ensures that only one `useAudioPlayer` instance reports "isPlaying" at a time.
  useEffect(() => {
    const handleStateChange = () => {
      if (currentAudioId !== id) {
        setIsPlaying(false);
        setIsLoading(false);
      }
    };
    window.addEventListener('audiostatechange', handleStateChange);
    return () => {
      window.removeEventListener('audiostatechange', handleStateChange);
    };
  }, [id]);

  const stopAudio = useCallback(() => {
    isCancelled.current = true;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    // Check if this instance is the one that's supposed to be playing.
    if(currentAudioId === id) {
        setIsPlaying(false);
        setIsLoading(false);
        currentAudioId = null;
        currentStopCallback = null;
        window.dispatchEvent(new CustomEvent('audiostatechange'));
    }
  }, [id]);

  useEffect(() => {
    // Cleanup function to stop audio if the component unmounts
    return () => {
        if(currentAudioId === id) {
            stopAudio();
        }
    }
  }, [id, stopAudio])


  const playAudio = useCallback(async () => {
    // If another audio is playing, stop it first.
    if (currentStopCallback) {
      currentStopCallback();
    }
    
    isCancelled.current = false;
    currentAudioId = id;
    window.dispatchEvent(new CustomEvent('audiostatechange')); // Notify other hooks

    setIsLoading(true);
    setIsPlaying(false);

    // This callback is now responsible for all state cleanup.
    currentStopCallback = () => {
        isCancelled.current = true; // Mark as cancelled so any pending operations know to stop.
        if(audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setIsPlaying(false);
        setIsLoading(false);
        if(currentAudioId === id) { // Only clear global state if this instance is the active one
            currentAudioId = null;
            currentStopCallback = null;
        }
        window.dispatchEvent(new CustomEvent('audiostatechange'));
    };

    try {
      const result = await cardAudioFlow({ plantId: id, textToSpeak });
      
      // If a new request started or this one was cancelled, stop.
      if (isCancelled.current || currentAudioId !== id) {
          setIsLoading(false);
          return;
      }
      
      if (!audio) {
        audio = new Audio();
        audio.onended = () => {
           currentStopCallback && currentStopCallback();
        };
        audio.onerror = () => {
          toast({ title: "Audio Error", description: "Could not play the audio file.", variant: "destructive" });
          currentStopCallback && currentStopCallback();
        };
      }
      
      audio.src = result.audioDataUri;
      audio.onplaying = () => {
        if (currentAudioId === id) { // Only update state if still the active player
          setIsPlaying(true);
          setIsLoading(false);
        }
      };
      
      audio.play();

    } catch (error) {
      console.error("TTS Generation Error:", error);
      toast({
        title: "Audio Generation Failed",
        description: "Could not generate audio. Please add your GEMINI_API_KEY to the .env file and try again.",
        variant: "destructive"
      });
      // Use the stop callback for cleanup
      if(currentStopCallback) currentStopCallback();
    }
  }, [id, textToSpeak, toast]);

  return { isPlaying, isLoading, playAudio, stopAudio: currentStopCallback || stopAudio };
};
