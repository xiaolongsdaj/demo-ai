'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MusicData, styleOptions, moodOptions } from '../../app/api/music/types';

// 音乐播放模态框组件
export interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  music: MusicData | null;
}

const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ isOpen, onClose, music }) => {
  // 音乐播放相关状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioProgress(0);
    setTotalDuration(0);
  }, [music]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // 阻止模态框内部点击事件冒泡
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !music) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('播放失败:', error);
        alert('播放失败，请检查浏览器权限');
      });
    }
    setIsPlaying(!isPlaying);
  };
  
  // 快退10秒
  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };
  
  // 快进10秒
  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(totalDuration, audioRef.current.currentTime + 10);
    }
  };
  
  // 更新播放进度
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      setCurrentTime(current);
      if (duration) {
        setAudioProgress((current / duration) * 100);
      }
    }
  };
  
  // 设置音频总时长
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration || 0);
    }
  };
  
  // 格式化时间显示
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setAudioProgress(newProgress);
    
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * totalDuration;
    }
  };

  if (!isOpen || !music) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={handleModalClick}
      >
        <audio
          ref={audioRef}
          src={music.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">音乐播放器</h2>
            <button 
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">{music.title}</h3>
            <p className="text-gray-300 mb-3 text-sm md:text-base">{music.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-700/30">{styleOptions.find(s => s.value === music.style)?.label || music.style}</span>
              <span className="px-2 py-1 rounded-full bg-gray-700/30">{moodOptions.find(m => m.value === music.mood)?.label || music.mood}</span>
              <span className="px-2 py-1 rounded-full bg-gray-700/30">{music.duration}秒</span>
              <span className="px-2 py-1 rounded-full bg-gray-700/30">{music.tempo === 'slow' ? '慢' : music.tempo === 'fast' ? '快' : '中等'}</span>
            </div>
          </div>
          
          <div className="w-full h-28 flex items-center justify-center mb-6">
            <div className="w-full h-20 flex items-center justify-center space-x-1">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                  style={{
                    height: `${20 + Math.random() * 50}px`,
                    opacity: 0.6 + (i / 60) * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex justify-between text-xs md:text-sm text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={audioProgress}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-700/50 rounded-full appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #4f46e5, #8b5cf6 ${audioProgress}%, #374151 ${audioProgress}%)`,
                outline: 'none',
              }}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-6 md:space-x-8">
            <button
              className="p-3 md:p-4 rounded-full transition-all bg-gray-700/50 hover:bg-gray-700 text-white hover:scale-105"
              onClick={rewind}
            >
              ⏮
            </button>
            
            <button
              className="p-4 md:p-5 rounded-full transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105"
              onClick={togglePlayPause}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            
            <button
              className="p-3 md:p-4 rounded-full transition-all bg-gray-700/50 hover:bg-gray-700 text-white hover:scale-105"
              onClick={forward}
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerModal;