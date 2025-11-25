'use client'
import { useState, useEffect, useRef } from 'react';
import { MusicData } from '../../app/api/music/types';
import { useAuth } from '../../lib/auth';
import { fetchFromAPI } from '../../lib/api-client';
import MusicPlayerModal from './MusicPlayerModal';
import { useSubscriptionPermissions } from '@/lib/subscription-permissions';
import { getMusicStyles, getMusicMoods, getAvailableDurations, getModelsBySubscriptionLevel, getHumanVoices } from '@/lib/model';

const MusicGeneratorForm = () => {
  // 使用统一的认证 Hook
  const { getToken, checkAuth } = useAuth();
  // 使用订阅权限 Hook
  const { canUseFeature, getSubscriptionDisplayInfo } = useSubscriptionPermissions();//检查用户是否有使用某个功能的权限
  
  // 音乐生成相关状态
  const [musicName, setMusicName] = useState('');//音乐名称
  const [musicDescription, setMusicDescription] = useState('');//音乐描述
  const [musicStyle, setMusicStyle] = useState('pop');//音乐风格
  const [mood, setMood] = useState('happy');//音乐情感
  const [duration, setDuration] = useState('15');//音乐时长
  const [tempo, setTempo] = useState('medium');//音乐速度
  const [vocalType, setVocalType] = useState('random');//人声类型
  const [isGenerating, setIsGenerating] = useState(false);//是否正在生成音乐
  const [generatedMusic, setGeneratedMusic] = useState<MusicData | null>(null);//生成的音乐数据
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);//是否打开音乐播放器弹窗
  const [error, setError] = useState<string | null>(null);//错误信息
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);//是否显示升级提示弹窗
  const [selectedModel, setSelectedModel] = useState('model-music-gen-1');// 选中的模型
  const [showModelDropdown, setShowModelDropdown] = useState(false);// 控制模型选择下拉菜单显示/隐藏
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  
  // 根据权限判断订阅级别
  const determineSubscriptionLevel = () => {
    if (canUseFeature('high-quality')) return 'premium';
    if (canUseFeature('custom-parameters')) return 'standard';
    return 'free';
  };
  
  // 获取配置数据
  const styleOptions = getMusicStyles();
  const moodOptions = getMusicMoods();
  const humanVoiceOptions = getHumanVoices();
  const subscriptionLevel = determineSubscriptionLevel();
  const availableDurations = getAvailableDurations(subscriptionLevel);
  const availableModels = getModelsBySubscriptionLevel(subscriptionLevel);
  
  // 确保选中的模型在可用模型范围内
  useEffect(() => {
    const modelExists = availableModels.some(model => model.id === selectedModel);
    if (!modelExists && availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    }
  }, [selectedModel, availableModels]);

  // 全局点击事件监听器 - 点击下拉菜单外的区域时关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showModelDropdown && 
          dropdownRef.current && 
          modelSelectorRef.current &&
          !dropdownRef.current.contains(event.target as Node) && 
          !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModelDropdown]);
  
  // 生成音乐处理函数
  const handleGenerateMusic = async () => {
    // 检查是否已登录（使用统一的认证检查）
    if (!checkAuth()) {
      setError('请先登录后再生成音乐');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!musicName || !musicDescription || !musicStyle || !mood || !vocalType) {
      setError('请填写完整的音乐名称、描述和选择参数');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // 权限检查：检查是否尝试使用高级功能
    const requestedDuration = parseInt(duration);
    const isUsingAdvancedFeatures = requestedDuration > 30;
    
    if (isUsingAdvancedFeatures && !canUseFeature('custom-parameters')) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
        const result = await fetchFromAPI('/api/music/generate', {
          name: musicName,
          description: musicDescription,
          style: musicStyle,
          mood: mood,
          duration: duration,
          tempo: tempo,
          vocalType: vocalType,
          modelId: selectedModel // 添加选中的模型ID
        },
        getToken,
        'POST'
        );
      
      if (!result.success) {
        throw new Error(result.error || '生成音乐失败');
      }
      
      // 保存生成的音乐数据
      setGeneratedMusic(result.data as MusicData);
      
      setIsPlayerModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成音乐时出现错误');
    } finally {
      setIsGenerating(false);
    }
  };

  // 处理时长选择（根据权限控制）
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = e.target.value;
    const durationSeconds = parseInt(newDuration);
    
    // 检查是否选择了高级功能但没有权限
    if (durationSeconds > 30 && !canUseFeature('custom-parameters')) {
      setShowUpgradePrompt(true);
      return;
    }
    
    setDuration(newDuration);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* 模型选择 */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            模型选择
          </label>
          <div className="relative">
            {/* 当前选中的模型显示 */}
          <div 
            ref={modelSelectorRef}
            className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl flex justify-between items-center cursor-pointer hover:border-indigo-500/50 transition-all"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚡</span>
              <span>{availableModels.find(m => m.id === selectedModel)?.name || '选择模型'}</span>
            </div>
            <span className={`text-gray-400 transition-transform duration-300 ${showModelDropdown ? 'rotate-180' : ''}`}>▼</span>
          </div>
            
            {/* 模型选择列表 - 仅在showModelDropdown为true时显示 */}
            {showModelDropdown && (
              <div ref={dropdownRef} className="absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl z-10 mt-1 overflow-hidden">
                {availableModels.map((model) => {
                  // 提取版本号用于显示
                  const versionMatch = model.name.match(/v\d+(?:\.\d+)?(?:\+)?/);
                  const version = versionMatch ? versionMatch[0] : '';
                  
                  return (
                    <div 
                      key={model.id}
                      className={`p-3 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all flex justify-between items-center ${selectedModel === model.id ? 'bg-gray-700/40' : ''}`}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelDropdown(false); // 选择后关闭下拉菜单
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {selectedModel === model.id && (
                          <span className="text-green-400 font-bold">✓</span>
                        )}
                        <span className="text-yellow-400">⚡</span>
                        <div>
                          <div className="text-white font-medium">
                {model.name}
              </div>
                        </div>
                      </div>
                      <span className="text-green-400">●</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>


        {/* 音乐名称输入 */}
        <div>
          <label htmlFor="musicName" className="block text-sm font-medium text-white mb-1">
            歌曲名称
          </label>
          <input
            id="musicName"
            type="text"
            className="w-full p-3 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="给你的音乐起个名字..."
            value={musicName}
            onChange={(e) => setMusicName(e.target.value)}
          />
        </div>

        {/* 音乐描述输入 */}
        <div>
          <label htmlFor="musicDescription" className="block text-sm font-medium text-white mb-1">
            音乐描述 *
          </label>
          <textarea
            id="musicDescription"
            className="w-full p-4 bg-gray-700/40 border border-gray-600/60 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-y"
            placeholder="描述您想要的音乐风格、情感或场景..."
            value={musicDescription}
            onChange={(e) => setMusicDescription(e.target.value)}
          />
        </div>

        

        {/* 三个选择器并排显示 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 音乐风格 */}
          <div>
            <label htmlFor="musicStyle" className="block text-sm font-medium text-white mb-1">
              音乐风格
            </label>
            <div className="relative">
              <select
                id="musicStyle"
                className="w-full p-3 bg-gray-800/60 border border-gray-600/80 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-400/30 bg-opacity-80"
                value={musicStyle}
                onChange={(e) => setMusicStyle(e.target.value)}
              >
                <option value="" className="bg-gray-800 text-white">选择音乐风格</option>
                {styleOptions.map((style) => (
                  <option key={style.value} value={style.value} className="bg-gray-800 text-white hover:bg-gray-700">{style.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 情感氛围 */}
          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-white mb-1">
              情感氛围
            </label>
            <div className="relative">
              <select
                id="mood"
                className="w-full p-3 bg-gray-800/60 border border-gray-600/80 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-400/30 bg-opacity-80"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="" className="bg-gray-800 text-white">选择情感氛围</option>
                {moodOptions.map((moodOption) => (
                  <option key={moodOption.value} value={moodOption.value} className="bg-gray-800 text-white hover:bg-gray-700">{moodOption.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 人声类型 */}
          <div>
            <label htmlFor="vocalType" className="block text-sm font-medium text-white mb-1">
              人声类型
            </label>
            <div className="relative">
              <select
                id="vocalType"
                className="w-full p-3 bg-gray-800/60 border border-gray-600/80 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-400/30 bg-opacity-80"
                value={vocalType}
                onChange={(e) => setVocalType(e.target.value)}
              >
                <option value="" className="bg-gray-800 text-white">选择人声类型</option>
                {humanVoiceOptions.map((voice) => (
                  <option key={voice.value} value={voice.value} className="bg-gray-800 text-white hover:bg-gray-700">{voice.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 音乐时长和速度选择 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 时长选择 - 带权限控制 */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-white mb-1">
              音乐时长
            </label>
            <div className="relative">
              <select
                id="duration"
                className={`w-full p-3 bg-gray-800/60 border border-gray-600/80 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-400/30 bg-opacity-80 ${!canUseFeature('custom-parameters') ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={duration}
                onChange={handleDurationChange}
              >
                {availableDurations.map((durationOption) => (
                  <option 
                    key={durationOption.value} 
                    value={durationOption.value}
                    disabled={!durationOption.free && !canUseFeature('custom-parameters')}
                    className={`bg-gray-800 ${!durationOption.free && !canUseFeature('custom-parameters') ? 'text-gray-500' : 'text-white'}`}
                  >
                    {durationOption.label}{!durationOption.free && !canUseFeature('custom-parameters') ? ' (高级用户)' : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 音乐速度 */}
          <div>
            <label htmlFor="tempo" className="block text-sm font-medium text-white mb-1">
              音乐速度
            </label>
            <div className="relative">
              <select
                id="tempo"
                className="w-full p-3 bg-gray-800/60 border border-gray-600/80 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 appearance-none cursor-pointer hover:border-indigo-400/30 bg-opacity-80"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
              >
                <option value="slow" className="bg-gray-800 text-white hover:bg-gray-700">慢</option>
                <option value="medium" className="bg-gray-800 text-white hover:bg-gray-700">中等</option>
                <option value="fast" className="bg-gray-800 text-white hover:bg-gray-700">快</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button
          className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:shadow-purple-600/20 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleGenerateMusic}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              开始创作
            </div>
          ) : '开始创作'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* 订阅计划提示 - 显示当前订阅状态 */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>当前订阅: <span className="text-blue-400 font-medium">{getSubscriptionDisplayInfo().planName}</span></p>
        <a href="/musicGenerator/pricing" className="text-blue-400 hover:underline mt-1 inline-block">升级订阅以解锁更多功能</a>
      </div>

      {/* 音乐播放器模态框 */}
      {isPlayerModalOpen && (
        <MusicPlayerModal 
          isOpen={isPlayerModalOpen}
          music={generatedMusic!}
          onClose={() => setIsPlayerModalOpen(false)}
        />
      )}

      {/* 升级提示弹窗 */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-3">需要升级订阅</h3>
            <p className="text-gray-300 mb-5">
              您正在尝试使用高级功能，这需要升级到标准版或企业版订阅。
            </p>
            <div className="space-y-3">
              <button
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-bold transition-all"
                onClick={() => {
                  setShowUpgradePrompt(false);
                  window.location.href = 'musicGenerator/pricing';
                }}
              >
                查看订阅计划
              </button>
              <button
                className="w-full py-3 px-6 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-white font-medium transition-all"
                onClick={() => setShowUpgradePrompt(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicGeneratorForm;