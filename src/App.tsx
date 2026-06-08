/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { RSVPEntry, GuestbookWish } from './types';
import WeddingCard from './components/WeddingCard';
import Countdown from './components/Countdown';
import Guestbook from './components/Guestbook';
import LocationMap from './components/LocationMap';
import BackgroundMusic from './components/BackgroundMusic';
import { Sparkles, Heart, Mail, CheckCircle2, FileSpreadsheet, Lock, AlertCircle, X, Check } from 'lucide-react';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [wishes, setWishes] = useState<GuestbookWish[]>([]);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('wedding_whatsapp_number') || '+201021481525';
  });
  
  // Admin Dashboard status
  const [isAdminOpened, setIsAdminOpened] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Initial database of wishes is empty by default so only user-submitted wishes appear
  const initialWishes: GuestbookWish[] = [];

  // Load from local storage on mount
  useEffect(() => {
    const storedRsvps = localStorage.getItem('ahmed_yomna_rsvps');
    if (storedRsvps) {
      setRsvps(JSON.parse(storedRsvps));
    } else {
      // Seed initial RSVPs for elegant dashboards
      const seedRsvps: RSVPEntry[] = [
        { id: 'rsvp-1', name: 'Adham Helaly', status: 'attending', guestsCount: 2, timestamp: new Date().toISOString() },
        { id: 'rsvp-2', name: 'Mahmoud Hegazi', status: 'attending', guestsCount: 1, timestamp: new Date().toISOString() },
        { id: 'rsvp-3', name: 'Yasmine Sabry', status: 'declined', guestsCount: 0, timestamp: new Date().toISOString() },
      ];
      setRsvps(seedRsvps);
      localStorage.setItem('ahmed_yomna_rsvps', JSON.stringify(seedRsvps));
    }

    const storedWishes = localStorage.getItem('ahmed_yomna_wishes_v3');
    if (storedWishes) {
      const parsedWishes: GuestbookWish[] = JSON.parse(storedWishes);
      // Filter out any cached placeholder/seed wishes dynamically
      const userWishes = parsedWishes.filter(w => w && w.id && !w.id.startsWith('seed-'));
      setWishes(userWishes);
      // Update localStorage to match the clean user-only wishes
      if (parsedWishes.length !== userWishes.length) {
        localStorage.setItem('ahmed_yomna_wishes_v3', JSON.stringify(userWishes));
      }
    } else {
      setWishes(initialWishes);
      localStorage.setItem('ahmed_yomna_wishes_v3', JSON.stringify(initialWishes));
    }

    // Generate drift rose petals random indexes
    const generatedPetals = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random start horizontal
      delay: Math.random() * 12, // random delay up to 12s
      duration: 8 + Math.random() * 10, // speed
      size: 8 + Math.random() * 15, // size
    }));
    setPetals(generatedPetals);
  }, []);

  // Save updates helper
  const saveRsvps = (newRsvps: RSVPEntry[]) => {
    setRsvps(newRsvps);
    localStorage.setItem('ahmed_yomna_rsvps', JSON.stringify(newRsvps));
  };

  const saveWishes = (newWishes: GuestbookWish[]) => {
    setWishes(newWishes);
    localStorage.setItem('ahmed_yomna_wishes_v3', JSON.stringify(newWishes));
  };

  // Submit RSVP Handler
  const handleRSVPSubmit = (entry: Omit<RSVPEntry, 'id' | 'timestamp'>) => {
    const newEntry: RSVPEntry = {
      ...entry,
      id: 'rsvp-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...rsvps];
    saveRsvps(updated);

    // If they provided a nice congratulatory wish, append it automatically in blessings guestbook!
    if (entry.dietaryNotes && entry.dietaryNotes.trim().length > 4) {
      const relationshipMap: 'family' | 'friend' | 'wellwisher' = 
        entry.name.toLowerCase().includes('helaly') || entry.name.includes('عائلة') 
          ? 'family' 
          : 'friend';

      const autoWish: GuestbookWish = {
        id: 'wish-auto-' + Date.now(),
        name: entry.name,
        wishText: entry.dietaryNotes,
        relationship: relationshipMap,
        timestamp: new Date().toISOString(),
      };
      saveWishes([autoWish, ...wishes]);
    }
  };

  // Direct Wish Submission Handler
  const handleAddWish = (wish: Omit<GuestbookWish, 'id' | 'timestamp'>) => {
    const newWish: GuestbookWish = {
      ...wish,
      id: 'wish-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    saveWishes([newWish, ...wishes]);
  };

  // Admin Dashboard logins
  const handleAdminVerify = (e: FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026') {
      setIsAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Invalid Pin! Try 2026.');
    }
  };

  // Export CSV Helper
  const exportToCSV = () => {
    if (rsvps.length === 0) return;
    const headers = ['Guest Name', 'Attendance Status', 'Guests Accompanying Count', 'Wishes / Notes', 'Timestamp'];
    const rows = rsvps.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      r.status === 'attending' ? 'Attending' : 'Declined',
      r.guestsCount,
      `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
      r.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_rsvps_ahmed_and_yomna.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleOpenGate = () => {
    setIsOpened(true);
    // Auto-trigger music-play btn element to kick start audio synthesizer context natively
    setTimeout(() => {
      const playBtn = document.getElementById('music-play-btn');
      if (playBtn) playBtn.click();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-champagne/40 to-ivory text-charcoal font-sans relative selection:bg-gold-light/60">
      
      {/* Dynamic Falling Flower Petals Overlay */}
      {isOpened && petals.map((petal) => (
        <div
          key={petal.id}
          className="animate-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            background: `rgba(245, 234, 207, ${0.45 + Math.random() * 0.4})`, // champagne colored pedals
            borderRadius: '50% 0 50% 50%',
            boxShadow: '0 2px 5px rgba(197, 168, 92, 0.1)',
            transform: 'rotate(45deg)',
          }}
        />
      ))}

      {/* Gateway Love Gate / Initial Envelope Cover Screen */}
      {!isOpened ? (
        <div className="fixed inset-0 bg-ivory z-50 overflow-y-auto p-4 md:p-8 text-center animate-fade-in border-[16px] border-white shadow-xl flex flex-col items-center">
          
          {/* Artistic Flair Corners */}
          <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-gold-medium opacity-40 pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-gold-medium opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-gold-medium opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-gold-medium opacity-40 pointer-events-none"></div>
          
          {/* Subtle floral background pattern vectors on gate screen */}
          <div className="absolute top-10 left-10 pointer-events-none opacity-20 text-olive-medium">
            <Heart className="h-44 w-44" />
          </div>
          <div className="absolute bottom-10 right-10 pointer-events-none opacity-20 text-olive-medium">
            <Sparkles className="h-44 w-44" />
          </div>

          <div className="max-w-xl w-full border border-gold-medium/30 rounded-[35px] p-6 md:p-10 relative bg-ivory shadow-xl debossed-border my-auto">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ivory px-4 text-gold-medium">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>

            <span className="font-cinzel text-xs tracking-[0.3em] font-extrabold text-[#75653C] block mb-2 uppercase pt-4">
              The Wedding Invitation
            </span>

            {/* Names Header */}
            <div className="mt-8 mb-6 flex flex-col items-center justify-center">
              <h1 className="font-cursive text-6xl md:text-7xl text-olive-medium leading-none">
                Ahmed
              </h1>
              <span className="font-serif text-2xl text-gold-dark my-2.5 italic font-normal">
                &
              </span>
              <h1 className="font-cursive text-6xl md:text-7xl text-olive-medium leading-none">
                Yomna
              </h1>
            </div>

            {/* Prominent Date & Day Display aligned with user's requests */}
            <div className="bg-champagne/40 border-y border-gold-medium/20 my-6 py-4 px-3 flex flex-col items-center">
              <span className="text-gold-dark font-cinzel text-xs tracking-[0.2em] font-bold uppercase mb-1">
                Wedding Celebration Date
              </span>
              <p className="font-serif text-lg md:text-2xl font-bold text-olive-dark tracking-wide leading-normal">
                Friday • October 16, 2026
              </p>
              <div className="w-10 h-[1px] bg-gold-medium/40 my-2"></div>
              <div className="flex justify-center w-full max-w-[280px] text-xs font-semibold text-[#5A5B53]">
                <span className="font-sans text-center text-xs text-olive-medium font-bold">At 9:00 PM</span>
              </div>
              <span className="text-[11px] text-gold-dark font-semibold mt-1.5 font-sans">
                📍 Tanta - Al Mahallah Al Kubra Rd, Saft Torab
              </span>
            </div>

            {/* Real-time Countdown prominently featured right here! */}
            <div className="mb-6">
              <Countdown />
            </div>

            <button
              onClick={toggleOpenGate}
              id="open-invitation-gate-btn"
              className="px-8 py-4 rounded-full bg-olive-medium hover:bg-olive-dark text-white font-serif tracking-widest text-xs uppercase shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 mx-auto relative pulse-ring-effect cursor-pointer font-bold"
            >
              <Mail className="h-4.5 w-4.5 text-gold-light" />
              Open Invitation
            </button>
            <p className="text-[10px] text-charcoal/50 italic font-mono mt-3">Tapping activates pure wedding music backdrop</p>

          </div>
        </div>
      ) : (
        /* Revealed Content Container */
        <div className="animate-fade-in relative">
          
          {/* Rotating mandala decoration at center backdrop */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.02] text-gold-medium z-0">
            <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] animate-[spin_80s_linear_infinite]">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M50,5 A45,45 0 0,0 95,50 A45,45 0 0,0 50,95 A45,45 0 0,0 5,50 Z" stroke="currentColor" strokeWidth="0.25" />
            </svg>
          </div>

          {/* Luxury Upper Border Line */}
          <div className="h-2 w-full bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark fixed top-0 z-40"></div>

          {/* Scrolling Header Brand */}
          <header className="py-8 text-center border-b border-gold-medium/10">
            <span className="font-cursive text-4xl text-olive-medium block">
              Ahmed & Yomna
            </span>
            <span className="font-cinzel text-[9px] font-extrabold text-[#7E6A3F] tracking-[0.4em] uppercase mt-1 block">
              October 16, 2026
            </span>
          </header>

          {/* Main Layout sections */}
          <main className="container mx-auto px-4 py-8 relative z-10">
            
            {/* Countdown layout */}
            <section id="banner-countdown">
              <Countdown />
            </section>

            {/* Interactive Wedding Card Section */}
            <section id="invitation-card" className="my-10">
              <WeddingCard 
                onRSVPClick={() => {
                  const el = document.getElementById('congratulations-list');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
              />
            </section>

            {/* Location details Map section */}
            <section id="location-guide" className="my-14 border-t border-gold-medium/10 pt-10">
              <LocationMap />
            </section>

            {/* Guest Congratulations Blessings board */}
            <section id="congratulations-list" className="my-14 border-t border-gold-medium/10 pt-10">
              <Guestbook wishes={wishes} onAddWish={handleAddWish} whatsappNumber={whatsappNumber} />
            </section>

          </main>

          {/* Elegant Footer */}
          <footer className="bg-charcoal text-white/95 py-12 px-6 border-t border-gold-medium/20 text-center relative z-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="font-cursive text-4xl text-gold-light">
                Ahmed & Yomna
              </div>
              <p className="text-xs text-neutral-400 font-serif leading-relaxed uppercase tracking-wider">
                Together Forever • October 16, 2026 <br />
                Saft Torab, El Mahalla El Kubra, Gharbia, Egypt
              </p>
              
              {/* Little lock/admin toggle in footer to view results */}
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setIsAdminOpened(true)}
                  id="admin-dashboard-btn"
                  className="text-[10px] text-neutral-400 font-mono tracking-widest hover:text-gold-medium transition-colors flex items-center justify-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
                  title="Couples RSVP Dashboard"
                >
                  <Lock className="h-3 w-3 text-gold-medium" />
                  RSVP ADMIN PANEL
                </button>
              </div>

              <div className="text-[10px] text-neutral-500 font-sans tracking-tight pt-4">
                © 2026 Realized for Ahmed and Yomna. All blessings reserved.
              </div>
            </div>
          </footer>

          {/* Synthesizer Ambient Bell box Background Player */}
          <BackgroundMusic autoStart={true} />

          {/* Admin RSVP Panel Overlay / Modal */}
          {isAdminOpened && (
            <div className="fixed inset-0 z-50 bg-charcoal/80 flex items-center justify-center p-4 backdrop-blur-md">
              <div className="w-full max-w-4xl bg-ivory rounded-3xl border border-gold-medium/40 shadow-2xl overflow-hidden text-charcoal relative animate-scale-up max-h-[90vh] flex flex-col">
                
                {/* Modal close */}
                <button
                  onClick={() => {
                    setIsAdminOpened(false);
                    setIsAdminLoggedIn(false);
                    setAdminPin('');
                    setAdminError('');
                  }}
                  className="absolute top-4 right-4 h-8 w-8 bg-charcoal/10 hover:bg-charcoal/20 rounded-full flex items-center justify-center text-charcoal"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Dashboard Modal Header */}
                <div className="bg-olive-medium p-5 text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gold-light" />
                  <span className="font-serif text-lg tracking-widest uppercase">Admin RSVPs Dashboard</span>
                </div>

                {/* Login screen */}
                {!isAdminLoggedIn ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center py-16">
                    <AlertCircle className="h-10 w-10 text-gold-medium mb-3" />
                    <h3 className="font-serif text-lg font-bold text-olive-medium">Password Verification Required</h3>
                    <p className="text-xs text-charcoal/70 mb-6 max-w-xs leading-relaxed">
                      This page is for Mahmoud, Ahmed, or Yomna to manage RSVPs, view guest counts, and export tables. Input passcode **2026** to open.
                    </p>

                    <form onSubmit={handleAdminVerify} className="w-full max-w-xs space-y-3">
                      <input
                        type="password"
                        placeholder="Pin Code (e.g., 2026)"
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-medium/30 focus:outline-none focus:ring-2 focus:ring-olive-medium text-center font-bold tracking-widest text-sm"
                        autoFocus
                      />
                      {adminError && <p className="text-[11px] text-red-600 font-bold">{adminError}</p>}
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-olive-medium text-white font-serif text-xs font-bold tracking-widest uppercase"
                      >
                        Verify Identity
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Live admin details */
                  <div className="p-6 md:p-8 overflow-y-auto flex-grow flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-champagne pb-5 mb-5">
                      <div className="space-y-1 text-left">
                        <span className="text-[11px] font-mono tracking-widest text-[#B49E72] uppercase font-bold">LIVE STATISTICS</span>
                        <h4 className="font-serif text-2xl font-black text-olive-medium">Ahmed & Yomna Wedding Guests</h4>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {/* Download as CSV option */}
                        <button
                          onClick={exportToCSV}
                          className="px-4 py-2 rounded-xl bg-olive-medium text-white hover:bg-olive-dark text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-gold-light" />
                          Export to Excel/CSV
                        </button>
                        
                        {/* Mini clear option */}
                        <button
                          onClick={() => {
                            if (window.confirm("Do you want to clear RSVPs? This action wipes all local RSVPs.")) {
                              saveRsvps([]);
                              saveWishes([]);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-red-950/20 text-red-850 hover:bg-red-950/30 text-xs font-semibold uppercase tracking-wider"
                        >
                          Clear Lists
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp notification configuration */}
                    <div className="bg-champagne/40 border border-gold-medium/20 p-5 rounded-2xl text-left mb-6 font-sans">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💬</span>
                        <h5 className="font-serif font-bold text-olive-medium text-sm tracking-wide uppercase">WhatsApp Notification Target</h5>
                      </div>
                      <p className="text-xs text-charcoal/70 mb-3 leading-relaxed">
                        Specify the phone number (including country code, e.g. +201021481525) that will receive guest congratulation wishes directly via WhatsApp links on the guestbook submission wall.
                      </p>
                      <div className="flex gap-2 max-w-md">
                        <input
                          type="text"
                          placeholder="+201021481525"
                          value={whatsappNumber}
                          onChange={(e) => {
                            setWhatsappNumber(e.target.value);
                            localStorage.setItem('wedding_whatsapp_number', e.target.value);
                          }}
                          className="flex-grow px-3 py-2 rounded-xl border border-gold-medium/30 focus:outline-none focus:ring-2 focus:ring-olive-medium text-xs font-semibold"
                        />
                        <span className="px-3.5 py-2 text-green-700 bg-green-50 font-bold border border-green-200 rounded-xl text-[10px] uppercase flex items-center justify-center tracking-wider shrink-0 shadow-xs">
                          ✓ Auto Saved
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6 text-left">
                      <div className="bg-champagne/40 border border-gold-medium/10 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#AB8C4A] font-bold">Total Confirmed</span>
                        <p className="text-3xl font-serif font-black text-olive-medium transition-all">
                          {rsvps.filter(r => r.status === 'attending').reduce((acc, curr) => acc + curr.guestsCount, 0)} guests
                        </p>
                      </div>
                      <div className="bg-champagne/40 border border-gold-medium/10 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#AB8C4A] font-bold">RSVP YES Responses</span>
                        <p className="text-3xl font-serif font-black text-olive-medium">
                          {rsvps.filter(r => r.status === 'attending').length} rows
                        </p>
                      </div>
                      <div className="bg-champagne/40 border border-gold-medium/10 p-4 rounded-2xl">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#AB8C4A] font-bold">RSVP NO Responses</span>
                        <p className="text-3xl font-serif font-black text-gray-500">
                          {rsvps.filter(r => r.status === 'declined').length} rows
                        </p>
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-gold-medium/20 rounded-2xl overflow-hidden flex-grow bg-white">
                      <div className="overflow-x-auto max-h-[300px]">
                        <table className="w-full text-left font-sans text-xs border-collapse">
                          <thead>
                            <tr className="bg-champagne/30 text-gold-dark font-serif tracking-widest uppercase text-[9px] border-b border-gold-medium/20">
                              <th className="py-3 px-4 font-extrabold">Name</th>
                              <th className="py-3 px-4 font-extrabold">Attendance</th>
                              <th className="py-3 px-4 font-extrabold">Guests Count</th>
                              <th className="py-3 px-4 font-extrabold">Wishes / Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rsvps.map((guest) => (
                              <tr key={guest.id} className="border-b border-champagne hover:bg-champagne/10">
                                <td className="py-3.5 px-4 font-bold text-olive-medium">{guest.name}</td>
                                <td className="py-3.5 px-4">
                                  {guest.status === 'attending' ? (
                                    <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                                      <Check className="h-3 w-3" /> Attending
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 font-semibold">Declined 💔</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold">{guest.guestsCount}</td>
                                <td className="py-3.5 px-4 italic text-neutral-600 truncate max-w-[200px]" title={guest.dietaryNotes}>
                                  {guest.dietaryNotes || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
