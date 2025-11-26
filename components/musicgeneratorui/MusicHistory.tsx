'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MusicData } from '@/interface/music';
import { useAuth } from '../../lib/auth';
import { fetchFromAPI } from '../../lib/api-client';
import MusicPlayerModal from './MusicPlayerModal';
import { AI_MODELS_CONFIG, SubscriptionLevel } from '@/lib/musicModel';

export interface MusicHistoryProps {
  onSelectMusic?: (music: MusicData) => void;
}

const MusicHistory: React.FC<MusicHistoryProps> = ({ onSelectMusic }) => {
  // 使用统一的认证 Hook
  const { getToken, checkAuth, isSignedIn } = useAuth();
  
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
  }, [isSignedIn, getToken]);
  
  const handleSelectMusic = (music: MusicData) => {
    setCurrentMusic(music);
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
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">你的创作</h2>
      </div>
      
      {musicHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicHistory.map((music) => (
            <div
              key={music.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${currentMusic?.id === music.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-700/10 hover:bg-gray-700/20'}`}
              onClick={() => handleSelectMusic(music)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-white">{music.name}</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">{music.duration}秒</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{music.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                  {styleOptions.find(s => s.value === music.style)?.label || music.style}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                  {moodOptions.find(m => m.value === music.mood)?.label || music.mood}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                  {getTempoLabel(music.tempo)}
                </span>
                {music.vocalType && music.vocalType !== 'random' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300">
                    {music.vocalType === 'male' ? '男声' : music.vocalType === 'female' ? '女声' : music.vocalType}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatDate(music.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="h-40 bg-gray-700/10 rounded-xl flex flex-col items-center justify-center">
          <p className="text-gray-400">加载中...</p>
        </div>
      ) : (
        <div className="h-40 bg-gray-700/10 rounded-xl flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-2">暂无生成记录</p>
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