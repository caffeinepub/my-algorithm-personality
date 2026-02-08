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
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src="/assets/generated/map-logo.dim_512x512.png" 
                alt="My Algorithm" 
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Algorithm</h1>
              <p className="text-xs text-muted-foreground">Transform your digital habits</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-20 z-40">
        <div className="container flex items-center gap-2 px-6 py-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex-shrink-0 transition-all duration-200 hover:scale-105"
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
            className="flex-shrink-0 transition-all duration-200 hover:scale-105"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Library
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-8">
        <div className="container px-6 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
