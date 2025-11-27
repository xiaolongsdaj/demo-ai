'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import UserInfoCard from '@/components/forms/UserInfoCard';

// 定义用户信息接口
export interface UserInfo {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  image?: string;
  createdAt?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

export default function AccountPage() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 从Clerk获取用户信息并构建UserInfo对象
  useEffect(() => {
    if (!user) return;

    const mergedInfo: UserInfo = {
      id: user.id,
      name: user.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : undefined,
      username: user.username || undefined,
      email: user.emailAddresses?.[0]?.emailAddress || undefined,
      image: user.imageUrl || undefined,
      createdAt: user.createdAt?.toString() || undefined,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'zh-CN'
      }
    };

    setUserInfo(mergedInfo);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <UserInfoCard userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}