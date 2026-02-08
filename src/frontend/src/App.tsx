import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import OnboardingDialog from './components/onboarding/OnboardingDialog';
import AccessDeniedScreen from './components/common/AccessDeniedScreen';
import AddEntryView from './components/entries/AddEntryView';
import EntriesListView from './components/entries/EntriesListView';
import PatternsDashboardView from './components/patterns/PatternsDashboardView';
import ProgramView from './components/program/ProgramView';
import TodayCheckInView from './components/today/TodayCheckInView';
import HabitLibraryView from './components/habits/HabitLibraryView';

type View = 'today' | 'entries' | 'add-entry' | 'patterns' | 'program' | 'library';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('today');
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding-dismissed');
    setOnboardingDismissed(dismissed === 'true');
  }, []);

  const handleDismissOnboarding = () => {
    localStorage.setItem('onboarding-dismissed', 'true');
    setOnboardingDismissed(true);
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showOnboarding = isAuthenticated && userProfile && !onboardingDismissed;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AccessDeniedScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppLayout currentView={currentView} onNavigate={setCurrentView}>
        {currentView === 'today' && <TodayCheckInView />}
        {currentView === 'entries' && <EntriesListView onNavigateToAdd={() => setCurrentView('add-entry')} />}
        {currentView === 'add-entry' && <AddEntryView onSuccess={() => setCurrentView('entries')} />}
        {currentView === 'patterns' && <PatternsDashboardView />}
        {currentView === 'program' && <ProgramView />}
        {currentView === 'library' && <HabitLibraryView />}
      </AppLayout>

      {showProfileSetup && <ProfileSetupModal />}
      {showOnboarding && <OnboardingDialog onDismiss={handleDismissOnboarding} />}
      <Toaster />
    </ThemeProvider>
  );
}
