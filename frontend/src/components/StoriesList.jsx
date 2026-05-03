export default function StoriesList({ stories, seenStories, onStoryClick }) {
  return (
    <div className="bg-black border-b border-zinc-800">
      <div className="px-4 pt-5 pb-1">
        <h2 className="text-white font-bold text-base tracking-wide">Stories</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-3">
        {stories.map((story, index) => {
          const seen = seenStories.has(index);
          return (
            <button
              key={story.id}
              onClick={() => onStoryClick(index)}
              className="flex flex-col items-center gap-[6px] shrink-0 focus:outline-none"
            >
              <div
                className={`rounded-full p-[2.5px] ${
                  seen
                    ? 'bg-zinc-600'
                    : 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-700'
                }`}
              >
                <div className="bg-black rounded-full p-[2px]">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-[58px] h-[58px] rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-white text-[11px] w-[66px] text-center truncate leading-tight">
                {story.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
