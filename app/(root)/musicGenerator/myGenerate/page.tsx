import MusicHistory from '../../../../components/musicgeneratorui/MusicHistory';
import Link from 'next/link';
export default function MyGeneratePage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Link 
          href="/musicGenerator" 
          className="no-underline inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </Link>
      </div>
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