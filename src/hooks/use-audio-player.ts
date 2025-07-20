// src/hooks/use-audio-player.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
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

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      currentAudioId = null;
    }
  }, []);

  useEffect(() => {
    // This effect ensures that only one `useAudioPlayer` instance reports "isPlaying" at a time.
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


  const playAudio = useCallback(async () => {
    // If another audio is playing, stop it first.
    if (currentStopCallback) {
      currentStopCallback();
    }

    currentAudioId = id;
    window.dispatchEvent(new CustomEvent('audiostatechange')); // Notify other hooks

    setIsLoading(true);

    try {
      const result = await textToSpeech(textToSpeak);
      
      // If another request started while this one was loading, do nothing.
      if (currentAudioId !== id) {
          setIsLoading(false);
          return;
      }
      
      if (!audio) {
        audio = new Audio();
      }
      audio.src = result.audioDataUri;
      
      audio.onplaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        currentAudioId = null;
        window.dispatchEvent(new CustomEvent('audiostatechange'));
      };
      
      audio.onerror = () => {
        toast({ title: "Audio Error", description: "Could not play the audio file.", variant: "destructive" });
        setIsPlaying(false);
        setIsLoading(false);
        currentAudioId = null;
        window.dispatchEvent(new CustomEvent('audiostatechange'));
      };

      currentStopCallback = () => {
          if(audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          setIsPlaying(false);
          setIsLoading(false);
          currentAudioId = null;
          currentStopCallback = null;
          window.dispatchEvent(new CustomEvent('audiostatechange'));
      };
      
      audio.play();

    } catch (error) {
      console.error("TTS Generation Error:", error);
      toast({
        title: "Audio Generation Failed",
        description: "Could not generate audio. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
      currentAudioId = null;
      window.dispatchEvent(new CustomEvent('audiostatechange'));
    }
  }, [id, textToSpeak, toast]);

  return { isPlaying, isLoading, playAudio, stopAudio: currentStopCallback || stopAudio };
};
