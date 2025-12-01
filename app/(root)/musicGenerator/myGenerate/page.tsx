import MusicHistory from '@/components/musicgeneratorui/MusicHistory';

export default function MyGeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-indigo-950 text-white p-4 md:p-6 lg:p-8">
      {/* 装饰性粒子效果背景 */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-[20%] left-[30%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="py-12 px-4 text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 tracking-tight">
            我生成的音乐
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            探索你的创作历史，重温每一个音乐灵感瞬间
          </p>
        </header>
        
        <main className="transition-opacity duration-700">
          <MusicHistory />
        </main>
      </div>
    </div>
  );
}