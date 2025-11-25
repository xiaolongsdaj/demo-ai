// 音乐生成模型配置
export const AI_MODELS_CONFIG = {
    // 音乐生成模型
    musicGeneration: {
        category: "音乐生成",
        models: [
            {
                id: "Chirp v4.0",
                name: "Chirp v4.0",
                description: "擅长生成流行音乐旋律，适合短视频和社交媒体使用",
                minimumSubscriptionLevel: "free"
            },
            {
                id: "Chirp v4.5", 
                name: "Chirp v4.5",
                description: "专业古典和交响乐生成，适合电影配乐和商业项目",
                minimumSubscriptionLevel: "standard"
            },
            {
                id: "Chirp v5.0",
                name: "Chirp v5.0",
                description: "专业爵士音乐生成，风格纯正，即兴性强",
                minimumSubscriptionLevel: "standard"
            },
            {
                id: "Chirp v5.5",
                name: "Chirp v5.5",
                description: "生成地道的乡村和民谣风格音乐，温暖质朴",
                minimumSubscriptionLevel: "enterprise"
            }
        ],
        // 音乐风格选项
        musicStyles: [
            { value: "pop", label: "流行" },
            { value: "classical", label: "古典" },
            { value: "jazz", label: "爵士" },
            { value: "rock", label: "摇滚" },
            { value: "electronic", label: "电子" },
            { value: "country", label: "乡村" },
            { value: "folk", label: "民谣" },
        ],
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
        // 音乐时长选项（秒）
        musicDurations: [
            { value: "15", label: "15秒", free: true },
            { value: "30", label: "30秒", free: true },
            { value: "60", label: "60秒", free: false },
            { value: "120", label: "120秒", free: false },
            { value: "180", label: "180秒", free: false }
        ],
        // 人声音选项
        humanVoices: [
            { value: "random", label: "随机" },
            { value: "male", label: "男声" },
            { value: "female", label: "女声" },
        ],
    }
};

// 根据订阅级别获取可用的模型
export const getModelsBySubscriptionLevel = (subscriptionLevel: string) => {
    const models = AI_MODELS_CONFIG.musicGeneration.models;
    return models.filter(model => {
        const modelLevel = model.minimumSubscriptionLevel;
        if (subscriptionLevel === "premium") return true;
        if (subscriptionLevel === "standard") return modelLevel !== "premium";
        return modelLevel === "free";
    });
};

// 根据ID获取特定模型
export const getModelById = (modelId: string) => {
    const models = AI_MODELS_CONFIG.musicGeneration.models;
    return models.find(model => model.id === modelId);
};

// 获取所有音乐风格选项
export const getMusicStyles = () => {
    return AI_MODELS_CONFIG.musicGeneration.musicStyles;
};

// 获取所有音乐情绪选项
export const getMusicMoods = () => {
    return AI_MODELS_CONFIG.musicGeneration.musicMoods;
};

// 根据订阅级别获取可用的时长选项
export const getAvailableDurations = (subscriptionLevel: string) => {
    const durations = AI_MODELS_CONFIG.musicGeneration.musicDurations;
    if (subscriptionLevel === "premium" || subscriptionLevel === "standard") {
        return durations;
    }
    return durations.filter(duration => duration.free);
};

// 获取所有人声类型选项
export const getHumanVoices = () => {
    return AI_MODELS_CONFIG.musicGeneration.humanVoices;
};