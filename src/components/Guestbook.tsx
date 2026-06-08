/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { GuestbookWish } from '../types';
import { Heart, MessageSquare, Check } from 'lucide-react';

interface GuestbookProps {
  wishes: GuestbookWish[];
  onAddWish: (wish: Omit<GuestbookWish, 'id' | 'timestamp'>) => void;
  whatsappNumber?: string;
}

export default function Guestbook({ wishes, onAddWish, whatsappNumber }: GuestbookProps) {
  // Form elements for direct wish loading
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [relationship] = useState<'family' | 'friend' | 'colleague' | 'wellwisher'>('wellwisher');
  const [isWishesSubmitted, setIsWishesSubmitted] = useState(false);
  const [lastSubmittedWish, setLastSubmittedWish] = useState<{ name: string; wishText: string } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) return;

    onAddWish({
      name,
      wishText,
      relationship,
    });

    setLastSubmittedWish({ name, wishText });
    setName('');
    setWishText('');
    setIsWishesSubmitted(true);
  };

  const filteredWishes = wishes;

  return (
    <div className="w-full max-w-4xl mx-auto my-14 px-4" id="congratulations-wall">
      
      {/* Mini Title Section */}
      <div className="text-center mb-8">
        <span className="font-serif text-xs tracking-[0.25em] text-gold-dark font-extrabold uppercase">
          Congratulations & Blessings
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-olive-medium font-bold mt-1">
          Wishes Wall
        </h2>
        <div className="flex justify-center gap-1.5 mt-2 text-gold-medium">
          <Heart className="h-4 w-4 fill-current animate-pulse" />
          <Heart className="h-3.5 w-3.5 fill-current" />
          <Heart className="h-3 w-3 fill-current" />
        </div>
      </div>

      {/* Grid Layout: Form and Map of Wishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Direct Wish Submission form */}
        <div className="bg-ivory border border-gold-medium/20 rounded-3xl p-6 shadow-md h-fit">
          <div className="flex items-center gap-2 mb-4 border-b border-champagne pb-3">
            <MessageSquare className="h-5 w-5 text-gold-medium" />
            <span className="font-serif font-bold text-olive-medium text-sm tracking-widest uppercase">
              Leave a Blessing
            </span>
          </div>

          {isWishesSubmitted ? (
            <div className="py-8 text-center animate-fade-in flex flex-col items-center">
              <div className="h-12 w-12 bg-olive-light text-olive-medium rounded-full flex items-center justify-center mb-3">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-serif text-sm font-semibold text-olive-dark">
                Blessing posted successfully!
              </p>
              <p className="text-[11px] text-charcoal/70 mt-1 max-w-[200px] mb-5">
                Your warm words have been pinned on the wishes wall.
              </p>

              <button
                onClick={() => {
                  setIsWishesSubmitted(false);
                  setLastSubmittedWish(null);
                }}
                className="px-5 py-2.5 bg-olive-medium hover:bg-olive-dark text-white rounded-xl text-[10px] font-serif uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 cursor-pointer font-bold shadow-sm"
              >
                Write Another Blessing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gold-dark tracking-wider uppercase">الاسم / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (e.g. Adham Helaly)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 border border-gold-medium/20 text-xs focus:ring-2 focus:ring-olive-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gold-dark tracking-wider uppercase">الرسالة / Congratulatory Message</label>
                <textarea
                  required
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="May your love grow stronger each day..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory/50 border border-gold-medium/20 text-xs focus:ring-2 focus:ring-olive-medium focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-olive-medium hover:bg-olive-dark text-white font-serif tracking-widest text-[10px] uppercase shadow-sm transition-all hover:scale-[1.02]"
              >
                Pin My Blessing
              </button>
            </form>
          )}
        </div>

        {/* Right Columns: Wishes Scroll Wall */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Scrolling Wishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2">
            {filteredWishes.length === 0 ? (
              <div className="col-span-1 md:col-span-2 py-16 text-center bg-ivory/40 border border-dashed border-gold-medium/25 rounded-2xl p-6">
                <Heart className="h-6 w-6 text-gold-medium mx-auto mb-3 animate-pulse opacity-60" />
                <p className="text-xs font-semibold text-olive-dark">
                  كن أول من يكتب تهنئة للعروسين أحمد ويمنى! 🤍🌸
                </p>
                <p className="text-[11px] text-charcoal/60 italic mt-1 pb-1">
                  Be the first to congratulate Ahmed & Yomna and share your warm memories!
                </p>
              </div>
            ) : (
              filteredWishes.map((item) => (
                <div
                  key={item.id}
                  className="bg-ivory border border-gold-medium/20 rounded-2xl p-5 shadow-xs transition-transform duration-300 hover:scale-[1.01] hover:shadow-md relative overflow-hidden flex flex-col justify-between"
                  style={{ minHeight: '140px' }}
                >
                  {/* Decorative faint stamp leaf/heart pattern in card background */}
                  <div className="absolute right-2 bottom-2 text-olive-medium/5 pointer-events-none">
                    <Heart className="h-14 w-14 fill-current" />
                  </div>

                  <p className="text-[12px] leading-relaxed text-charcoal/80 font-medium italic break-words flex-grow">
                    " {item.wishText} "
                  </p>

                  <div className="mt-4 pt-3 border-t border-champagne flex items-center justify-between text-[11px]">
                    <span className="font-serif font-bold text-olive-medium truncate max-w-[180px]" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
