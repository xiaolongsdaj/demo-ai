'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MusicData } from '@/interface/music';

export interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  music: MusicData | null;
}

const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ isOpen, onClose, music }) => {
  // 音乐播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  
  // 当模态框关闭时重置播放状态
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);
  
  // 当音乐变化时重置状态
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioProgress(0);
    // 如果音乐数据中有时长信息，可以设置它
    setTotalDuration(music?.duration ? music.duration : 0);
  }, [music]);
  
  // 模拟播放进度更新
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isPlaying && totalDuration > 0) {
      // 每秒更新一次进度
      intervalId = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // 如果到达或超过总时长，停止播放
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            setAudioProgress(0);
            setCurrentTime(0);
            return 0;
          }
          // 更新进度百分比
          setAudioProgress((newTime / totalDuration) * 100);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, totalDuration]);
  
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
    setIsPlaying(!isPlaying);
  };
  //快进
  const rewind = () => {
    setCurrentTime(prev => Math.max(0, prev - 10));
    setAudioProgress(prev => {
      const newProgress = (Math.max(0, currentTime - 10) / totalDuration) * 100;
      return isNaN(newProgress) ? 0 : newProgress;
    });
  };
  //快退
  const forward = () => {
    setCurrentTime(prev => Math.min(totalDuration, prev + 10));
    setAudioProgress(prev => {
      const newProgress = (Math.min(totalDuration, currentTime + 10) / totalDuration) * 100;
      return isNaN(newProgress) ? 0 : newProgress;
    });
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
    // 计算并设置当前时间
    setCurrentTime((newProgress / 100) * totalDuration);
  };
  
  // 处理进度条点击事件
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setAudioProgress(clampedPercentage);
    setCurrentTime((clampedPercentage / 100) * totalDuration);
  };
  
  // 处理进度指示器拖拽事件
  const handleProgressIndicatorMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.preventDefault();
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const progressBar = e.currentTarget.parentElement;
      if (!progressBar) return;
      
      const rect = progressBar.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      
      setAudioProgress(clampedPercentage);
      // 计算并设置当前时间
      setCurrentTime((clampedPercentage / 100) * totalDuration);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen || !music) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{animation: isOpen ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.15s ease-in'}}
    >
      <div 
        ref={modalRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto relative"
        onClick={handleModalClick}
        style={{animation: isOpen ? 'scaleIn 0.25s ease-out' : 'scaleOut 0.2s ease-in'}}
      >
        {/* 背景装饰元素 */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="p-4 md:p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <button 
              className="w-10 h-10 flex items-center justify-center text-white rounded-full bg-white/10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 ml-auto"
              onClick={onClose}
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">{music.name}</h3>
            <p className="text-gray-300 mb-5 text-sm md:text-base max-w-lg mx-auto leading-relaxed">{music.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs md:text-sm">
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-300 border border-blue-800/30 transition-all duration-300 hover:from-blue-800/40 hover:to-indigo-800/40">
                {music.style}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 border border-purple-800/30 transition-all duration-300 hover:from-purple-800/40 hover:to-pink-800/40">
                {music.mood}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 border border-gray-700/30 transition-all duration-300 hover:from-gray-700/60 hover:to-gray-600/60">
                {music.duration}秒
              </span>
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 border border-gray-700/30 transition-all duration-300 hover:from-gray-700/60 hover:to-gray-600/60">
                {music.tempo === 'slow' ? '慢' : music.tempo === 'fast' ? '快' : '中等'}
              </span>
              {music.vocalType && music.vocalType !== 'random' && (
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-900/30 to-teal-900/30 text-green-300 border border-green-800/30 transition-all duration-300 hover:from-green-800/40 hover:to-teal-800/40">
                  {music.vocalType === 'male' ? '男声' : music.vocalType === 'female' ? '女声' : music.vocalType}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full h-32 flex items-end justify-center mb-6">
            <div className="w-full h-24 flex items-end justify-center space-x-1.5">
              {/* 静态可视化效果，根据播放状态调整样式 */}
              {Array.from({ length: 32 }).map((_, i) => {
                // 播放时的动态效果
                const playHeight = `${40 + Math.sin(i * 0.4 + (Date.now() * 0.002)) * 30}%`;
                // 暂停时的静态效果
                const pauseHeight = `${30 + Math.sin(i * 0.4) * 20}%`;
                
                return (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 via-indigo-500 to-purple-600 rounded-t-full transition-all duration-300"
                    style={{
                      height: isPlaying ? playHeight : pauseHeight,
                      opacity: isPlaying ? 0.9 : 0.5,
                      animationDuration: `${0.3 + (i % 5) * 0.1}s`,
                      animationIterationCount: isPlaying ? 'infinite' : '1',
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex justify-between text-xs md:text-sm text-gray-400 mb-2">
              <span className="font-medium transition-colors hover:text-white">{formatTime(currentTime)}</span>
              <span className="font-medium transition-colors hover:text-white">{formatTime(totalDuration)}</span>
            </div>
            <div className="relative w-full h-2.5 cursor-pointer" onClick={handleProgressBarClick}>
              {/* 背景轨道 */}
              <div className="absolute inset-0 bg-gray-700/50 rounded-full overflow-hidden">
                {/* 已播放部分 */}
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-200"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div 
                className="absolute w-5 h-5 rounded-full bg-white shadow-lg shadow-purple-900/30 cursor-pointer transform -translate-y-1/2 transition-all duration-200 hover:scale-110"
                style={{ left: `${audioProgress}%`, top: '50%' }}
                onMouseDown={handleProgressIndicatorMouseDown}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={audioProgress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="播放进度"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6 md:space-x-8">
            <button
              className="p-3 md:p-4 rounded-full transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white hover:scale-110 group relative overflow-hidden"
              onClick={rewind}
            >
              <span className="relative z-10 text-xl transform group-hover:-translate-x-1 transition-transform duration-200">⏮</span>
              <span className="absolute inset-0 bg-white/20 rounded-full transform scale-0 transition-transform duration-500 ease-out group-hover:scale-100"></span>
            </button>
            
            <button
              className="p-4 md:p-5 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-110 active:scale-95 shadow-lg hover:shadow-blue-900/30 relative overflow-hidden"
              onClick={togglePlayPause}
              style={{
                boxShadow: isPlaying ? '0 0 20px rgba(79, 70, 229, 0.5)' : '0 4px 15px rgba(79, 70, 229, 0.3)'
              }}
            >
              <span className="relative z-10 text-2xl">{isPlaying ? '⏸' : '▶'}</span>
              <span className="absolute inset-0 bg-white/20 rounded-full transform scale-0 transition-transform duration-500 ease-out"></span>
              {/* 脉冲动画效果 */}
              {isPlaying && (
                <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-75"></span>
              )}
            </button>
            
            <button
              className="p-3 md:p-4 rounded-full transition-all duration-300 bg-gray-700/50 hover:bg-gray-700 text-white hover:scale-110 group relative overflow-hidden"
              onClick={forward}
            >
              <span className="relative z-10 text-xl transform group-hover:translate-x-1 transition-transform duration-200">⏭</span>
              <span className="absolute inset-0 bg-white/20 rounded-full transform scale-0 transition-transform duration-500 ease-out group-hover:scale-100"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerModal;