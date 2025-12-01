'use client'
import { useState, useEffect } from 'react';
import Loading from '@/components/ui/Loading';
import ErrorNotification from '@/components/ui/ErrorNotification';
import { fetchFromAPI } from '@/lib/api-client';
import { useAuth } from '@/lib/auth'; // 添加认证支持

import PricingPlanCard from '@/components/pricing/PricingPlanCard';
import PaymentForm from '@/components/pricing/PaymentForm';
import ConfirmationPage from '@/components/pricing/ConfirmationPage';
import SuccessPage from '@/components/pricing/SuccessPage';

import { PricingPlan } from '@/app/api/pricing/route';// 引入定价计划接口定义
import ParticleBackground from '@/components/shared/ParticleBackground';// 引入粒子背景组件
import { subscriptionManager, useSubscriptionPermissions } from '@/lib/subscription-permissions'; // 引入订阅权限管理
interface ApiResponse {
  message: string;
  success: boolean;
  plans?: PricingPlan[];
  plan?: PricingPlan;
  error?: string;
  timestamp?: string;
}

// 订阅流程状态
type SubscriptionStep = 'planSelection' | 'paymentDetails' | 'confirmation' | 'success';
// 订阅等级枚举，用于比较
const PLAN_RANKING: Record<string, number> = {
  free: 1,
  standard: 2,
  enterprise: 3
};

