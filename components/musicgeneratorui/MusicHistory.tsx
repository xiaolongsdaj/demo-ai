'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MusicData } from '@/interface/music';
import { useAuth } from '../../lib/auth';
import { fetchFromAPI } from '../../lib/api-client';
import MusicPlayerModal from './MusicPlayerModal';
import { AI_MODELS_CONFIG, SubscriptionLevel } from '@/lib/musicModel';
import { PlayIcon } from 'lucide-react';

export interface MusicHistoryProps {
  onSelectMusic?: (music: MusicData) => void;
}

const MusicHistory: React.FC<MusicHistoryProps> = ({ onSelectMusic }) => {
  // 使用统一的认证 Hook
  const { getToken, checkAuth } = useAuth();
  
  const [musicHistory, setMusicHistory] = useState<MusicData[]>([]);
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // 由于历史记录显示不需要订阅级别限制，使用默认的'free'级别获取选项
  const defaultSubscriptionLevel: SubscriptionLevel = 'free';
  const styleOptions = AI_MODELS_CONFIG.musicGeneration.musicStyles(defaultSubscriptionLevel);
  const moodOptions = AI_MODELS_CONFIG.musicGeneration.musicMoods;
  
  // 确保组件在客户端挂载
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 从API获取音乐历史数据
  useEffect(() => {
    const fetchMusicHistory = async () => {
      // 检查是否已登录（使用统一的认证检查）
      if (!checkAuth()) {
        setLoading(false);
        setMusicHistory([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 调用 API（自动使用认证 token）
        const result = await fetchFromAPI(
          '/api/music/generate',
          {},
          getToken, // 传入 getToken 函数，自动处理认证
          'GET'
        );
        
        if (!result.success) {
          throw new Error(result.error || '获取音乐历史记录失败');
        }
        
        setMusicHistory(result.data as MusicData[]);
      } catch (err) {
        console.error('获取音乐历史记录时出错:', err);
        const errorMessage = err instanceof Error ? err.message : '获取音乐历史记录失败';
        setError(errorMessage);
        setMusicHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMusicHistory();
  }, [musicHistory]);
  
  const handleSelectMusic = (music: MusicData) => {
    setCurrentMusic(music);
    console.log('currentMusic:', currentMusic);
    setIsPlayerModalOpen(true);
    if (onSelectMusic) {
      onSelectMusic(music);
    }
  };

  const getTempoLabel = (tempo: string) => {
    switch (tempo) {
      case 'slow':
        return '慢';
      case 'medium':
        return '中等';
      case 'fast':
        return '快';
      default:
        return tempo;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          你的创作
        </h2>
        <div className="text-sm text-gray-400">
          共 {musicHistory.length} 首音乐
        </div>
      </div>
      
      {musicHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicHistory.map((music) => (
            <div
              key={music.id}
              className={`group p-6 rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer relative 
                ${currentMusic?.id === music.id 
                  ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-900/20' 
                  : 'border-gray-700 bg-gray-800/50 hover:bg-gray-700/30 hover:border-gray-600 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 hover:translate-x-1 hover:scale-[1.06]'}`}
              onClick={() => handleSelectMusic(music)}
            >
              {/* 背景装饰 */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-gradient-to-tr from-indigo-500/5 to-blue-500/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {music.name}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1.5 rounded-full bg-gray-700/80 text-gray-300 font-medium">
                  {music.duration}秒
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-5 line-clamp-2 relative z-10">{music.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                <span className="text-xs px-2.5 py-1.5 rounded-full bg-gray-700/50 text-gray-300 hover:bg-blue-600/30 hover:text-blue-300 transition-all duration-300">
                  {styleOptions.find(s => s.value === music.style)?.label || music.style}
                </span>
                <span className="text-xs px-2.5 py-1.5 rounded-full bg-gray-700/50 text-gray-300 hover:bg-purple-600/30 hover:text-purple-300 transition-all duration-300">
                  {moodOptions.find(m => m.value === music.mood)?.label || music.mood}
                </span>
                <span className="text-xs px-2.5 py-1.5 rounded-full bg-gray-700/50 text-gray-300 hover:bg-green-600/30 hover:text-green-300 transition-all duration-300">
                  {getTempoLabel(music.tempo)}
                </span>
                {music.vocalType && music.vocalType !== 'random' && (
                  <span className="text-xs px-2.5 py-1.5 rounded-full bg-gray-700/50 text-gray-300 hover:bg-pink-600/30 hover:text-pink-300 transition-all duration-300">
                    {music.vocalType === 'male' ? '男声' : music.vocalType === 'female' ? '女声' : music.vocalType}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{formatDate(music.createdAt)}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-400 transform scale-90 group-hover:scale-100">
                  <PlayIcon size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="h-64 bg-gray-800/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-gray-700/50">
          <div className="w-10 h-10 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      ) : (
        <div className="h-64 bg-gray-800/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-gray-700/50">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <PlayIcon size={28} className="text-gray-500" />
          </div>
          <p className="text-gray-400 mb-2">暂无生成记录</p>
          <p className="text-xs text-gray-500">开始创作你的第一首音乐吧！</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {/* 使用 Portal 将模态框渲染到 document.body */}
      {isMounted && typeof window !== 'undefined' && createPortal(
        <MusicPlayerModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          music={currentMusic}
        />,
        document.body
      )}
    </section>
  );
};

export default MusicHistory;