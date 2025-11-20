// 音乐数据类型定义
export interface MusicData {
  id: string;
  title: string;
  description: string;
  style: string;
  mood: string;
  duration: number;
  tempo: string;
  audioUrl: string;
  createdAt: string;
}

// 音乐生成参数类型
export interface MusicGenerateParams {
  description: string;
  style: string;
  mood: string;
  duration: string;
  tempo: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 音乐风格选项
export const styleOptions = [
  { value: 'electronic', label: '电子' },
  { value: 'classical', label: '古典' },
  { value: 'rock', label: '摇滚' },
  { value: 'pop', label: '流行' },
  { value: 'jazz', label: '爵士' },
  { value: 'ambient', label: '氛围' },
];

// 情绪选项
export const moodOptions = [
  { value: 'happy', label: '欢快' },
  { value: 'sad', label: '悲伤' },
  { value: 'exciting', label: '激动' },
  { value: 'calm', label: '平静' },
  { value: 'mysterious', label: '神秘' },
  { value: 'energetic', label: '充满活力' },
];