// 主页面组件
 function PricingPage() {
  // 认证支持
  const { getToken } = useAuth();
  // 获取用户订阅信息
  const { subscription, getSubscriptionDisplayInfo } = useSubscriptionPermissions();
  const currentPlan = subscription?.plan || 'free';
  const { planName: currentPlanName } = getSubscriptionDisplayInfo();
  
  // 状态管理
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>('planSelection');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [submitting, setSubmitting] = useState(false);
  const [showDowngradeWarning, setShowDowngradeWarning] = useState(false);
  
  // 订阅信息状态保持不变
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    subscriptionId: string;
    nextBillingDate: string;
    planName: string;
  } | null>(null);
  
  // 获取订阅计划的函数 - 定义在组件顶部以便在整个组件中访问
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFromAPI<ApiResponse>('/api/pricing', {}, getToken, 'GET', 1500);
      
      if (result.success && result.data && result.data.plans) {
        setPlans(result.data.plans);
      } else {
        const errorMsg = result.error || '获取订阅计划失败，请稍后再试';
        setError(errorMsg);
        console.error('获取订阅计划失败:', errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误，请检查您的连接';
      setError(errorMessage);
      console.error('获取订阅计划时发生异常:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);
  
  // 检查是否允许选择计划（防止降级）
  const canSelectPlan = (planId: string): boolean => {
    const currentRank = PLAN_RANKING[currentPlan];
    const targetRank = PLAN_RANKING[planId];
    return targetRank > currentRank;
  };
  
  // 处理计划选择 - 调用API获取计划详情
  const handleSelectPlan = async (planId: string) => {
    try {
      // 检查是否尝试降级
      if (!canSelectPlan(planId)) {
        setShowDowngradeWarning(true);
        return;
      }
      
      setShowDowngradeWarning(false);
      setSelectedPlanId(planId);
      setLoading(true);
      const response = await fetchFromAPI<ApiResponse>('/api/pricing', { planId }, getToken, 'POST');
      
      if (response.success && response.data && response.data.plan) {
        setSelectedPlan(response.data.plan);
        setCurrentStep('paymentDetails');
      } else {
        setError(response.error || '获取计划详情失败');
      }
    } catch (err) {
      console.error('Error fetching plan details:', err);
      setError('获取计划详情失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 返回计划选择页面
  const handleBackToPlans = () => {
    setCurrentStep('planSelection');
  };
  
  // 返回支付详情页面
  const handleBackToPayment = () => {
    setCurrentStep('paymentDetails');
  };
  
  const handlePaymentSubmit = async () => {
    try {
      if (!selectedPlanId) return;
      const userInfo=localStorage.getItem('demo-ai-user-info');
      const response = await fetchFromAPI('/api/pricing', 
        { 
          planId: selectedPlanId, 
          paymentInfo: { email: userInfo ? JSON.parse(userInfo).email : '' },
          
        }, 
        getToken, 
        'PUT'
      );
      if (response.success && response.data) {
        // 设置订阅信息
        const subscriptionInfo = {
          subscriptionId: response.data.subscriptionId,
          planName: response.data.planName,
          nextBillingDate: response.data.nextBillingDate,
        };
        setSubscriptionInfo(subscriptionInfo);
        setCurrentStep('confirmation');
      } else {
        setError(response.error || '支付处理失败');
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      setError('支付处理失败，请稍后再试');
    }
  };
  
  // 处理确认订阅
  const handleConfirmSubscription = async () => {
    setSubmitting(true);
    try {
      if (selectedPlan) {
        subscriptionManager.updateSubscriptionPlan(selectedPlan.id as 'free' | 'standard' | 'enterprise');
        console.log('用户订阅已更新为:', selectedPlan.id);
      }
      // 进入成功页面
      setCurrentStep('success');
    } catch (err) {
      console.error('Subscription confirmation error:', err);
      setError('确认订阅失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 opacity-90"></div>
      <ParticleBackground 
        className="z-0" 
        particleSizeRange={[1, 5]} // 粒子大小范围
        connectionDistance={80}// 粒子连接距离
        connectionOpacity={0.2}// 粒子连接透明度
        mouseRepelDistance={120}// 鼠标排斥距离
      />
      
      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">简单透明的定价</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            选择最适合您和团队需求的计划，无需长期承诺，随时可取消
          </p>
        </div>
        
        {loading && (
          <Loading 
            size="large" 
            color="text-blue-400" 
            message="加载订阅计划中..."
            fullHeight={true}
            className="h-96"
          />
        )}
        
        {error && !loading && (
          <ErrorNotification 
            error={error}
          />
        )}
        
        {!loading && !error && (
          <>
            {currentStep === 'planSelection' && (
              <div className="max-w-6xl mx-auto">
                {/* 当前订阅信息显示 */}
                <div className="mb-8 text-center">
                  <p className="text-white/90 font-medium">
                    当前订阅：<span className="text-blue-300 font-bold">{currentPlanName}</span>
                  </p>
                  
                  {/* 降级警告提示 */}
                  {showDowngradeWarning && (
                    <div className="mt-4 p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg text-amber-300 max-w-2xl mx-auto">
                      <p className="font-medium">不支持直接降级</p>
                      <p className="text-sm mt-1">如需降级订阅，请联系客户支持。您当前只能选择升级或保持现有计划。</p>
                    </div>
                  )}
                  
                  {/* 降级限制说明 - 常驻显示 */}
                  {(currentPlan === 'enterprise' || currentPlan === 'standard') && (
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg text-blue-300 max-w-2xl mx-auto text-sm">
                      <p>为保护您的数据和服务连续性，系统不支持直接降级。如需调整订阅计划，请联系我们的客户支持团队。</p>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {plans.map((plan) => {
                    const isPlanAllowed = canSelectPlan(plan.id);
                    return (
                      <PricingPlanCard
                        key={plan.id}
                        plan={{
                          ...plan,
                          cardClassName: plan.isHighlighted ? 'bg-gradient-to-br from-purple-600 to-blue-600' : ''
                        }}
                        onSelectPlan={handleSelectPlan}
                        selectedPlanId={selectedPlanId}
                        disabled={!isPlanAllowed}
                        isCurrentPlan={plan.id === currentPlan}
                      />
                    );
                  })}
                </div>
                
              </div>
            )}
            
            {currentStep === 'paymentDetails' && selectedPlan && (
              <PaymentForm 
                selectedPlan={selectedPlan} 
                onSubmit={handlePaymentSubmit} 
                onBack={handleBackToPlans}
              />
            )}
            
            {currentStep === 'confirmation' && selectedPlan && (
              <ConfirmationPage 
                selectedPlan={selectedPlan} 
                onConfirm={handleConfirmSubscription} 
                onBack={handleBackToPayment}
                isProcessing={submitting}
                subscriptionInfo={subscriptionInfo}
              />
            )}
            
            {currentStep === 'success' && selectedPlan && (
              <SuccessPage 
                selectedPlan={selectedPlan} 
                subscriptionInfo={subscriptionInfo || undefined}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PricingPage;