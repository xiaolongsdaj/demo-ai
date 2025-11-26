'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingPlan } from '@/app/api/pricing/route';

interface SubscriptionInfo {
  subscriptionId: string;
  nextBillingDate: string;
  planName?: string;
}

interface SuccessPageProps {
  selectedPlan: PricingPlan;
  onBackToDashboard?: () => void;
  subscriptionInfo?: SubscriptionInfo;
}

// 成功页面组件
function SuccessPage({ 
  selectedPlan, 
  onBackToDashboard, 
  subscriptionInfo 
}: SuccessPageProps) {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // 倒计时5秒后自动跳转到首页
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 - 与页面风格一致 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-2xl mx-auto text-center border border-white/20 relative z-10">
        <div className="relative z-10">
          {/* 成功图标 - 适应深色主题 */}
          <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 border border-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">订阅成功!</h2>
          <p className="text-xl text-white/70 mb-8">您已成功订阅 {subscriptionInfo?.planName || selectedPlan.name}</p>
          
          {/* 订阅详情卡片 - 适应深色主题 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <h3 className="font-semibold text-white mb-4">订阅详情</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-white/70">套餐</span>
                <span className="font-medium text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">价格</span>
                <span className="font-medium text-white">{selectedPlan.price}</span>
              </div>
              {selectedPlan.period && (
                <div className="flex justify-between">
                  <span className="text-white/70">周期</span>
                  <span className="font-medium text-white">{selectedPlan.period}</span>
                </div>
              )}
              
              {/* 订阅ID和下次续费日期显示 */}
              {subscriptionInfo && (
                <>
                  <div className="border-t border-white/20 pt-3 mt-1"></div>
                  <div className="flex justify-between">
                    <span className="text-white/70">订阅ID</span>
                    <span className="font-medium text-white/80 truncate max-w-[60%]">{subscriptionInfo.subscriptionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">下次续费</span>
                    <span className="font-medium text-white">
                      {new Date(subscriptionInfo.nextBillingDate).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* 欢迎礼包提示 - 适应深色主题 */}
          <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-purple-500/20">
            <div className="flex items-start gap-3 justify-center">
              <svg className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <h4 className="font-medium text-white mb-1">欢迎礼包</h4>
                <p className="text-sm text-white/70">查看您的邮箱获取专属欢迎礼包和使用指南</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="default"
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={onBackToDashboard || (() => window.location.href = '/')}
            >
              <Zap className="mr-2 h-4 w-4" />
              前往控制台开始使用 (自动跳转 {countdown}s)
            </Button>
            
            <Button 
              variant="outline"
              className="w-full py-6 text-base border-white/30 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/'}
            >
              了解功能详情
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;