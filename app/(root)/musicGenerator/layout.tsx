'use client';
import { ReactNode } from 'react';
import LeftSidebar from '@/components/shared/LeftSiderbar';

export default function MusicGeneratorLayout({ children, }: { children: ReactNode; }) {
  return (
    <div className="flex flex-row min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <aside className="fixed top-0 left-0 h-screen z-30 flex-shrink-0 bg-gray-950 border-r border-gray-800">
        <LeftSidebar />
      </aside>
      <div className="flex-1 ml-[250px] overflow-hidden">
        <main className="h-screen overflow-y-auto min-w-0 bg-gray-950">
          <div className="h-full custom-scrollbar">
            <div className="p-0 md:p-0 min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}