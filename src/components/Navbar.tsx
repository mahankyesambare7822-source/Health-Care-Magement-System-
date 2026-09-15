import React, { useState } from 'react';
import {
  HeartPulse,
  Bell,
  Menu,
  CheckCheck,
  UserCheck,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { User, PatientNotification } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
  notifications: PatientNotification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleMobileSidebar: () => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm sm:text-base tracking-tight leading-tight">
                  AI Healthcare Management
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  50% Milestone
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 leading-none mt-0.5">
                Patient Engagement & Clinical Informatics Prototype
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notifications & User Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Popover */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
              aria-label="Simulated patient notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                id="notifications-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Simulated Patient Alerts
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {unreadCount} unread system notifications
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Demo Dispatcher
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications logged.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs transition-colors ${
                          !n.read ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-800">{n.title}</span>
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => onMarkNotificationRead(n.id)}
                              className="text-blue-600 hover:text-blue-800 text-[10px] flex items-center gap-0.5 shrink-0 cursor-pointer"
                            >
                              <CheckCheck className="w-3 h-3" /> Mark read
                            </button>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                          <span>Patient: {n.patientName}</span>
                          <span>{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('engagement');
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Open Engagement Notification Dispatcher →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              id="user-menu-btn"
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                  {currentUser.role} • {currentUser.department}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div
                id="user-persona-dropdown"
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Switch Demo Persona
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Simulate role-based clinical perspectives
                  </p>
                </div>

                <div className="py-1">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-blue-50/70 font-semibold text-blue-700'
                          : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {u.title} ({u.role})
                        </p>
                      </div>
                      {currentUser.id === u.id && <UserCheck className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1 mt-1 border-t border-slate-100 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Return to Demo Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
