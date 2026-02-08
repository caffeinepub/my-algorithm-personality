import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileText, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

type View = 'today' | 'entries' | 'add-entry' | 'patterns' | 'program' | 'library';

interface AppLayoutProps {
  children: ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function AppLayout({ children, currentView, onNavigate }: AppLayoutProps) {
  const navItems = [
    { id: 'today' as View, label: 'Today', icon: Home },
    { id: 'entries' as View, label: 'Entries', icon: FileText },
    { id: 'patterns' as View, label: 'Patterns', icon: TrendingUp },
    { id: 'program' as View, label: 'Program', icon: Calendar },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/map-logo.dim_512x512.png" alt="My Algorithm" className="h-8 w-8" />
            <h1 className="text-xl font-semibold tracking-tight">My Algorithm</h1>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container flex items-center gap-1 px-4 py-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex-shrink-0"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
          <Button
            variant={currentView === 'library' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('library')}
            className="flex-shrink-0"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Library
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
