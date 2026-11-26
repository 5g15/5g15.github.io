import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { EditorialIndex } from './components/EditorialIndex';
import { EditorialReader } from './components/EditorialReader';
import { EyeZoomGallery } from './components/EyeZoomGallery';
import type { MonographEntry } from './types/portfolio';

export default function App() {
  const [activeEntry, setActiveEntry] = useState<MonographEntry | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#0B0C0E] text-[#F4F2EC]">
        <a
          href="#essays"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#F6F5F1] focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-[#141414]"
        >
          Skip to essays and research
        </a>

        <main>
          <EyeZoomGallery onOpenEntry={setActiveEntry} />
          <EditorialIndex onOpenEntry={setActiveEntry} />
        </main>

        <EditorialReader
          entry={activeEntry}
          onClose={() => setActiveEntry(null)}
        />
      </div>
    </MotionConfig>
  );
}
