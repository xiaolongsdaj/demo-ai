'use client'
import React from 'react';
import { X, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingPlan } from '@/app/api/pricing/route';

interface SubscriptionInfo {
  subscriptionId: string;
  planName: string;
  nextBillingDate: string;
}

interface ConfirmationPageProps {
  selectedPlan: PricingPlan;
  onConfirm: () => void;
  onBack: () => void;
  isProcessing?: boolean;
  subscriptionInfo?: SubscriptionInfo | null;
}

// 确认页面组件
function ConfirmationPage({ 
  selectedPlan, 
  onConfirm, 
  onBack,
  isProcessing = false,
  subscriptionInfo
}: ConfirmationPageProps) {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[80vh] flex items-center justify-center">
      {/* 背景装饰 - 深色主题 */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 w-full relative z-10">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={onBack} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white">确认订阅</h2>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">订阅信息</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">套餐</span>
                <span className="font-medium text-white bg-white/20 px-3 py-1 rounded-full">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">价格</span>
                <div className="text-right">
                  <span className="font-medium text-white">{selectedPlan.price}</span>
                  {selectedPlan.originalPrice && selectedPlan.originalPrice !== selectedPlan.price && (
                    <div className="text-xs text-white/50 line-through">
                      原价: {selectedPlan.originalPrice}
                    </div>
                  )}
                </div>
              </div>
              {selectedPlan.discount && selectedPlan.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">折扣</span>
                  <span className="font-medium text-green-300">-{selectedPlan.discount}%</span>
                </div>
              )}
              {subscriptionInfo && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">订单编号</span>
                  <span className="font-medium text-xs text-white/80 truncate max-w-[60%]">{subscriptionInfo.subscriptionId}</span>
                </div>
              )}
              {selectedPlan.period && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">周期</span>
                  <span className="font-medium text-white">{selectedPlan.period}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">总计</span>
                  <span className="font-bold text-lg text-blue-300">{selectedPlan.price} {selectedPlan.period}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 安全提示 */}
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-1">安全订阅保障</h4>
                <p className="text-sm text-blue-200">您的支付信息已加密保护。订阅成功后可随时在账户设置中取消。</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="default"
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  确认订阅
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full py-6 text-base border-white/30 text-white bg-black hover:bg-white/10"
              onClick={onBack}
              disabled={isProcessing}
            >
              返回修改支付信息
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;