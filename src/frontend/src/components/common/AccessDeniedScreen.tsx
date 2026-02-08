import LoginButton from '../auth/LoginButton';
import { Shield } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Shield className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to My Algorithm</h1>
          <p className="text-muted-foreground">
            Please sign in to access your personalized habit transformation journey.
          </p>
        </div>
        <div className="pt-4">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
