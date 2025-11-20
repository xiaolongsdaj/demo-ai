import MusicGeneratorForm from '../../../components/musicgeneratorui/MusicGeneratorForm';
import Link from 'next/link';

const MusicGenerator = () => {
  return (
    <div className="min-h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-8">
      
      <header className="py-10 px-4 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          AI Music Generator
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          创建独特的音乐作品，只需描述你的音乐风格和情感
        </p>
      </header>
      <main className="max-w-6xl mx-auto">
        <MusicGeneratorForm />
    </main>
    <div className="text-center mt-8 mb-4">
      <Link 
        href="/musicGenerator/myGenerate" 
        className="no-underline inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        查看我的生成
      </Link>
    </div>
    </div>
  )
}

export default MusicGenerator
