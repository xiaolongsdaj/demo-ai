'use client'

/**
 * 用户订阅权限管理模块
 * 用于在前端模拟和管理用户的订阅状态与权限
 */

// 定义订阅计划类型
export type SubscriptionPlan = 'free' | 'standard' | 'enterprise';

// 定义订阅权限接口
interface SubscriptionPermissions {
  plan: SubscriptionPlan;
  hasUnlimitedGeneration: boolean;
  hasCustomParameters: boolean;
  hasHighQualityAudio: boolean;
  hasPrioritySupport: boolean;
  hasTeamFeatures: boolean;
  dailyLimit?: number;
}

// 各订阅计划的权限配置
const PLAN_PERMISSIONS: Record<SubscriptionPlan, SubscriptionPermissions> = {
  free: {
    plan: 'free',
    hasUnlimitedGeneration: false,//是否有无限生成
    hasCustomParameters: false,//是否有自定义参数
    hasHighQualityAudio: false,//是否有高质量音频
    hasPrioritySupport: false,//是否有优先支持
    hasTeamFeatures: false,//是否有团队功能
    dailyLimit: 2,//每日生成次数限制
  },
  standard: {
    plan: 'standard',
    hasUnlimitedGeneration: true,//是否有无限生成
    hasCustomParameters: true,//是否有自定义参数
    hasHighQualityAudio: true,//是否有高质量音频
    hasPrioritySupport: true,//是否有优先支持
    hasTeamFeatures: false,//是否有团队功能
  },
  enterprise: {
    plan: 'enterprise',
    hasUnlimitedGeneration: true,//是否有无限生成
    hasCustomParameters: true,//是否有自定义参数
    hasHighQualityAudio: true,//是否有高质量音频
    hasPrioritySupport: true,//是否有优先支持
    hasTeamFeatures: true,//是否有团队功能
  },
};

// localStorage键名
const STORAGE_KEY = 'demo-ai-user-subscription';

// 订阅信息接口
export interface UserSubscription {
  plan: SubscriptionPlan;//订阅计划
  subscriptionId: string;//订阅ID
  nextBillingDate: string;//下一次计费日期
  isActive: boolean;//是否激活
}

/**
 * 订阅权限管理类
 */
class SubscriptionManager {
  /**
   * 获取当前用户的订阅信息
   */
  getSubscription(): UserSubscription | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // 默认返回免费计划
      return {
        plan: 'free',
        subscriptionId: 'sub_free',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      };
    } catch (error) {
      console.error('获取订阅信息失败:', error);
      return null;
    }
  }

  /**
   * 设置用户的订阅信息
   */
  setSubscription(subscription: UserSubscription): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    } catch (error) {
      console.error('保存订阅信息失败:', error);
    }
  }

  /**
   * 获取用户的权限
   */
  // getPermissions(): SubscriptionPermissions {
  //   const subscription = this.getSubscription();
  //   // 如果没有订阅信息或订阅未激活，返回免费计划权限
  //   if (!subscription || !subscription.isActive) {
  //     return PLAN_PERMISSIONS.free;
  //   }
  //   return PLAN_PERMISSIONS[subscription.plan];
  // }

  /**
   * 检查用户是否具有特定权限
   */
  // hasPermission(permission: keyof Omit<SubscriptionPermissions, 'plan'>): boolean {
  //   const permissions = this.getPermissions();
  //   return !!permissions[permission];
  // }

  /**
   * 检查用户是否可以使用某个功能
   * 根据不同功能需要的权限进行检查
   */
  // canUseFeature(feature: 'generate-music' | 'custom-parameters' | 'high-quality' | 'team-collaboration'): boolean {
  //   const permissions = this.getPermissions();
    
  //   switch (feature) {
  //     case 'generate-music'://音乐生成功能
  //       // 所有用户都可以生成音乐，但免费用户有每日限制
  //       return true;
  //     case 'custom-parameters':
  //       return permissions.hasCustomParameters;//是否有自定义参数
  //     case 'high-quality':
  //       return permissions.hasHighQualityAudio;//是否有高质量音频
  //     case 'team-collaboration':
  //       return permissions.hasTeamFeatures;//是否有团队功能
  //     default:
  //       return false;
  //   }
  // }

  /**
   * 更新用户订阅计划（模拟订阅更改）
   */
  updateSubscriptionPlan(plan: SubscriptionPlan): void {
    const subscription: UserSubscription = {
      plan,
      subscriptionId: `sub_${plan}`,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    };
    this.setSubscription(subscription);
  }

  /**
   * 清除订阅信息（登出时使用）
   */
  clearSubscription(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('清除订阅信息失败:', error);
    }
  }

  /**
   * 获取用户订阅状态的显示信息
   */
  getSubscriptionDisplayInfo(): { planName: string; planKey: string } {
    const subscription = this.getSubscription();
    const planKey = subscription?.plan || 'free';

    const planNames: Record<SubscriptionPlan, string> = {
      free: '免费版',
      standard: '标准版',
      enterprise: '企业版',
    };
    return {
      planName: planNames[planKey],
      planKey,
    };
  }
}

// 导出单例实例
export const subscriptionManager = new SubscriptionManager();

/**
 * 权限检查Hook，用于在组件中检查用户权限
 */
export function useSubscriptionPermissions() {
  const subscription = subscriptionManager.getSubscription();//获取用户订阅信息 plan: 'free',subscriptionId,nextBillingDate,isActive
  // const permissions = subscriptionManager.getPermissions();//获取用户权限free,standard,enterprise
  
  return {
    subscription,//如何使用：在组件中调用获取用户订阅计划
   // permissions,
    //hasPermission: subscriptionManager.hasPermission.bind(subscriptionManager),//bind绑定subscriptionManager实例，确保在组件中调用时this指向subscriptionManager
    //canUseFeature: subscriptionManager.canUseFeature.bind(subscriptionManager),
    updateSubscriptionPlan: subscriptionManager.updateSubscriptionPlan.bind(subscriptionManager),
    getSubscriptionDisplayInfo: subscriptionManager.getSubscriptionDisplayInfo.bind(subscriptionManager),
  };
}