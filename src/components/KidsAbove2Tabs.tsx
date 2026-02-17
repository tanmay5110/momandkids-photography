'use client';

import { useState } from 'react';
import CloudinaryGallery from './CloudinaryGallery';

interface KidsAbove2TabsProps {
  indoorImages: string[];
  outdoorImages: string[];
}

export default function KidsAbove2Tabs({ indoorImages, outdoorImages }: KidsAbove2TabsProps) {
  const [activeTab, setActiveTab] = useState<'indoor' | 'outdoor'>('indoor');

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[#F5F5DC] rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('indoor')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'indoor'
                ? 'bg-[#D4A574] text-white shadow-md'
                : 'text-[#3E2723] hover:bg-[#FFF8E7]'
            }`}
          >
            🏠 Indoor Studio
            <span className="ml-2 text-xs opacity-75">({indoorImages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('outdoor')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'outdoor'
                ? 'bg-[#D4A574] text-white shadow-md'
                : 'text-[#3E2723] hover:bg-[#FFF8E7]'
            }`}
          >
            🌳 Outdoor
            <span className="ml-2 text-xs opacity-75">({outdoorImages.length})</span>
          </button>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="transition-opacity duration-300">
        {activeTab === 'indoor' ? (
          <CloudinaryGallery ids={indoorImages} />
        ) : (
          <CloudinaryGallery ids={outdoorImages} />
        )}
      </div>
    </div>
  );
}
