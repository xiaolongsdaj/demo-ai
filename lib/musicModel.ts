//音乐生成模型配置

//参数类型定义
/**
 * 订阅等级类型
 */
export type SubscriptionLevel = 'free' | 'standard' | 'enterprise';
/**
 * 模式类型
 */
export type GenerationMode = 'inspiration' | 'custom' | 'instrumental';
/**
 * 选项类型 - 支持按订阅等级过滤
 */
export type Option = {
  value: string | number;
  label: string;
  free?: boolean;
  description?: string;
  icon?: string;
  bpmRange?: string;
  allowedSubscriptionLevels?: SubscriptionLevel[]; // 该选项允许的订阅等级
};
/**
 * 参数可见性条件类型 - 增强订阅等级控制
 */
export type VisibilityCondition = {
  mode: GenerationMode[];
  subscriptionLevel: SubscriptionLevel[];
};
/**
 * 单个参数配置类型 - 增强订阅等级支持
 */
export type ParameterConfig = {
  id: string;
  label: string;
  type: 'string' | 'number' | 'select' | 'textarea';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: Option[] | ((subscriptionLevel: SubscriptionLevel) => Option[]); // 支持动态选项
  visibility?: VisibilityCondition;
  apiKey?: string;//参数需要的API密钥
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
  description?: string;
  order?: number;
  minimumSubscriptionLevel?: SubscriptionLevel;//参数最小订阅等级
};

/**
 * 模式配置类型 - 增强默认值和订阅等级支持
 */
export type ModeConfig = {
  id: GenerationMode;
  name: string;
  description: string;
  minimumSubscriptionLevel: SubscriptionLevel;
};

// 音乐生成大模型配置


/**
 * 音乐生成大模型配置
 */
export const AI_MODELS_CONFIG = {
  musicGeneration: {
    category: "音乐生成",
    models: [
      {
        id: "Chirp v4.0",
        name: "Chirp v4.0",
        description: "擅长生成流行音乐旋律，适合短视频和社交媒体使用",
        minimumSubscriptionLevel: "free",
        allowedModes: ['inspiration', 'custom', 'instrumental']
      },
      {
        id: "Chirp v4.5", 
        name: "Chirp v4.5",
        description: "专业古典和交响乐生成，适合电影配乐和商业项目",
        minimumSubscriptionLevel: "standard",
        allowedModes: ['inspiration', 'custom', 'instrumental']
      },
      {
        id: "Chirp v5.0",
        name: "Chirp v5.0",
        description: "专业爵士音乐生成，风格纯正，即兴性强",
        minimumSubscriptionLevel: "standard",
        allowedModes: ['inspiration', 'custom', 'instrumental']
      },
      {
        id: "Chirp v5.5",
        name: "Chirp v5.5",
        description: "生成地道的乡村和民谣风格音乐，温暖质朴",
        minimumSubscriptionLevel: "enterprise",
        allowedModes: ['inspiration', 'custom', 'instrumental']
      }
    ],
    musicStyles: (subscriptionLevel: SubscriptionLevel) => {
      const baseStyles = [
        { value: "pop", label: "流行", allowedSubscriptionLevels: ['free', 'standard', 'enterprise'] },
        { value: "electronic", label: "电子", allowedSubscriptionLevels: ['free', 'standard', 'enterprise'] },
        { value: "rock", label: "摇滚", allowedSubscriptionLevels: ['standard', 'enterprise'] },
        { value: "jazz", label: "爵士", allowedSubscriptionLevels: ['standard', 'enterprise'] },
        { value: "classical", label: "古典", allowedSubscriptionLevels: ['enterprise'] },
        { value: "country", label: "乡村", allowedSubscriptionLevels: ['enterprise'] },
        { value: "folk", label: "民谣", allowedSubscriptionLevels: ['enterprise'] },
      ];
      return baseStyles.filter(style => 
        !style.allowedSubscriptionLevels || style.allowedSubscriptionLevels.includes(subscriptionLevel)
      );
    },
    // 音乐情绪选项
    musicMoods: [
      { value: "happy", label: "欢快" },
      { value: "sad", label: "悲伤" },
      { value: "exciting", label: "激动" },
      { value: "calm", label: "平静" },
      { value: "mysterious", label: "神秘" },
      { value: "inspiring", label: "鼓舞人心" },
      { value: "romantic", label: "浪漫" },
    ],
    // 音乐速度选项
    musicTempos: [
      { value: "slow", label: "慢", bpmRange: "60-90" },
      { value: "medium", label: "中等", bpmRange: "90-120" },
      { value: "fast", label: "快", bpmRange: "120-160" }
    ],
    // 音乐时长选项（秒）- 按订阅等级分级
    musicDurations: (subscriptionLevel: SubscriptionLevel) => {
      const durations = [
        { value: "15", label: "15秒", free: true, allowedSubscriptionLevels: ['free', 'standard', 'enterprise'] },
        { value: "30", label: "30秒", free: true, allowedSubscriptionLevels: ['standard', 'enterprise'] },
        { value: "60", label: "60秒", free: true, allowedSubscriptionLevels: ['standard', 'enterprise'] },
        { value: "120", label: "120秒", free: true, allowedSubscriptionLevels: ['enterprise'] },
        { value: "180", label: "180秒", free: true, allowedSubscriptionLevels: ['enterprise'] }
      ];
      return durations.filter(duration => 
        !duration.allowedSubscriptionLevels || duration.allowedSubscriptionLevels.includes(subscriptionLevel)
      );
    },
    // 人声音选项
    humanVoices: [
      { value: "random", label: "随机" },
      { value: "male", label: "男声" },
      { value: "female", label: "女声" },
    ],
  }
};

