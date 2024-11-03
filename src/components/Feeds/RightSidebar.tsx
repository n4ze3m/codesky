import { useAtom } from 'jotai';
import { Code2, Rocket, Users, Terminal, ChevronRight, Star, Zap } from 'lucide-react';
import { atomFeed } from '../../store/feed';

interface FeedItem {
  label: string;
  value: string;
  icon: React.ElementType;
  syntax: string;
  description?: string;
  method?: string;
}

const FEED_COLLECTION = {
  name: 'CodeSky',
  version: '0.0.1',
  items: [
    {
      label: "Following",
      value: "following",
      icon: Code2,
      syntax: ".follow()",
      description: "See posts from people you follow",
      method: "GET"
    },
    {
      label: "Discover",
      value: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot",
      icon: Rocket,
      syntax: ".discover()",
      description: "Explore trending content",
      method: "GET"
    },
    {
      label: "Popular with Friends",
      value: "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/with-friends",
      icon: Users,
      syntax: ".trending()",
      description: "See what's hot in your network",
      method: "GET"
    }
  ],
  methods: {
    initialize: () => console.log('Feed system initialized'),
    refresh: () => console.log('Feeds refreshed'),
    status: 'active'
  }
} as const;

const TERMINAL_CONFIG = {
  filename: "feeds.js",
  theme: "dark",
  status: "connected"
};

export const RightSidebar: React.FC = () => {

const [activeFeed, setActiveFeed] = useAtom(atomFeed)

  const renderTerminalHeader = () => (
    <div className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
      <Terminal className="w-5 h-5 text-green-400 animate-pulse" />
      <span className="text-green-400 font-mono text-sm">
        {`${TERMINAL_CONFIG.filename} - ${TERMINAL_CONFIG.status}`}
      </span>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="text-green-400 font-mono mb-4 hover:text-green-300 transition-colors">
      <span className="text-purple-400">const</span>
      <span className="text-blue-400"> feedSystem</span> = 
      <span className="text-yellow-400"> new</span>
      <span className="text-green-400"> FeedCollection</span>
      <span className="text-white">();</span>
    </div>
  );

  const renderFeedItem = (item: FeedItem) => (
    <div key={item.value} className="group">
      <button 
        onClick={() => setActiveFeed({
            name: item.label,
            value: item.value,
        })}
        className={`w-full text-left p-3 rounded transition-all duration-200 border ${
          activeFeed.value === item.value 
            ? 'bg-gray-800/70 border-green-500/50 shadow-[0_0_20px_rgba(0,255,0,0.15)]' 
            : 'hover:bg-gray-800/50 border-transparent hover:border-green-700/30 hover:shadow-[0_0_20px_rgba(0,255,0,0.1)]'
        } hover:-translate-y-0.5`}
      >
        <div className="flex items-center font-mono">
          <ChevronRight className={`w-4 h-4 transition-colors transform duration-200 ${
            activeFeed.value === item.value ? 'text-green-400 translate-x-1' : 'text-gray-500 group-hover:text-green-400 group-hover:translate-x-1'
          }`} />
          <item.icon className={`w-4 h-4 ml-2 transition-transform ${
            activeFeed.value === item.value ? 'text-green-400 scale-110' : 'text-yellow-500 group-hover:scale-110'
          }`} />
          <span className={`ml-2 transition-colors ${
            activeFeed.value === item.value ? 'text-green-300' : 'text-blue-400 group-hover:text-blue-300'
          }`}>
            {`feedSystem${item.syntax}`}
          </span>
        </div>
        {item.description && (
          <div className={`text-gray-500 text-xs ml-8 mt-1 ${activeFeed.value === item.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <span className="text-yellow-400">@method</span> {item.method} - {item.description}
          </div>
        )}
      </button>
    </div>
  );

  return (
    <div className='p-4'>
      {renderTerminalHeader()}
      {renderSystemInfo()}
      <nav className="space-y-1">
        {FEED_COLLECTION.items.map(renderFeedItem)}
      </nav>
      <div className="text-gray-400 font-mono mt-4 text-sm">
        {`// ${FEED_COLLECTION.name} v${FEED_COLLECTION.version}`}
      </div>
    </div>
  );
};