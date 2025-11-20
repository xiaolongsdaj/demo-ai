'use client'
import React, { useState } from 'react';
import { MusicData, styleOptions, moodOptions } from '../../app/api/music/types';
import MusicPlayerModal from './MusicPlayerModal';

// 生成音乐API函数
const generateMusicApi = async (params: {
  description: string;
  style: string;
  mood: string;
  duration: string;
  tempo: string;
}): Promise<MusicData> => {
  const response = await fetch('/api/music/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '生成音乐失败');
  }
  
  return await response.json();
};

const MusicGeneratorForm = () => {
  // 音乐生成相关状态
  const [musicDescription, setMusicDescription] = useState('');
  const [musicStyle, setMusicStyle] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('30');
  const [tempo, setTempo] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<MusicData | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 生成音乐处理函数
  const handleGenerateMusic = async () => {
    if (!musicDescription || !musicStyle || !mood) {
      setError('请填写完整的音乐描述和选择参数');
      setTimeout(() => setError(null), 3000);
      return;
    }
    //重置错误状态
    setError(null);
    setIsGenerating(true);
    
    try {
      // 调用API，获取数据
      const music = await generateMusicApi({
        description: musicDescription,
        style: musicStyle,
        mood: mood,
        duration: duration,
        tempo: tempo,
      });
      
      // 保存生成的音乐数据
      setGeneratedMusic(music);
      
      setIsPlayerModalOpen(true);
      
      setMusicDescription('');
      setMusicStyle('');
      setMood('');
    } catch (error) {
      console.error('生成音乐失败:', error);
      const errorMessage = error instanceof Error ? error.message : '生成音乐失败，请重试';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-10 border border-gray-700/50 shadow-xl">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">生成你的音乐</h2>
      {error && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 mb-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            描述你的音乐
          </label>
          <textarea
            id="description"
            placeholder="描述你想要的音乐风格、主题或场景..."
            className="w-full min-h-[120px] p-4 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
            value={musicDescription}
            onChange={(e) => setMusicDescription(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label htmlFor="style" className="block text-sm font-medium text-gray-300">
              音乐风格
            </label>
            <select
              id="style"
              className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={musicStyle}
              onChange={(e) => setMusicStyle(e.target.value)}
            >
              <option value="">选择风格</option>
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="mood" className="block text-sm font-medium text-gray-300">
              情绪
            </label>
            <select
              id="mood"
              className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="">选择情绪</option>
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
              时长 (秒)
            </label>
            <select
              id="duration"
              className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
              <option value="120">120</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tempo" className="block text-sm font-medium text-gray-300">
              速度
            </label>
            <select
              id="tempo"
              className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
            >
              <option value="slow">慢</option>
              <option value="medium">中等</option>
              <option value="fast">快</option>
            </select>
          </div>
        </div>
        
        <button
          className={`w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:shadow-indigo-600/20 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleGenerateMusic}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在生成...
            </div>
          ) : '生成音乐'}
        </button>
      </div>
      <MusicPlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        music={generatedMusic}
      />
    </section>
  );
};

export default MusicGeneratorForm;