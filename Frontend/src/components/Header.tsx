import React, { useState, useEffect } from 'react';
import { ArrowRight, User, LogOut } from 'lucide-react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { IndiaSchemeMap } from './IndiaSchemeMap';
import type { AuthUser } from '../api/auth';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onStartEligibility: () => void;
  onOpenQuickInfo?: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const EMBLEM_URL = '/schemesetu-mark.svg';

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
  onStartEligibility,
  onOpenQuickInfo,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  useEffect(() => {
    if (showMap) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMap]);

  useEffect(() => {
    setShowAccountMenu(false);
  }, [currentUser]);

  const t = TRANSLATIONS[language];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f3]/95 backdrop-blur-md border-b border-[#c3c6ce]/30 shadow-xs">
      <div className="h-20 max-w-[75rem] mx-auto px-4 lg:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 cursor-pointer group text-left"
            aria-label="SchemeSetu Home"
          >
            <img
              src={EMBLEM_URL}
              alt="SchemeSetu"
              className="w-10 h-10 object-contain"
            />
            <div className="flex items-baseline font-bold text-2xl tracking-tight">
              <span className="text-[#16324F]">Scheme</span>
              <span className="text-[#C0392B]">Setu</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${currentView === 'landing' ? 'text-[#16324F]' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
          >
            {t.howItWorks}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('schemes')}
            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${currentView === 'schemes' ? 'text-[#C0392B] underline font-bold' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
          >
            {t.schemeRepo}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('transparency')}
            className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${currentView === 'transparency' ? 'text-[#C0392B] underline font-bold' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
          >
            {t.transparency}
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-sm font-semibold text-[#43474d] hover:text-[#C0392B] transition-colors duration-200 cursor-pointer"
          >
            {t.about}
          </button>
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center px-2.5 py-1 rounded-lg bg-[#f0eee8] border border-[#c3c6ce]/40 text-[#43474d] text-xs font-bold tracking-wider uppercase">
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`transition-colors cursor-pointer ${language === 'en' ? 'text-[#16324F] font-extrabold' : 'hover:text-[#C0392B]'
                }`}
            >
              EN
            </button>
            <span className="mx-1.5 text-[#c3c6ce]">/</span>
            <button
              type="button"
              onClick={() => onToggleLanguage('hi')}
              className={`transition-colors cursor-pointer ${language === 'hi' ? 'text-[#C0392B] font-extrabold' : 'hover:text-[#C0392B]'
                }`}
            >
              हिंदी
            </button>
          </div>

          {/* Scheme Map Button */}
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f0eee8] border border-[#c3c6ce]/40 text-[#16324f] text-xs font-semibold hover:bg-[#e4e2dd] transition-all cursor-pointer"
          >
            <span>Scheme Map</span>
          </button>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={onStartEligibility}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16324f] text-white text-xs font-semibold hover:bg-[#10243a] transition-all shadow-xs cursor-pointer group"
          >
            <span>{t.checkEligibilityBtn}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* User / Profile Info Indicator */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  setShowAccountMenu((open) => !open);
                } else {
                  onOpenAuth();
                }
              }}
              title={currentUser ? 'Account' : 'Sign in'}
              aria-expanded={currentUser ? showAccountMenu : undefined}
              aria-haspopup={currentUser ? 'menu' : undefined}
              className="w-9 h-9 rounded-full bg-[#eae8e2] border border-[#c3c6ce]/40 flex items-center justify-center text-[#16324F] hover:bg-[#e4e2dd] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {currentUser && showAccountMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-[#c3c6ce]/40 rounded-xl shadow-lg p-4 z-[100]">
                <p className="text-sm font-bold text-[#001d37]">
                  {currentUser.name}
                </p>

                <p className="text-xs text-[#74777e] mt-1 break-all">
                  {currentUser.email}
                </p>

                <div className="border-t border-[#c3c6ce]/30 mt-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccountMenu(false);
                      onLogout();
                    }}
                    className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#C0392B] hover:bg-[#fff0ee] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showMap && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setShowMap(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-lg font-bold text-[#001d37]">
                Scheme Coverage Map
              </span>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="w-9 h-9 rounded-full bg-[#f0eee8] flex items-center justify-center text-[#43474d] hover:bg-[#e4e2dd] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <IndiaSchemeMap />
            <button
              type="button"
              onClick={() => {
                setShowMap(false);
                onStartEligibility();
              }}
              className="w-full mt-4 py-3 rounded-lg bg-[#16324f] text-white text-sm font-semibold hover:bg-[#10243a] transition-all cursor-pointer"
            >
              Check your eligibility →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