/**
 * 定义可用的音乐生成模式
 */
export const modeConfigs: ModeConfig[] = [
  {
    id: 'inspiration',
    name: '灵感模式',
    description: '根据给定的灵感生成音乐',
    minimumSubscriptionLevel: 'free'
  },
  {
    id: 'custom',
    name: '自定义模式',
    description: '完全自定义音乐参数',
    minimumSubscriptionLevel: 'standard'
  },
  {
    id: 'instrumental',
    name: '纯音乐模式',
    description: '生成不含人声的纯音乐',
    minimumSubscriptionLevel: 'standard'
  },
];

/**
 * 定义所有参数配置 - 增强订阅等级支持
 */
export const parameterConfigs: ParameterConfig[] = [
  // 基本信息组
  {
    id: 'modelId',
    label: '模型选择',
    type: 'select',
    required: true,
    defaultValue: 'Chirp v4.0',
    apiKey: 'modelId',
    order: 1,
    visibility: {
      mode: ['inspiration', 'custom', 'instrumental'],
      subscriptionLevel: ['free', 'standard', 'enterprise'],
    },
    options: (subscriptionLevel: SubscriptionLevel) => 
      AI_MODELS_CONFIG.musicGeneration.models
        .filter(model => {
          // 根据订阅等级过滤可用模型
          if (subscriptionLevel === "enterprise") return true;
          if (subscriptionLevel === "standard") return model.minimumSubscriptionLevel !== "enterprise";
          return model.minimumSubscriptionLevel === "free";
        })
        .map(model => ({
          value: model.id,
          label: model.name,
          description: model.description,
          free: model.minimumSubscriptionLevel === 'free'
        }))
  },
  {
    id: 'musicName',
    label: '歌曲名称',
    type: 'string',
    required: true,
    defaultValue: '',
    placeholder: '给你的音乐起个名字...',
    apiKey: 'musicName',
    order: 2,
    visibility: {
      mode: ['inspiration', 'custom', 'instrumental'],
      subscriptionLevel: ['free', 'standard', 'enterprise'],
    },
    validation: {
      minLength: 1,
      maxLength: 100,
      message: '请输入有效的歌曲名称',
    },
  },
  {
    id: 'musicDescription',
    label: '音乐描述',
    type: 'textarea',
    required: true,
    defaultValue: '',
    placeholder: '描述您想要的音乐风格、情感或场景...',
    apiKey: 'musicDescription',
    order: 3,
    visibility: {
      mode: ['inspiration', 'instrumental'],
      subscriptionLevel: ['free', 'standard', 'enterprise'],
    },
    validation: {
      minLength: 5,
      message: '请提供详细的音乐描述（至少5个字符）',
    },
  },
  {
    id: 'lyrics',
    label: '歌词',
    type: 'textarea',
    required: true,
    defaultValue: '',
    placeholder: '请输入您的歌词内容...',
    apiKey: 'lyrics',
    order: 4,
    visibility: {
      mode: ['custom'],
      subscriptionLevel: ['free', 'standard', 'enterprise'], 
    },
    validation: {
      minLength: 5,
      message: '请输入有效的歌词内容（至少5个字符）',
    },
  },
  {
    id: 'musicStyle',
    label: '音乐风格',
    type: 'select',
    required: true,
    defaultValue: 'pop',
    apiKey: 'musicStyle',
    order: 5,
    options: (subscriptionLevel: SubscriptionLevel): Option[] =>
      AI_MODELS_CONFIG.musicGeneration.musicStyles(subscriptionLevel) as Option[]
  },
  {
    id: 'mood',
    label: '情感氛围',
    type: 'select',
    required: true,
    defaultValue: 'happy',
    apiKey: 'mood',
    order: 6,
    options: AI_MODELS_CONFIG.musicGeneration.musicMoods,
  },
  {
    id: 'vocalType',
    label: '人声类型',
    type: 'select',
    required: true,
    defaultValue: 'random',
    apiKey: 'vocalType',
    order: 7,
    visibility: {
      mode: ['inspiration', 'custom'], // 不在纯音乐模式显示
      subscriptionLevel: ['free', 'standard', 'enterprise'],
    },
    options: AI_MODELS_CONFIG.musicGeneration.humanVoices,
  },

  // 音频设置组
  {
    id: 'duration',
    label: '音乐时长',
    type: 'select',
    required: true,
    defaultValue: '15',
    apiKey: 'duration',
    order: 8,
    options: (subscriptionLevel: SubscriptionLevel): Option[] =>
      AI_MODELS_CONFIG.musicGeneration.musicDurations(subscriptionLevel) as Option[]
  },
  {
    id: 'tempo',
    label: '音乐速度',
    type: 'select',
    required: true,
    defaultValue: 'medium',
    apiKey: 'tempo',
    order: 9,
    options: AI_MODELS_CONFIG.musicGeneration.musicTempos,
  }
];

