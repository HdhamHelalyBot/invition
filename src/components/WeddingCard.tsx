/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Calendar, MapPin, Clipboard, Check } from 'lucide-react';

interface WeddingCardProps {
  onRSVPClick: () => void;
}

export default function WeddingCard({ onRSVPClick }: WeddingCardProps) {
  const [copied, setCopied] = useState(false);
  const addressDetails = "Tanta - Al Mahallah Al Kubra Rd, Villa Salz Burg, El Mahalla El Kubra, Gharbia Governorate";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="wedding-card-section" className="relative flex flex-col items-center justify-center py-6 px-4">
      
      {/* Main Card Element mimicking the user's attachment */}
      <div 
        className="w-full max-w-xl bg-[#FAF9F6] shadow-2xl rounded-[40px] border-8 border-champagne p-6 md:p-10 relative overflow-hidden transition-all duration-500 animate-float"
        style={{ boxShadow: '0 25px 50px -12px rgba(78, 93, 72, 0.15), 0 0 40px rgba(197, 168, 92, 0.08)' }}
      >
        {/* Sleek Golden Arch Border from User's Image */}
        <div className="absolute inset-x-6 top-6 bottom-6 border-2 border-gold-medium/60 rounded-t-full pointer-events-none z-10"></div>
        <div className="absolute inset-x-[28px] top-[28px] bottom-[28px] border border-gold-light/40 rounded-t-full pointer-events-none z-10"></div>

        {/* Artistic Corner Accents if any */}
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-gold-medium/40 pointer-events-none z-10"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-gold-medium/40 pointer-events-none z-10"></div>

        {/* Watercolor Botanical Tree Design - Top Right Cascading Over Arch */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none z-20">
          <svg viewBox="0 0 250 250" className="w-full h-full text-olive-medium" fill="none" stroke="currentColor">
            {/* Main branch stems radiating down */}
            <path d="M250,0 Q180,20 120,60" stroke="#8d7345" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M210,15 Q150,55 100,110" stroke="#8d7345" strokeWidth="2.0" strokeLinecap="round" />
            <path d="M235,5 Q190,70 160,130" stroke="#8d7345" strokeWidth="1.8" strokeLinecap="round" />
            
            {/* Soft Green Leaves */}
            {/* Dark green */}
            <path d="M120,60 C90,50 85,25 105,35 C125,45 130,70 120,60 Z" fill="#4e5d48" fillOpacity="0.9" stroke="#354031" strokeWidth="0.5" />
            <path d="M100,110 C70,105 65,85 85,95 C105,105 110,120 100,110 Z" fill="#4e5d48" fillOpacity="0.85" stroke="#354031" strokeWidth="0.5" />
            <path d="M160,130 C130,120 120,95 140,110 C160,125 170,140 160,130 Z" fill="#2a3525" fillOpacity="0.9" stroke="#1d261a" strokeWidth="0.5" />
            
            {/* Olive/Sage medium green */}
            <path d="M150,45 C125,35 115,10 135,20 C155,30 160,55 150,45 Z" fill="#697f5d" fillOpacity="0.9" stroke="#526448" strokeWidth="0.5" />
            <path d="M180,80 C150,75 145,50 165,60 C185,70 190,90 180,80 Z" fill="#8Fa185" fillOpacity="0.85" stroke="#6C7E63" strokeWidth="0.5" />
            <path d="M210,40 C185,35 180,10 200,20 C220,30 225,50 210,40 Z" fill="#a6b69b" fillOpacity="0.9" stroke="#88997d" strokeWidth="0.5" />
            <path d="M135,90 C110,80 100,55 120,65 C140,75 145,100 135,90 Z" fill="#697f5d" fillOpacity="0.85" stroke="#526448" strokeWidth="0.5" />

            {/* Sprigs of Golden Berries (brown stems + golden dots) */}
            <path d="M180,25 Q140,80 130,135" stroke="#a1813b" strokeWidth="1" strokeDasharray="1.5 1.5" />
            <circle cx="130" cy="135" r="5" fill="#c5a85c" />
            <circle cx="140" cy="115" r="4.5" fill="#f5eacf" stroke="#c5a85c" strokeWidth="0.5" />
            <circle cx="148" cy="95" r="5" fill="#a1813b" />
            <circle cx="162" cy="70" r="4" fill="#c5a85c" />

            <path d="M220,60 Q170,120 155,160" stroke="#a1813b" strokeWidth="1" />
            <circle cx="155" cy="160" r="5.5" fill="#c5a85c" />
            <circle cx="162" cy="142" r="4.5" fill="#f5eacf" stroke="#c5a85c" strokeWidth="0.5" />
            <circle cx="170" cy="122" r="5" fill="#a1813b" />

            {/* Highly Detailed Cream Peony / Rose Watercolor Blossoms */}
            {/* Flower 1 (Large creamy white rose center-top) */}
            <g transform="translate(145, 45)">
              <circle cx="0" cy="0" r="26" fill="#ffffff" fillOpacity="0.98" stroke="#d5caad" strokeWidth="0.5" />
              {/* Petal layers overlay */}
              <path d="M-18,-18 C-30,-5 -30,15 -15,22 C0,29 20,20 23,5 C26,-10 10,-26 -18,-18 Z" fill="#faf8f2" fillOpacity="0.9" />
              <path d="M-10,-10 C-20,0 -20,10 -10,15 C0,20 12,12 15,3 C18,-6 5,-18 -10,-10 Z" fill="#f5f0e1" />
              <circle cx="0" cy="0" r="5" fill="#c5a85c" />
              <circle cx="2" cy="-2" r="1.5" fill="#a1813b" />
              <circle cx="-3" cy="2" r="1.2" fill="#8a7031" />
            </g>

            {/* Flower 2 (Elegant secondary bloom to the left) */}
            <g transform="translate(95, 85)">
              <circle cx="0" cy="0" r="20" fill="#ffffff" fillOpacity="0.98" stroke="#d5caad" strokeWidth="0.4" />
              <path d="M-12,-12 C-20,0 -20,10 -10,15 C0,20 12,12 12,0 C12,-12 0,-20 -12,-12 Z" fill="#faf8f2" />
              <circle cx="0" cy="0" r="4" fill="#c5a85c" />
            </g>

            {/* Flower 3 (Bud blossom further down) */}
            <g transform="translate(200, 100)">
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#d5caad" strokeWidth="0.4" />
              <ellipse cx="-2" cy="-2" rx="10" ry="7" fill="#fcfaf2" />
              <circle cx="0" cy="0" r="3" fill="#a1813b" />
            </g>
          </svg>
        </div>

        {/* Watercolor Botanical Tree Design - Bottom Left Cascading Over Arch */}
        <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none z-20">
          <svg viewBox="0 0 250 250" className="w-full h-full text-olive-medium" fill="none" stroke="currentColor">
            {/* Main branch stems radiating up */}
            <path d="M0,250 Q70,230 130,190" stroke="#8d7345" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40,235 Q100,195 150,140" stroke="#8d7345" strokeWidth="2.0" strokeLinecap="round" />
            <path d="M15,245 Q60,180 90,120" stroke="#8d7345" strokeWidth="1.8" strokeLinecap="round" />

            {/* Soft Green Leaves */}
            {/* Dark green */}
            <path d="M130,190 C160,200 165,225 145,215 C125,205 120,180 130,190 Z" fill="#4e5d48" fillOpacity="0.9" stroke="#354031" strokeWidth="0.5" />
            <path d="M150,140 C180,145 185,165 165,155 C145,145 140,130 150,140 Z" fill="#4e5d48" fillOpacity="0.85" stroke="#354031" strokeWidth="0.5" />
            <path d="M90,120 C120,130 130,155 110,140 C90,125 80,110 90,120 Z" fill="#2a3525" fillOpacity="0.9" stroke="#1d261a" strokeWidth="0.5" />

            {/* Olive/Sage medium green */}
            <path d="M100,205 C125,215 135,240 115,230 C95,220 90,195 100,205 Z" fill="#697f5d" fillOpacity="0.9" stroke="#526448" strokeWidth="0.5" />
            <path d="M70,170 C100,175 105,200 85,190 C65,180 60,160 70,170 Z" fill="#8Fa185" fillOpacity="0.85" stroke="#6C7E63" strokeWidth="0.5" />
            <path d="M40,210 C65,215 70,240 50,230 C30,220 25,200 40,210 Z" fill="#a6b69b" fillOpacity="0.9" stroke="#88997d" strokeWidth="0.5" />

            {/* Sprigs of Golden Berries */}
            <path d="M70,225 Q110,170 120,115" stroke="#a1813b" strokeWidth="1" strokeDasharray="1.5 1.5" />
            <circle cx="120" cy="115" r="5" fill="#c5a85c" />
            <circle cx="110" cy="135" r="4.5" fill="#f5eacf" stroke="#c5a85c" strokeWidth="0.5" />
            <circle cx="102" cy="155" r="5" fill="#a1813b" />

            <path d="M30,190 Q80,130 95,90" stroke="#a1813b" strokeWidth="1" />
            <circle cx="95" cy="90" r="5.5" fill="#c5a85c" />
            <circle cx="88" cy="108" r="4.5" fill="#f5eacf" stroke="#c5a85c" strokeWidth="0.5" />

            {/* Highly Detailed Cream Peony / Rose Watercolor Blossoms */}
            {/* Flower 1 (Large creamy white rose) */}
            <g transform="translate(105, 175)">
              <circle cx="0" cy="0" r="26" fill="#ffffff" fillOpacity="0.98" stroke="#d5caad" strokeWidth="0.5" />
              <path d="M-18,-18 C-30,-5 -30,15 -15,22 C0,29 20,20 23,5 C26,-10 10,-26 -18,-18 Z" fill="#faf8f2" fillOpacity="0.9" />
              <path d="M-10,-10 C-20,0 -20,10 -10,15 C0,20 12,12 15,3 C18,-6 5,-18 -10,-10 Z" fill="#f5f0e1" />
              <circle cx="0" cy="0" r="5" fill="#c5a85c" />
              <circle cx="2" cy="-2" r="1.5" fill="#a1813b" />
            </g>

            {/* Flower 2 (Secondary smaller bloom) */}
            <g transform="translate(155, 135)">
              <circle cx="0" cy="0" r="18" fill="#ffffff" fillOpacity="0.98" stroke="#d5caad" strokeWidth="0.4" />
              <path d="M-12,-12 C-20,0 -20,10 -10,15 C0,20 12,12 12,0 C12,-12 0,-20 -12,-12 Z" fill="#faf8f2" />
              <circle cx="0" cy="0" r="3" fill="#c5a85c" />
            </g>

            {/* Flower 3 (Bud blossom) */}
            <g transform="translate(50, 150)">
              <circle cx="0" cy="0" r="15" fill="#ffffff" stroke="#d5caad" strokeWidth="0.4" />
              <ellipse cx="-2" cy="-2" rx="8" ry="5" fill="#fcfaf2" />
              <circle cx="0" cy="0" r="2.5" fill="#a1813b" />
            </g>
          </svg>
        </div>

        {/* Card Main text contents oriented exactly like user's photo */}
        <div className="relative px-2 pt-16 pb-8 flex flex-col items-center justify-center text-center z-20">
          
          {/* Header text */}
          <span className="text-olive-medium font-cinzel text-xs md:text-sm tracking-[0.25em] font-medium uppercase mb-4">
            Together with their families
          </span>

          {/* Names */}
          <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="font-cursive text-olive-medium text-7xl md:text-8xl leading-none drop-shadow-xs italic">
              Ahmed
            </h1>
            <span className="font-serif text-3xl text-gold-dark my-2 inline-block italic font-normal">
              &
            </span>
            <h1 className="font-cursive text-olive-medium text-7xl md:text-8xl leading-none drop-shadow-xs italic">
              Yomna
            </h1>
          </div>

          {/* Invitation Call */}
          <span className="text-olive-medium font-cinzel text-[11px] md:text-xs tracking-[0.2em] font-medium uppercase mb-6 leading-relaxed max-w-[280px]">
            Invite you to join their wedding
          </span>

          {/* Date Section precisely mirroring the photo structure */}
          <div className="w-full max-w-[340px] flex flex-col items-center my-4 font-sans">
            <span className="text-gold-dark tracking-[0.25em] text-xs font-bold uppercase mb-1">
              October
            </span>
            <div className="flex items-center justify-center w-full">
              {/* Friday */}
              <div className="flex-1 text-right pr-4">
                <span className="text-[#4e5d48] text-xs md:text-sm tracking-[0.14em] font-extrabold uppercase">
                  Friday
                </span>
              </div>
              
              {/* Bounded 16 */}
              <div className="flex items-center justify-center px-4 md:px-6 border-x-2 border-gold-medium/60 py-1">
                <div className="flex flex-col items-center">
                  <span className="text-[#4e5d48] text-4xl font-extrabold leading-none">
                    16
                  </span>
                  <span className="text-gold-dark text-[10px] md:text-[11px] tracking-[0.2em] font-extrabold mt-1">
                    2026
                  </span>
                </div>
              </div>
              
              {/* At 8 PM */}
              <div className="flex-1 text-left pl-4">
                <span className="text-[#4e5d48] text-xs md:text-sm tracking-[0.14em] font-extrabold uppercase whitespace-nowrap">
                  At 8 PM
                </span>
              </div>
            </div>
          </div>

          {/* Location description */}
          <div className="mt-6 mb-6 max-w-sm flex flex-col items-center">
            <MapPin className="h-5 w-5 text-gold-dark mb-2 animate-bounce" />
            <p className="text-[#4e5d48] font-sans text-xs md:text-[13px] leading-relaxed font-bold px-2">
              Tanta - Al Mahallah Al Kubra Rd, Villa Salz Burg, El Mahalla El Kubra, Gharbia Governorate
            </p>
          </div>

          {/* Coordinate details from photo map mockup */}
          <span className="text-[10px] text-gold-dark/70 font-mono tracking-widest uppercase mb-6">
            30.8672° N, 31.0504° E • EGYPT
          </span>

          {/* Interactive touch action helper */}
          <button 
            onClick={handleCopyAddress}
            className="text-[11px] text-gold-dark hover:text-gold-medium hover:underline transition-all bg-champagne/40 px-3 py-1.5 rounded-full border border-gold-medium/20 font-sans font-bold flex items-center gap-1.5 cursor-pointer max-w-fit"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-700 font-extrabold" />
                <span>Address Copied!</span>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-medium animate-ping" />
                <span>Click to Copy Address Location</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Action RSVP buttons under the card */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
        <button
          onClick={onRSVPClick}
          id="scroll-to-rsvp-btn"
          className="px-6 py-3 rounded-xl bg-olive-medium hover:bg-olive-dark text-white font-serif tracking-widest text-xs uppercase shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 pulse-ring-effect relative font-extrabold cursor-pointer"
        >
          Share Your Wishes
        </button>

        <a
          href="https://maps.app.goo.gl/9VSUXfr7o2pmkAJ18"
          target="_blank"
          rel="noopener noreferrer"
          id="direct-location-btn"
          className="px-6 py-3 rounded-xl bg-ivory border border-gold-medium/40 text-olive-medium hover:text-gold-dark font-serif tracking-widest text-xs uppercase shadow-md transition-all hover:bg-champagne/30 flex items-center justify-center gap-2 hover:scale-105 font-bold"
        >
          <MapPin className="h-4 w-4 text-gold-medium" />
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
