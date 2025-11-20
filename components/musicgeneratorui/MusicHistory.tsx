'use client'
import React, { useState, useEffect } from 'react';
import { MusicData, styleOptions, moodOptions } from '../../app/api/music/types';
import MusicPlayerModal from './MusicPlayerModal';

export interface MusicHistoryProps {
  onSelectMusic?: (music: MusicData) => void;
}

const MusicHistory: React.FC<MusicHistoryProps> = ({ onSelectMusic }) => {
  const [musicHistory, setMusicHistory] = useState<MusicData[]>([]);
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  
  // 从API获取音乐历史数据
  useEffect(() => {
    const fetchMusicHistory = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch('/api/music/generate');
          if (!response.ok) {
            throw new Error('获取音乐历史记录失败');
          }
        const data = await response.json();
        setMusicHistory(data);
      } catch (err) {
        console.error('获取音乐历史记录时出错:', err);
        setError('获取音乐历史记录失败');
        setMusicHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMusicHistory();
  }, []);
  
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
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">查看全部</button>
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
                <h3 className="text-lg font-medium text-white">{music.title}</h3>
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
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatDate(music.createdAt)}</span>
                <button 
                  className="text-blue-400 hover:text-blue-300 font-medium"
                  onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMusic(music);
                }}
              >
                播放
              </button>
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
          <button 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            onClick={() => {
              document.getElementById('description')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            开始生成你的第一首音乐
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <MusicPlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        music={currentMusic}
      />
    </section>
  );
};

export default MusicHistory;