import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getLiveUrl } from '@/utils/liveUrl';

export default function CanisterResolutionFallback() {
  const liveUrl = getLiveUrl();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleOpenInNewWindow = () => {
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Connection Issue</h1>
          <p className="text-lg text-muted-foreground">
            We're having trouble connecting to the Internet Computer network.
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>What happened?</AlertTitle>
          <AlertDescription>
            The canister ID could not be resolved. This usually happens when the browser reaches the URL before the
            Internet Computer has finished routing the canister, or when there's a temporary network issue.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Try these steps:</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">Hard refresh this page</strong> — Press Ctrl+Shift+R (Windows/Linux)
              or Cmd+Shift+R (Mac)
            </li>
            <li>
              <strong className="text-foreground">Wait 10-20 seconds</strong> and try again — The network may still be
              initializing
            </li>
            <li>
              <strong className="text-foreground">Open in a private/incognito window</strong> — This clears any cached
              routing artifacts
            </li>
            <li>
              <strong className="text-foreground">Verify you're using the correct URL:</strong>
              <div className="mt-2 p-3 bg-muted rounded-md font-mono text-sm break-all">{liveUrl}</div>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleRefresh} className="flex-1" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
          <Button onClick={handleOpenInNewWindow} variant="outline" className="flex-1" size="lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Window
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          If the issue persists after trying these steps, the deployment may still be in progress. Please wait a few
          minutes and try again.
        </div>
      </div>
    </div>
  );
}