//导出方法

/**
 * 增强的获取可见参数函数 - 支持动态选项
 */
function getVisibleParameters(
  mode: GenerationMode,//inspiration, custom, instrumental
  subscriptionLevel: SubscriptionLevel,//free, standard, enterprise
): ParameterConfig[] {
  return parameterConfigs
    .filter(param => isParameterVisible(param, mode, subscriptionLevel))
    .map(param => ({
      ...param,
      // 处理动态选项
      options: typeof param.options === 'function' 
        ? param.options(subscriptionLevel) 
        : param.options?.filter(option => 
            !option.allowedSubscriptionLevels || option.allowedSubscriptionLevels.includes(subscriptionLevel)
          )
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * 检查参数是否可见
 */
function isParameterVisible(
  param: ParameterConfig,
  mode: GenerationMode,
  subscriptionLevel: SubscriptionLevel,
): boolean {
  // 检查参数本身的订阅等级限制
  if (param.minimumSubscriptionLevel) {
    const levelOrder = { free: 0, standard: 1, enterprise: 2 };
    if (levelOrder[subscriptionLevel] < levelOrder[param.minimumSubscriptionLevel]) {
      return false;
    }
  }

  // 默认可见
  if (!param.visibility) return true;

const { mode: visibilityMode, subscriptionLevel: visibilityLevel } = param.visibility;

  // 检查模式条件
  if (visibilityMode) {
    const modes = Array.isArray(visibilityMode) ? visibilityMode : [visibilityMode];
    if (!modes.includes(mode)) return false;
  }

  // 检查订阅级别条件
  if (visibilityLevel) {
    const levels = Array.isArray(visibilityLevel) ? visibilityLevel : [visibilityLevel];
    if (!levels.includes(subscriptionLevel)) return false;
  }
  return true;
}

/**
 * 获取指定模式(inspiration, custom, instrumental) 下可用的 模型(Chirp v4.0 等),返回 模型配置对象
 */
function getModelsForMode(mode: GenerationMode, subscriptionLevel: SubscriptionLevel) {
  return AI_MODELS_CONFIG.musicGeneration.models.filter(model => {
    // 检查模型是否支持当前模式
    if (model.allowedModes && !model.allowedModes.includes(mode)) {
      return false;
    }
    
    // 检查订阅等级
    if (subscriptionLevel === "enterprise") return true;//企业用户可见所有模型
    if (subscriptionLevel === "standard") return model.minimumSubscriptionLevel !== "enterprise";//返回三个模型
    return model.minimumSubscriptionLevel === "free";//返回一个模型
  });
}

/**
 * 获取用户可用的模式(inspiration, custom, instrumental)
 */
function getAvailableModes(subscriptionLevel: SubscriptionLevel): GenerationMode[] {
  return modeConfigs
    .filter(mode => 
      !mode.minimumSubscriptionLevel || 
      (mode.minimumSubscriptionLevel === 'free') ||
      (mode.minimumSubscriptionLevel === 'standard' && ['standard', 'enterprise'].includes(subscriptionLevel)) ||
      (mode.minimumSubscriptionLevel === 'enterprise' && subscriptionLevel === 'enterprise')
    )
    .map(mode => mode.id);
}

export {
  getVisibleParameters,//获取用户可用的参数(根据模式和订阅等级)(歌词,描述等)
  getModelsForMode,//获取用户可用的模型(根据模式和订阅等级)(Chirp v4.0 等)
  getAvailableModes//获取用户可用的模式(根据订阅等级)(inspiration, custom, instrumental)
}