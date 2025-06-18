'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UploadCloud, Leaf, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { recognizePlant, RecognizePlantOutput } from '@/ai/flows/recognize-plant';
import { useToast } from '@/hooks/use-toast';

export default function PlantRecognitionForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognizePlantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB. Please choose a smaller image.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !previewUrl) {
      setError('Please select an image file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const recognitionResult = await recognizePlant({ photoDataUri: previewUrl });
      setResult(recognitionResult);
       toast({
        title: "Plant Recognized!",
        description: `Successfully identified ${recognitionResult.identification.commonName}.`,
        variant: "default",
      });
    } catch (e) {
      console.error('Recognition error:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during plant recognition.';
      setError(`Failed to recognize plant: ${errorMessage}`);
      toast({
        title: "Recognition Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Sparkles className="w-7 h-7 mr-2 text-primary" />
          Identify a Plant
        </CardTitle>
        <CardDescription>
          Upload an image of a plant, and our AI will try to identify it and provide information about its AYUSH uses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card 
            className="border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors cursor-pointer"
            onClick={handleCardClick}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                 if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
                 handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
            aria-label="Upload plant image"
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              {previewUrl ? (
                <div className="relative w-full max-w-xs aspect-square rounded-md overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <>
                  <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="font-semibold text-foreground">Click or drag & drop to upload an image</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                </>
              )}
            </CardContent>
          </Card>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden" 
            aria-hidden="true" // Hidden, interaction via card
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading || !file} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Leaf className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Identifying...' : 'Identify Plant'}
          </Button>
        </form>

        {result && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center text-primary">
                <CheckCircle className="w-6 h-6 mr-2" />
                Recognition Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground">Common Name:</h4>
                <p className="text-foreground/80">{result.identification.commonName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Latin Name:</h4>
                <p className="text-foreground/80">{result.identification.latinName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">AYUSH Uses:</h4>
                <p className="text-foreground/80 leading-relaxed">{result.identification.ayushUses}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
