/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVPEntry {
  id: string;
  name: string;
  status: 'attending' | 'declined';
  guestsCount: number;
  dietaryNotes?: string;
  timestamp: string;
}

export interface GuestbookWish {
  id: string;
  name: string;
  wishText: string;
  relationship: 'family' | 'friend' | 'colleague' | 'wellwisher';
  timestamp: string;
}
