import { useState } from 'react';
import { useAddActivityEntry } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Plus } from 'lucide-react';

interface AddEntryViewProps {
  onSuccess: () => void;
}

const SOURCE_LABELS = [
  'Shopping',
  'Social Feed',
  'Messages',
  'Browsing',
  'News',
  'Entertainment',
  'Work',
  'Other',
];

export default function AddEntryView({ onSuccess }: AddEntryViewProps) {
  const [text, setText] = useState('');
  const [sourceLabel, setSourceLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const addEntry = useAddActivityEntry();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error('Please paste some text to analyze');
      return;
    }

    if (!sourceLabel) {
      toast.error('Please select a source');
      return;
    }

    try {
      let imageBytes: Uint8Array | undefined;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        imageBytes = new Uint8Array(arrayBuffer);
      }

      await addEntry.mutateAsync({
        timestamp: BigInt(Date.now()),
        sourceLabel,
        notes: text.trim() + (notes.trim() ? '\n\n' + notes.trim() : ''),
        image: imageBytes,
      });

      toast.success('Entry added successfully!');
      setText('');
      setSourceLabel('');
      setNotes('');
      setImageFile(null);
      onSuccess();
    } catch (error) {
      toast.error('Failed to add entry. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Entry</h2>
        <p className="text-muted-foreground mt-2">
          Paste text from your online activity to analyze patterns and habits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Data</CardTitle>
          <CardDescription>
            Paste text from social media, shopping sites, messages, or any online activity. Screenshots are stored as attachments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select value={sourceLabel} onValueChange={setSourceLabel}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select where this data is from" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_LABELS.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Paste Your Text *</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste text from posts, messages, product descriptions, etc..."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Analysis is based on this text. The more you provide, the better the pattern detection.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context, feelings, or observations..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Attach Screenshot (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                {imageFile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setImageFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Screenshots are stored as attachments. Analysis focuses on the text you paste above.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={addEntry.isPending} className="flex-1">
                {addEntry.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
