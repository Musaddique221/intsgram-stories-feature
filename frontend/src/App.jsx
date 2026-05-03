import { useState, useEffect } from 'react';
import StoriesList from './components/StoriesList';
import StoryViewer from './components/StoryViewer';

export default function App() {
  const [stories, setStories] = useState([]);
  const [fetchState, setFetchState] = useState('loading');
  const [activeIndex, setActiveIndex] = useState(null);
  console.log("activeIndex::",activeIndex)
  const [seenStories, setSeenStories] = useState(new Set());
  console.log("seenStories:::",seenStories)

  useEffect(() => {
    fetch('/stories.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((data) => {
        console.log("data:::",data)
        setStories(data);
        setFetchState('ready');
      })
      .catch(() => setFetchState('error'));
  }, []);

  const openStory = (index) => {
    setActiveIndex(index);
    setSeenStories((prev) => new Set([...prev, index]));
  };

  const closeViewer = () => setActiveIndex(null);

  const handleStoryChange = (index) => {
    setSeenStories((prev) => new Set([...prev, index]));
  };

  if (fetchState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black">
        <div className="w-10 h-10 rounded-full border-[3px] border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black">
        <p className="text-white/60 text-sm">Could not load stories.</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-dvh max-w-[430px] mx-auto">
      <div className="flex items-center justify-between px-4 pt-10 pb-3">
        <span className="text-white text-2xl font-bold tracking-tight">Instagram</span>
      </div>

      <StoriesList
        stories={stories}
        seenStories={seenStories}
        onStoryClick={openStory}
      />

      <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-20">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="text-white text-sm">Your feed is empty</p>
      </div>

      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeIndex}
          onClose={closeViewer}
          onStoryChange={handleStoryChange}
        />
      )}
    </div>
  );
}
