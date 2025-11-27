import MusicHistory from '../../../../components/musicgeneratorui/MusicHistory';
export default function MyGeneratePage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-8">
      <header className="py-10 px-4 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          我生成的音乐
        </h1>
      </header>
      <main className="max-w-6xl mx-auto">
        <MusicHistory />
      </main>
    </div>
  );
}