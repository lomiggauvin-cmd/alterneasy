import React, { useEffect } from 'react';
import { useStore } from '../stores/store';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import EmailVerificationScreen from './EmailVerificationScreen';
import OnboardingScreen from './OnboardingScreen';
import DashboardScreen from './DashboardScreen';
import PipelineScreen from './PipelineScreen';
import ImportScreen from './ImportScreen';
import MessageGeneratorScreen from './MessageGeneratorScreen';
import ContactsScreen from './ContactsScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import ProfileScreen from './ProfileScreen';

export default function AppContainer() {
  const currentScreen = useStore((state) => state.currentScreen);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const onboardingDone = useStore((state) => state.userPreferences.onboardingDone);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const authScreens: string[] = ['login', 'signup', 'emailVerification'];
  if (!onboardingDone && !authScreens.includes(currentScreen)) {
    return <OnboardingScreen />;
  }

  switch (currentScreen) {
    case 'login':             return <LoginScreen />;
    case 'signup':            return <SignupScreen />;
    case 'emailVerification': return <EmailVerificationScreen />;
    case 'onboarding':        return <OnboardingScreen />;
    case 'dashboard':         return <DashboardScreen />;
    case 'pipeline':          return <PipelineScreen />;
    case 'contacts':          return <ContactsScreen />;
    case 'import':            return <ImportScreen />;
    case 'messageGenerator':  return <MessageGeneratorScreen />;
    case 'profileSettings':   return <ProfileSettingsScreen />;
    case 'profile':           return <ProfileScreen />;
    default:                  return <DashboardScreen />;
  }
}
