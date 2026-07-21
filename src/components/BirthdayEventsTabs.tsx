'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import CloudinaryGallery from './CloudinaryGallery';

interface BirthdayEventItem {
  title: string;
  description: string;
  coverImage?: string;
  imageCount: number;
  link: string;
}

interface BirthdayEventsTabsProps {
  birthdayEvents: BirthdayEventItem[];
  specialShootImages: string[];
}

export default function BirthdayEventsTabs({
  birthdayEvents,
  specialShootImages,
}: BirthdayEventsTabsProps) {
  const [activeTab, setActiveTab] = useState<'birthday' | 'special'>('birthday');

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[#F5F5DC] rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('birthday')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'birthday'
                ? 'bg-[#D4A574] text-white shadow-md'
                : 'text-[#3E2723] hover:bg-[#FFF8E7]'
            }`}
          >
            🎂 Birthday Events
            <span className="ml-2 text-xs opacity-75">({birthdayEvents.reduce((sum, event) => sum + event.imageCount, 0)})</span>
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'special'
                ? 'bg-[#D4A574] text-white shadow-md'
                : 'text-[#3E2723] hover:bg-[#FFF8E7]'
            }`}
          >
            ✨ Special Shoot
            <span className="ml-2 text-xs opacity-75">({specialShootImages.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'birthday' ? (
        <div>
          <div className="text-center mb-12">
            <p className="text-[#8B7355] uppercase tracking-[0.25em] text-xs font-medium mb-3 font-sans">
              Select an Event
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#3E2723] mb-4 font-[family-name:var(--font-cormorant)] italic">
              Our Birthday Shoots
            </h2>
            <div className="w-16 h-px bg-[#D4A574] mx-auto mb-4"></div>
            <p className="text-[#6B5744] max-w-xl mx-auto text-sm leading-relaxed">
              Each birthday is a unique story. Browse our featured events and click to view the full gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {birthdayEvents.map((event) => (
              <Link key={event.link} href={event.link} className="group block">
                <div
                  className="relative overflow-hidden aspect-[4/3] bg-[#F5DEB3]"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {event.coverImage ? (
                    <CldImage
                      src={event.coverImage}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={event.title}
                      crop="fill"
                      quality="auto"
                      format="auto"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#FFF8E7]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-[family-name:var(--font-cormorant)] font-semibold tracking-wide">
                      {event.title}
                    </h3>
                    <p className="text-white/70 text-xs mt-1 font-light">
                      {event.imageCount} photos
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-[#8B7355] uppercase tracking-[0.25em] text-xs font-medium mb-3 font-sans">
              Extra Moments
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#3E2723] mb-4 font-[family-name:var(--font-cormorant)] italic">
              Special Shoot
            </h2>
            <div className="w-16 h-px bg-[#D4A574] mx-auto mb-4"></div>
            <p className="text-[#6B5744] max-w-xl mx-auto text-sm leading-relaxed">
              A small curated set of special images, shown separately so the main birthday flow stays clean.
            </p>
          </div>

          <CloudinaryGallery ids={specialShootImages} />
        </div>
      )}
    </div>
  );
}
