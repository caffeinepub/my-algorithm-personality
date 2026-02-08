import { useState } from 'react';
import { useGetPatterns, useGetActivityEntries } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { summarizePatterns } from '../../patterns/summarizePatterns';

export default function PatternsDashboardView() {
  const { data: patterns, isLoading: patternsLoading } = useGetPatterns();
  const { data: entries } = useGetActivityEntries();
  const [window, setWindow] = useState<'7' | '30'>('7');

  const summary = patterns ? summarizePatterns(patterns, window === '7' ? 7 : 30) : null;

  if (patternsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading patterns...</p>
        </div>
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Pattern Dashboard</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No patterns detected yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Add entries and run analysis to discover your behavioral patterns.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pattern Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Understand your behavioral loops and triggers
          </p>
        </div>
        <Tabs value={window} onValueChange={(v) => setWindow(v as '7' | '30')}>
          <TabsList>
            <TabsTrigger value="7">Last 7</TabsTrigger>
            <TabsTrigger value="30">Last 30</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {summary && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Patterns</CardDescription>
                <CardTitle className="text-3xl">{summary.totalPatterns}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pattern Types</CardDescription>
                <CardTitle className="text-3xl">{summary.uniqueTypes}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Confidence</CardDescription>
                <CardTitle className="text-3xl">{summary.avgConfidence}%</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Pattern Types</CardTitle>
              <CardDescription>Most frequently detected behavioral patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.topTypes.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.type}</h4>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Snippets</CardTitle>
              <CardDescription>Recurring phrases and triggers in your activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.commonSnippets.slice(0, 5).map((snippet, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-sm italic">"{snippet}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {entries && entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      You've analyzed {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} and detected {patterns.length} pattern{patterns.length === 1 ? '' : 's'}.
                      {summary.topTypes.length > 0 && (
                        <> Your most common pattern is <strong>{summary.topTypes[0].type}</strong>, appearing {summary.topTypes[0].count} time{summary.topTypes[0].count === 1 ? '' : 's'}.</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
