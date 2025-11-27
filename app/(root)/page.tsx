'use client'
import Link from 'next/link';
import { Music, Image } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Topbar from '@/components/shared/Topbar';
import Bottombar from '@/components/shared/Bottombar';
import ParticleBackground from '@/components/shared/ParticleBackground';

export default function Home() {
  const { user } = useUser();
  const userInfo = {
    id: user?.id,
    userName: user?.username,
    email: user?.emailAddresses?.[0]?.emailAddress || undefined,
    image: user?.imageUrl || undefined,
    createdAt: user?.createdAt?.toISOString() || undefined,
    lastSignInAt: user?.lastSignInAt?.toISOString() || undefined,
  }
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  // 鼠标跟踪效果
  const mousePosition = useRef({ x: 0, y: 0 });

  // 滚动动画效果的状态
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 处理滚动事件，用于视差和动画
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // 处理鼠标移动，用于粒子动效交互
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 使用可复用的ParticleBackground组件，移除了原有的canvas粒子背景代码

  // 创建refs用于观察
  const featuresRef = useRef<HTMLDivElement>(null);
  const musicFeatureRef = useRef<HTMLDivElement>(null);
  const imageFeatureRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // 状态管理视口可见性
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [musicFeatureVisible, setMusicFeatureVisible] = useState(false);
  const [imageFeatureVisible, setImageFeatureVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // 设置Intersection Observer
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    
    const observers = [
      { ref: featuresRef, setVisible: setFeaturesVisible },
      { ref: musicFeatureRef, setVisible: setMusicFeatureVisible },
      { ref: imageFeatureRef, setVisible: setImageFeatureVisible },
      { ref: ctaRef, setVisible: setCtaVisible }
    ];

    const observerInstances = observers.map(item => {
      const observer = new IntersectionObserver(([entry]) => {
        item.setVisible(entry.isIntersecting);
      }, observerOptions);
      
      if (item.ref.current) {
        observer.observe(item.ref.current);
      }
      
      return { observer, ref: item.ref };
    });

    return () => {
      observerInstances.forEach(({ observer, ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative px-0">
      {/* 使用粒子背景组件 */}
      <ParticleBackground 
        className="z-0" 
        particleSizeRange={[1, 3]} 
        particleSpeedRange={[0.5, 0.5]}
        connectionDistance={100}
        connectionOpacity={0.3}
        opacity={0.3}
        particleCount={50} //
      />

      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 顶部导航栏 - 仅在根路径显示 */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 z-50">
          <Topbar />
        </header>
        {/* 英雄区域 */}
        <header className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center">
          <div className="animate-[fadeIn_1s_ease-in-out]">
            <div className="inline-block mb-6 p-2 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/10">
              <Music className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500 animate-[fadeIn_1s_ease-in-out] transform transition-all duration-1000" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            创意之声：AI音乐创作平台
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-4 max-w-2xl md:max-w-3xl text-gray-300 leading-relaxed animate-[fadeIn_1.5s_ease-in-out] transform transition-all duration-1000" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
            探索AI驱动的音乐生成与创作平台，释放你的音乐潜能，打造独特的听觉体验。无论你是专业音乐人还是音乐爱好者，都能在这里找到创作灵感。
          </p>
          <p className="text-base md:text-lg mb-8 max-w-2xl md:max-w-3xl text-gray-300 leading-relaxed animate-[fadeIn_1.7s_ease-in-out] transform transition-all duration-1000" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
            使用最先进的AI技术，轻松生成原创音乐、伴奏和歌词，将你的创意转化为令人惊叹的作品。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md animate-[fadeIn_2s_ease-in-out]">
            <Link href="/musicGenerator" className="group w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
                <Music className="w-5 h-5 group-hover:animate-bounce" />
                <span>开始创作音乐</span>
              </div>
            </Link>
          </div>
          
          {/* 平台亮点统计 */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl w-full text-center">
            <div className="animate-[fadeIn_2.2s_ease-in-out]">
              <p className="text-3xl md:text-4xl font-bold text-blue-400">10M+</p>
              <p className="text-sm text-gray-400 mt-2">生成作品</p>
            </div>
            <div className="animate-[fadeIn_2.4s_ease-in-out]">
              <p className="text-3xl md:text-4xl font-bold text-pink-400">500k+</p>
              <p className="text-sm text-gray-400 mt-2">活跃创作者</p>
            </div>
            <div className="animate-[fadeIn_2.6s_ease-in-out]">
              <p className="text-3xl md:text-4xl font-bold text-purple-400">100+</p>
              <p className="text-sm text-gray-400 mt-2">音乐风格</p>
            </div>
          </div>
        </header>

        {/* 特性介绍 */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center transform transition-all duration-1000" style={{ transform: `translateY(${featuresVisible ? 0 : 50}px)`, opacity: featuresVisible ? 1 : 0 }}>为什么选择我们的平台</h2>
          <p className="text-gray-400 text-center mb-8 md:mb-12 max-w-2xl mx-auto transform transition-all duration-1000" style={{ transform: `translateY(${featuresVisible ? 0 : 50}px)`, opacity: featuresVisible ? 1 : 0 }}>我们提供全方位的AI音乐创作解决方案，让音乐创作变得简单而富有创意</p>
          
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-blue-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
              <div className="bg-blue-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Music className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">AI驱动创作</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">利用先进的AI技术，根据你的风格、情绪和偏好，快速生成高质量的音乐作品。</p>
              <p className="text-gray-400 text-xs md:text-sm">支持多种音乐风格和情绪，从古典到现代，从欢快到忧伤，应有尽有。</p>
            </div>
            
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-purple-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-purple-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-6 h-6 md:w-7 md:h-7 text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">多媒体创作</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">不仅可以生成音乐，还能创建配套的视觉艺术，全方位提升你的创意表达。</p>
              <p className="text-gray-400 text-xs md:text-sm">生成专辑封面、音乐视频素材，打造完整的视听体验。</p>
            </div>
            
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-pink-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
              <div className="bg-pink-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">社区共享</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">与全球创作者分享你的作品，获取反馈，发现灵感，共同成长。</p>
              <p className="text-gray-400 text-xs md:text-sm">参与创作挑战，获得专业指导，建立你的音乐创作网络。</p>
            </div>
            
            {/* 新增特性 */}
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-green-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
              <div className="bg-green-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">自定义控制</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">细粒度调整音乐参数，包括节奏、音色、和声和结构，打造专属于你的作品。</p>
              <p className="text-gray-400 text-xs md:text-sm">直观的控制面板，即使没有专业音乐知识也能轻松创作。</p>
            </div>
            
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-yellow-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <div className="bg-yellow-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">即时预览</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">实时听取你的创作成果，边创作边调整，确保音乐符合你的期望。</p>
              <p className="text-gray-400 text-xs md:text-sm">快速渲染技术，无需等待即可听到高质量的音乐预览。</p>
            </div>
            
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-5 md:p-6 transition-all duration-500 hover:bg-white/15 hover:translate-y-[-8px] hover:shadow-xl hover:shadow-orange-500/20 transform transition-all duration-700 ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <div className="bg-orange-500/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">免费使用</h3>
              <p className="text-gray-300 text-sm md:text-base mb-3">基础功能完全免费，随时开始你的音乐创作之旅，无需支付任何费用。</p>
              <p className="text-gray-400 text-xs md:text-sm">高级功能和更多创作选项，升级即可解锁全部潜力。</p>
            </div>
          </div>
        </section>

        {/* 功能展示 */}
        <section className="bg-gradient-to-br from-gray-900/50 to-indigo-900/50 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center transform transition-all duration-1000" style={{ transform: `translateY(${musicFeatureVisible || imageFeatureVisible ? 0 : 50}px)`, opacity: musicFeatureVisible || imageFeatureVisible ? 1 : 0 }}>我们能为你做什么</h2>
            <p className="text-gray-400 text-center mb-8 md:mb-12 max-w-2xl mx-auto transform transition-all duration-1000" style={{ transform: `translateY(${musicFeatureVisible || imageFeatureVisible ? 0 : 50}px)`, opacity: musicFeatureVisible || imageFeatureVisible ? 1 : 0 }}>探索我们的核心功能，释放你的音乐创作潜能</p>
            
            <div className="space-y-12 md:space-y-24">
              {/* 音乐生成功能 */}
              <div ref={musicFeatureRef} className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 transform transition-all duration-1000 ${musicFeatureVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                    AI 音乐创作
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-blue-400 group-hover:scale-105 transition-transform duration-300">个性化音乐生成</h3>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">选择音乐风格、情绪和时长，AI将为你生成独特的音乐作品。无论是平静的钢琴曲、动感的电子乐还是激昂的交响乐，都能轻松创建。</p>
                  <p className="text-gray-300 mb-6 text-sm md:text-base">调整节奏、音色和和声结构，打造专属于你的完美音乐。生成的音乐可以直接下载使用，无需担心版权问题。</p>
                  
                  {/* 功能亮点列表 */}
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>支持 50+ 音乐风格和情绪</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>自定义乐器编排和混音</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>一键导出多种音频格式</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 group">
                  <div className="bg-gradient-to-r from-blue-600/30 to-indigo-700/30 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-blue-500/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/40">
                    <div className="aspect-square flex items-center justify-center relative">
                      {/* 装饰音符 */}
                      <div className="absolute top-1/4 left-1/4 w-12 h-12 text-blue-500 opacity-60 animate-bounce" style={{ animationDelay: '0s' }}>
                        <Music className="w-full h-full" />
                      </div>
                      <div className="absolute top-3/4 left-1/3 w-8 h-8 text-indigo-400 opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Music className="w-full h-full" />
                      </div>
                      <div className="absolute top-1/3 right-1/4 w-10 h-10 text-purple-400 opacity-70 animate-bounce" style={{ animationDelay: '1s' }}>
                        <Music className="w-full h-full" />
                      </div>
                      
                      {/* 主图标 */}
                      <Music className="w-24 h-24 md:w-32 md:h-32 text-blue-400 opacity-80 animate-pulse group-hover:scale-110 transition-transform duration-500 z-10" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 歌词创作功能 - 新增 */}
              <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 transform transition-all duration-1000 ${musicFeatureVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                <div className="md:w-1/2 group">
                  <div className="bg-gradient-to-r from-pink-600/30 to-red-700/30 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-pink-500/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-pink-500/20 group-hover:border-pink-400/40">
                    <div className="aspect-square flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 md:w-32 md:h-32 text-pink-400 opacity-80 animate-pulse group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium">
                    创意写作
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-pink-400 group-hover:scale-105 transition-transform duration-300">智能歌词创作</h3>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">AI辅助歌词创作，根据你的主题、风格和情绪生成富有诗意的歌词。无论是流行、摇滚还是民谣，都能找到合适的表达方式。</p>
                  <p className="text-gray-300 mb-6 text-sm md:text-base">调整押韵、节奏和情感，让歌词完美配合你的音乐创作。</p>
                  
                  {/* 功能亮点列表 */}
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>多种诗歌形式和押韵模式</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>情感分析和主题生成</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>与音乐节奏自动匹配</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* 图像生成功能 */}
              <div ref={imageFeatureRef} className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 transform transition-all duration-1000 ${imageFeatureVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                    视觉创作
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-purple-400 group-hover:scale-105 transition-transform duration-300">配套视觉艺术</h3>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">为你的音乐作品创建匹配的视觉元素。通过描述你的创作风格，AI可以生成专辑封面、音乐视频素材或表演背景。</p>
                  <p className="text-gray-300 mb-6 text-sm md:text-base">探索多种艺术风格，从抽象到具象，从复古到未来，让你的音乐有更完整的视听体验。</p>
                  
                  {/* 功能亮点列表 */}
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>100+ 艺术风格选择</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>高分辨率图像输出</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                      <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>与音乐情绪自动匹配</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 group">
                  <div className="bg-gradient-to-r from-purple-600/30 to-pink-700/30 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-purple-500/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:border-purple-400/40">
                    <div className="aspect-square flex items-center justify-center">
                      <Image className="w-24 h-24 md:w-32 md:h-32 text-purple-400 opacity-80 animate-pulse group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA区域 */}
        <section ref={ctaRef} className={`container mx-auto px-4 py-16 md:py-20 text-center transform transition-all duration-1000 ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 animate-[pulse_3s_infinite]">准备好释放你的音乐创造力了吗？</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto">加入我们的创作社区，开始你的音乐之旅</p>
          <Link href="/musicGenerator" className="inline-block w-full max-w-xs group">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium px-6 py-3 md:py-4 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 group-hover:bg-[length:200%_100%] group-hover:animate-gradient-x">
              立即开始创作
            </div>
          </Link>
          
          {/* 小音符装饰 */}
          <div className="absolute -bottom-10 right-10 opacity-20 hidden md:block">
            <Music className="w-20 h-20 text-pink-400 animate-[spin_20s_linear_infinite]" />
          </div>
        </section>
        
        {/* 底部导航栏 - 仅在根路径显示 */}
        <Bottombar />
      </div>
    </div>
  );
}