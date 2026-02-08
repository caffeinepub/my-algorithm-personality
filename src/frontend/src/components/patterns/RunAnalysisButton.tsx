import { useState } from 'react';
import { useAddPattern } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { detectPatterns } from '../../analysis/detectPatterns';

interface RunAnalysisButtonProps {
  entryText: string;
}

export default function RunAnalysisButton({ entryText }: RunAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const addPattern = useAddPattern();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const patterns = detectPatterns(entryText);
      
      if (patterns.length === 0) {
        toast.info('No clear patterns detected in this entry. Try adding more detailed text.');
        return;
      }

      for (const pattern of patterns) {
        await addPattern.mutateAsync({
          patternType: pattern.type,
          confidenceScore: BigInt(pattern.confidence),
          snippet: pattern.snippet,
        });
      }

      toast.success(`Detected ${patterns.length} pattern${patterns.length > 1 ? 's' : ''}!`);
    } catch (error) {
      toast.error('Failed to analyze entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm">
      {isAnalyzing ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze
        </>
      )}
    </Button>
  );
}
