import React, { useState } from 'react';
import { AcademicBanner } from '../components/AcademicBanner';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DemoWalkthroughBanner } from '../components/DemoWalkthroughBanner';
import { User, PatientNotification } from '../types';

interface MainLayoutProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  notifications: PatientNotification[];
  onMarkNotificationRead: (id: string) => void;
  currentView: string;
  onNavigate: (viewId: string) => void;
  onNavigateToLanding: () => void;
  onResetData: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentUser,
  onSelectUser,
  onLogout,
  notifications,
  onMarkNotificationRead,
  currentView,
  onNavigate,
  onNavigateToLanding,
  onResetData,
  children,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800 antialiased">
      {/* 1. Academic Disclaimer Banner */}
      <AcademicBanner onResetData={onResetData} />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={onSelectUser}
        onLogout={onLogout}
        notifications={notifications}
        onMarkNotificationRead={onMarkNotificationRead}
        onToggleMobileSidebar={() => setIsOpenMobile(true)}
        onNavigate={onNavigate}
      />

      {/* 3. Demo Flow Walkthrough Banner */}
      <DemoWalkthroughBanner currentView={currentView} onNavigate={onNavigate} />

      {/* 4. App Shell (Sidebar + Main Content Area) */}
      <div className="flex-1 flex w-full">
        <Sidebar
          currentView={currentView}
          currentUserRole={currentUser.role}
          onNavigate={onNavigate}
          onNavigateToLanding={onNavigateToLanding}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 5. Persistent Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500">
        <p>
          “Academic Demonstration Project | Demo Data Only | Not for Real Medical Use”
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          AI-Powered Healthcare Management and Patient Engagement System • College Software Prototype (~50% Milestone)
        </p>
      </footer>
    </div>
  );
};
