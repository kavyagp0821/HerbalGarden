// src/context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface LanguageContextType {
  targetLanguage: string;
  setTargetLanguage: Dispatch<SetStateAction<string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children, value }: { children: ReactNode, value: LanguageContextType }) => {
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
