'use client'

import { useState, useEffect } from 'react';
import { UserInfo } from '@/app/(root)/musicGenerator/account/page';
import { subscriptionManager, SubscriptionPlan, UserSubscription } from '@/lib/subscription-permissions';
import { useRouter } from 'next/navigation';

interface UserInfoCardProps {
  userInfo: UserInfo | null;
}

// 本地存储键名
const USER_SUBSCRIPTION_KEY = 'demo-ai-user-subscription';

const UserInfoCard: React.FC<UserInfoCardProps> = ({ userInfo }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const router = useRouter();

  // 从本地存储获取订阅信息
  const getSubscriptionInfo = (): UserSubscription | null => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(USER_SUBSCRIPTION_KEY);
        return stored ? JSON.parse(stored) : {
          plan: 'free',
          subscriptionId: 'demo-subscription-' + Date.now(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        };
      }
      // 服务器端返回默认值
      return {
        plan: 'free',
        subscriptionId: 'default-server-subscription',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      };
    } catch (error) {
      console.error('获取订阅信息失败:', error);
      return null;
    }
  };

  // 组件加载时获取订阅信息
  useEffect(() => {
    const subscriptionInfo = getSubscriptionInfo();
    setSubscription(subscriptionInfo);
  }, []);

  if (!userInfo || !subscription) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-white/20">
        <p className="text-white text-center">加载中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-white/20">
       <h1 className="text-3xl font-bold mb-8 text-center">账户设置</h1>
      
      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        {/* 用户头像 */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/30">
          {userInfo.image ? (
            <img 
              src={userInfo.image} 
              alt={`${userInfo.name || '用户'}的头像`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
          )}
        </div>
        
        {/* 用户基本信息 */}
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-bold text-white mb-1">{userInfo.name || '未设置名称'}</h3>
          <p className="text-gray-300 mb-2">@{userInfo.username || '未设置用户名'}</p>
          {userInfo.email && (
            <p className="text-gray-400">{userInfo.email}</p>
          )}
        </div>
      </div>
      
      {/* 用户详细信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">账户创建时间</p>
          <p className="text-white">
            {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '未知'}
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">用户ID</p>
          <p className="text-white break-all">{userInfo.id || '未知'}</p>
        </div>
      </div>
      
      {/* 订阅信息 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">订阅状态</h3>
        
        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-300">当前计划</p>
            <p className="font-medium text-white capitalize">{subscription.plan}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
              <p className="text-gray-300">状态</p>
              <p className={`font-medium ${subscription.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {subscription.isActive ? '活跃' : '已过期'}
              </p>
            </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-300">下次账单日期</p>
            <p className="text-white">
              {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        
        {/* 切换订阅计划 */}
        <div className="mt-4">
          <p className="text-gray-300 mb-3">切换订阅计划：</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${subscription.plan === 'free' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => router.push('/musicGenerator/pricing')}
            >
              免费版
            </button>
            <button
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${subscription.plan === 'standard' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => router.push('/musicGenerator/pricing')}
            >
              标准版
            </button>
            <button
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${subscription.plan === 'enterprise' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => router.push('/musicGenerator/pricing')}
            >
              企业版
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserInfoCard;