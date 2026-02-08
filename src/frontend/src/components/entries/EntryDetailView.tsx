import { useState, useEffect } from 'react';
import { useGetActivityEntry, useGetPatterns } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import RunAnalysisButton from '../patterns/RunAnalysisButton';

interface EntryDetailViewProps {
  entryId: bigint;
  onBack: () => void;
}

export default function EntryDetailView({ entryId, onBack }: EntryDetailViewProps) {
  const { data: entry, isLoading } = useGetActivityEntry(entryId);
  const { data: allPatterns } = useGetPatterns();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load image if present
  useEffect(() => {
    if (entry?.image) {
      const blob = new Blob([new Uint8Array(entry.image)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (entry?.externalBlob) {
      setImageUrl(entry.externalBlob.getDirectURL());
    }
  }, [entry]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Entries
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Entry not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const date = new Date(Number(entry.timestamp));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Entries
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{entry.sourceLabel}</Badge>
                {(entry.image || entry.externalBlob) && (
                  <Badge variant="outline" className="gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Attachment
                  </Badge>
                )}
              </div>
              <CardTitle>
                {date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
              <CardDescription>
                {date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </CardDescription>
            </div>
            <RunAnalysisButton entryText={entry.notes} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Content</h3>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm font-mono">{entry.notes}</p>
            </div>
          </div>

          {imageUrl && (
            <div>
              <h3 className="font-semibold mb-2">Attached Image</h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <img src={imageUrl} alt="Entry attachment" className="w-full h-auto" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Analysis is primarily based on the text content above.
              </p>
            </div>
          )}

          {allPatterns && allPatterns.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Detected Patterns</h3>
              <div className="space-y-3">
                {allPatterns.map((pattern, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-base">{pattern.patternType}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Confidence: {Number(pattern.confidenceScore)}%
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{Number(pattern.confidenceScore)}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">"{pattern.snippet}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
