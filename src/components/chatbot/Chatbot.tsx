
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Sparkles, Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { chatbotFlow } from '@/ai/flows/chatbot-flow';
import { z } from 'zod';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const flowInput = {
            history: messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            message: input,
        }
        
        const reply = await chatbotFlow(flowInput);

        const modelMessage: ChatMessage = { role: 'model', content: reply };
        setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
          <MessageCircle className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary"/>
            AYUSH Garden Assistant
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
             <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>
                <div className="bg-muted p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Hello! I'm your friendly guide to the AYUSH Virtual Garden. How can I help you today?</p>
                </div>
            </div>

            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'model' && <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>}
                
                <div className={`p-3 rounded-lg max-w-xs ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm">{message.content}</p>
                </div>

                {message.role === 'user' && <div className="p-2 rounded-full bg-accent text-accent-foreground"><User /></div>}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot /></div>
                    <div className="bg-muted p-3 rounded-lg max-w-xs">
                        <p className="text-sm animate-pulse">Thinking...</p>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
            <div className="flex w-full space-x-2">
                <Input
                    type="text"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || input.trim() === ''}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
