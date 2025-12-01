'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Music, Home, Search, ArrowLeft } from 'lucide-react';
import Topbar from '@/components/shared/Topbar';
import Bottombar from '@/components/shared/Bottombar';

export default function NotFound() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showMusicNotes, setShowMusicNotes] = useState(false);
  const [errorCode, setErrorCode] = useState('404');

  // 数字动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 10);
      setErrorCode(prev => prev.substring(1) + randomNum);
    }, 50);
    
    setTimeout(() => {
      clearInterval(interval);
      setErrorCode('404');
      setShowAnimation(true);
    }, 2000);
    
    // 延迟显示音符动画
    setTimeout(() => {
      setShowMusicNotes(true);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Topbar />
      
      <main className="container mx-auto px-4 py-20 md:py-28 flex flex-col items-center justify-center">
        {/* 音符装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          {showMusicNotes && (
            <>
              <div className="absolute top-1/4 left-10 animate-[float_5s_ease-in-out_infinite] text-purple-400 opacity-20">
                <Music size={40} />
              </div>
              <div className="absolute top-1/3 right-16 animate-[float_6s_ease-in-out_infinite_1s] text-blue-400 opacity-20">
                <Music size={32} />
              </div>
              <div className="absolute bottom-1/4 left-1/4 animate-[float_4s_ease-in-out_infinite_0.5s] text-pink-400 opacity-20">
                <Music size={24} />
              </div>
              <div className="absolute bottom-1/3 right-1/3 animate-[float_7s_ease-in-out_infinite_1.5s] text-indigo-400 opacity-20">
                <Music size={36} />
              </div>
            </>
          )}
        </div>

        {/* 错误代码 */}
        <h1 className={`text-9xl md:text-[12rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-70'}`}>
          {errorCode}
        </h1>
        
        {/* 错误信息 */}
        <h2 className={`text-2xl md:text-3xl font-medium text-center mb-4 text-gray-200 transition-all duration-1000 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          页面不存在
        </h2>
        
        <p className={`text-gray-400 text-center max-w-md mb-10 transition-all duration-1000 delay-400 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          抱歉，您访问的页面可能已被移除或从未存在过。不过别担心，我们有很多精彩的音乐创作内容等着您！
        </p>
        
        {/* 快捷导航 */}
        <div className={`flex flex-wrap gap-4 justify-center mb-12 transition-all duration-1000 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300"
          >
            <Home size={18} />
            <span>返回首页</span>
          </Link>
          <Link 
            href="/musicGenerator" 
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            <Music size={18} />
            <span>开始创作</span>
          </Link>
        </div>
        
        <button 
          onClick={() => window.history.back()} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 text-gray-300 hover:text-white transition-all duration-1000 delay-600 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <ArrowLeft size={16} />
          <span>返回上一页</span>
        </button>
      </main>
      
      <Bottombar />
    </div>
  );
}
