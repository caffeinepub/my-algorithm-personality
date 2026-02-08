import { useState } from 'react';
import { useGetPatterns, useGetActivityEntries } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { summarizePatterns } from '../../patterns/summarizePatterns';
import {
  computeEmotionalTrends,
  computeSpendingTriggers,
  computeTimeDistribution,
} from '../../analysis/dashboardInsights';
import EmotionalTrendsSection from './insights/EmotionalTrendsSection';
import SpendingTriggersSection from './insights/SpendingTriggersSection';
import MorningNightDistributionSection from './insights/MorningNightDistributionSection';

export default function PatternsDashboardView() {
  const { data: patterns, isLoading: patternsLoading } = useGetPatterns();
  const { data: entries } = useGetActivityEntries();
  const [window, setWindow] = useState<'7' | '30'>('7');

  const windowDays = window === '7' ? 7 : 30;
  const summary = patterns ? summarizePatterns(patterns, windowDays) : null;

  // Compute insights
  const emotionalTrends = patterns && entries ? computeEmotionalTrends(patterns, entries, windowDays) : [];
  const spendingTriggers = patterns && entries ? computeSpendingTriggers(patterns, entries, windowDays) : [];
  const timeDistribution = patterns && entries ? computeTimeDistribution(patterns, entries, windowDays) : { morning: 0, afternoon: 0, evening: 0, night: 0 };

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
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Pattern Dashboard</h2>
          <p className="text-lg text-muted-foreground">Discover the hidden patterns in your digital behavior</p>
        </div>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <TrendingUp className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No patterns detected yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Add entries and run analysis to discover your behavioral patterns and unlock personalized insights.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Pattern Dashboard</h2>
          <p className="text-lg text-muted-foreground">Understand your behavioral loops and triggers</p>
        </div>
        <Tabs value={window} onValueChange={(v) => setWindow(v as '7' | '30')} className="transition-all">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="7" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last 7</TabsTrigger>
            <TabsTrigger value="30" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last 30</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {summary && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium">Total Patterns</CardDescription>
                <CardTitle className="text-4xl font-bold">{summary.totalPatterns}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium">Pattern Types</CardDescription>
                <CardTitle className="text-4xl font-bold">{summary.uniqueTypes}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium">Avg Confidence</CardDescription>
                <CardTitle className="text-4xl font-bold">{summary.avgConfidence}%</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Advanced Insights Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight">Advanced Insights</h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <EmotionalTrendsSection trends={emotionalTrends} />
              <SpendingTriggersSection triggers={spendingTriggers} windowDays={windowDays} />
              <MorningNightDistributionSection distribution={timeDistribution} />
            </div>
          </div>

          {/* Top Pattern Types */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Top Pattern Types</CardTitle>
              <CardDescription>Most frequently detected behavioral patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {summary.topTypes.map((item) => (
                  <div key={item.type} className="flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.type}</h4>
                        <Badge variant="secondary" className="text-sm px-3 py-1">{item.count}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Snippets */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Common Snippets</CardTitle>
              <CardDescription>Recurring phrases and triggers in your activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {summary.commonSnippets.slice(0, 6).map((snippet, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:border-primary/30"
                  >
                    <p className="text-sm italic leading-relaxed">"{snippet}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Insight */}
          {entries && entries.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-6">
                <div className="flex gap-4">
                  <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed">
                    <p className="text-foreground">
                      You've analyzed <strong>{entries.length}</strong> entr{entries.length === 1 ? 'y' : 'ies'} and detected <strong>{patterns.length}</strong> pattern{patterns.length === 1 ? '' : 's'}.
                      {summary.topTypes.length > 0 && (
                        <> Your most common pattern is <strong>{summary.topTypes[0].type}</strong>, appearing <strong>{summary.topTypes[0].count}</strong> time{summary.topTypes[0].count === 1 ? '' : 's'}.</>
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
