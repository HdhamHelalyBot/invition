/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MapPin, Car, Navigation, Clipboard, Check, Map } from 'lucide-react';

export default function LocationMap() {
  const [copied, setCopied] = useState(false);
  const addressDetailsEn = "Tanta - Al Mahallah Al Kubra Rd, Villa Salz Burg, El Mahalla El Kubra, Gharbia Governorate";

  const handleCopy = () => {
    navigator.clipboard.writeText(addressDetailsEn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4" id="location-details">
      {/* Decorative header */}
      <div className="text-center mb-6">
        <MapPin className="h-6 w-6 text-gold-medium mx-auto mb-2.5 animate-bounce" />
        <h2 className="font-serif text-2xl tracking-widest text-olive-medium uppercase">
          Wedding Venue
        </h2>
        <span className="text-[10px] font-cinzel text-gold-dark font-extrabold tracking-widest uppercase">
          Directions & Location Map
        </span>
      </div>

      {/* Main card box with clean premium style */}
      <div className="bg-ivory border border-gold-medium/30 shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left column: Styled compass, map illustration, and address information */}
        <div className="p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-ivory to-champagne/40">
          
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="font-serif text-xs font-bold text-gold-dark uppercase tracking-widest">
                The Location
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-olive-medium leading-tight">
              Villa Salz Burg Venue
            </h3>

            <p className="text-xs text-charcoal/80 leading-relaxed font-semibold font-sans">
              {addressDetailsEn}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-ivory/80 text-olive-medium border border-gold-medium/20 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-champagne/30 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-700" /> : <Clipboard className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Address'}
              </button>

              <a
                href="https://maps.app.goo.gl/DEfv2xbY3nhfGtCz5"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-olive-medium text-white text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-olive-dark active:scale-95 flex items-center gap-1.5"
              >
                <Navigation className="h-3.5 w-3.5 text-gold-light" />
                GPS Nav
              </a>
            </div>
          </div>

          {/* Quick tips */}
          <div className="mt-6 pt-4 border-t border-gold-medium/20 space-y-3 text-left">
            <span className="font-serif text-[10px] font-bold uppercase tracking-widest text-[#9C7C38]">
              Arrival Options
            </span>

            {/* Tip 1 */}
            <div className="flex items-start gap-2.5">
              <div className="h-6 w-6 bg-olive-light/50 rounded-full flex items-center justify-center shrink-0 text-olive-medium">
                <Car className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="font-serif text-[11px] font-bold text-olive-medium">
                  By Car & Careem / Uber
                </h4>
                <p className="text-[10px] text-charcoal/70 leading-relaxed font-medium">
                  Put the Tanta - El Mahalla Road in search or click the Nav button to start navigation in Google Maps.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Styled architectural map frame or mockup */}
        <div className="relative h-64 md:h-auto min-h-[250px] bg-[#E5E5E0] overflow-hidden flex items-center justify-center border-t md:border-t-0 md:border-l border-gold-medium/20">
          
          {/* Custom golden line vector and blueprint compass representing absolute elegance */}
          <div className="absolute inset-0 bg-[radial-gradient(#c5a85c_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
          
          <div className="w-4/5 h-4/5 border-2 border-gold-medium/40 rounded-2xl flex flex-col items-center justify-center relative p-4 text-center z-10 bg-ivory/95 shadow-lg">
            
            {/* Compass vector */}
            <div className="rounded-full h-14 w-14 border border-gold-medium/50 flex items-center justify-center mb-3 text-gold-medium animate-[spin_12s_linear_infinite]">
              <Map className="h-5 w-5" />
            </div>

            <p className="font-serif text-xs font-extrabold text-[#7C663D] tracking-widest uppercase mb-1">
              Villa Salz Burg Event
            </p>
            <p className="font-serif text-[10px] italic text-charcoal/60 mb-3 max-w-[180px]">
              Tanta - El Mahalla Rd, El Gharbia
            </p>

            <a
              href="https://maps.app.goo.gl/DEfv2xbY3nhfGtCz5"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-charcoal text-white hover:bg-olive-medium text-[10px] font-serif tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
            >
              <Navigation className="h-3 w-3 text-gold-medium animate-pulse" />
              Open Actual map
            </a>
          </div>

          {/* Decorative compass lines */}
          <div className="absolute top-2 left-2 text-[9px] font-mono font-bold text-[#A6884F]/50">30°52'N, 31°03'E</div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono font-bold text-[#A6884F]/50">EGYPT</div>
        </div>

      </div>
    </div>
  );
}
