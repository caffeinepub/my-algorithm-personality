import { useState } from 'react';
import { useGetActivityEntries } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Image as ImageIcon } from 'lucide-react';
import EntryDetailView from './EntryDetailView';

interface EntriesListViewProps {
  onNavigateToAdd: () => void;
}

export default function EntriesListView({ onNavigateToAdd }: EntriesListViewProps) {
  const { data: entries, isLoading } = useGetActivityEntries();
  const [selectedEntryId, setSelectedEntryId] = useState<bigint | null>(null);

  if (selectedEntryId !== null) {
    return <EntryDetailView entryId={selectedEntryId} onBack={() => setSelectedEntryId(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Entries</h2>
          <p className="text-muted-foreground mt-2">
            View and analyze your online activity data.
          </p>
        </div>
        <Button onClick={onNavigateToAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Loading entries...</p>
          </div>
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries
            .sort((a, b) => Number(b.timestamp - a.timestamp))
            .map((entry) => {
              const date = new Date(Number(entry.timestamp));
              const preview = entry.notes.slice(0, 150) + (entry.notes.length > 150 ? '...' : '');
              
              return (
                <Card
                  key={entry.id.toString()}
                  className="cursor-pointer transition-colors hover:bg-accent/50"
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{entry.sourceLabel}</Badge>
                          {(entry.image || entry.externalBlob) && (
                            <Badge variant="outline" className="gap-1">
                              <ImageIcon className="h-3 w-3" />
                              Image
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Start by adding your first online activity entry to begin pattern analysis.
            </p>
            <Button onClick={onNavigateToAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
