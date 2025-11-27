'use client'
import React, { useRef } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingPlan } from '@/app/api/pricing/route';



interface PricingPlanCardProps {
  plan: PricingPlan;
  onSelectPlan: (planId: string) => void;
  selectedPlanId?: string;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}

// 单个订阅计划卡片组件
function PricingPlanCard({ 
  plan, 
  onSelectPlan, 
  selectedPlanId,
  disabled = false,
  isCurrentPlan = false
}: PricingPlanCardProps) {
  const isHighlighted = plan.isHighlighted || false;
  const isSelected = selectedPlanId === plan.id;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 基础样式 - 适应深色主题
  const cardBaseClasses = 'rounded-2xl shadow-md p-8 transition-all duration-300 h-full relative overflow-hidden border-2';
  const cardClasses =isCurrentPlan 
    ? `${cardBaseClasses} ${isCurrentPlan ? 'bg-gradient-to-br from-green-600 to-teal-600' : (plan.cardClassName || 'bg-gradient-to-br from-purple-600 to-blue-600')} border-transparent ${isSelected ? 'ring-4 ring-purple-400/30' : 'hover:shadow-xl hover:scale-105'} ${disabled ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}` 
    : `${cardBaseClasses} bg-white/10 backdrop-blur-md border-transparent ${isSelected ? 'border-purple-500 ring-4 ring-purple-400/30' : 'hover:shadow-lg hover:bg-white/15'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${isCurrentPlan ? 'border-green-500 ring-4 ring-green-400/30' : ''}`;
  
  const featuresBaseClasses = 'rounded-xl p-6 mb-8';
  const featuresClasses = isHighlighted 
    ? `${featuresBaseClasses} bg-white/10 backdrop-blur-sm` 
    : `${featuresBaseClasses} bg-white/5 backdrop-blur-sm border border-white/10`;
  
  // 文字样式 - 适应深色主题
  const featureTextClasses = isHighlighted ? 'text-white' : 'text-white';
  const titleTextClasses = isHighlighted ? 'text-white' : 'text-white';
  const descTextClasses = isHighlighted ? 'text-white/90' : 'text-white/70';
  const featuresTitleClasses = isHighlighted ? 'text-white' : 'text-white';
  
  // 处理按钮点击
  const handleButtonClick = () => {
    if (!disabled) {
      onSelectPlan(plan.id);
    }
  };
  
  return (
    <div 
      ref={cardRef}
      className={cardClasses}
      onClick={handleButtonClick}
    >
      {/* 最受欢迎标签 - 适应深色主题 */}
      {isHighlighted && (
        <div className="absolute -top-4 right-0 transform translate-x-4 rotate-45">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-10 py-1 whitespace-nowrap shadow-lg">
            {plan.popularBadge || '最受欢迎'}
          </span>
        </div>
      )}
      
      {/* 计划标题和价格 */}
      <div className={`mb-6 ${isHighlighted ? 'pt-4' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-2xl font-bold ${titleTextClasses}`}>{plan.name}</h2>
          {isCurrentPlan && (
            <span className="bg-green-500/80 text-white text-xs font-bold px-3 py-1 rounded-full">
              当前订阅
            </span>
          )}
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-4xl font-bold ${titleTextClasses}`}>{plan.price}</span>
          {plan.period && <span className={`${descTextClasses}`}>{plan.period}</span>}
        </div>
        {plan.originalPrice && plan.originalPrice !== plan.price && (
          <div className={`text-sm ${descTextClasses} line-through mb-1`}>
            原价: {plan.originalPrice}
          </div>
        )}
        <p className={`text-sm ${descTextClasses}`}>{plan.description}</p>
      </div>
      {plan.discount && plan.discount > 0 && (
        <div className="absolute top-6 right-6 bg-pink-500/80 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
          -{plan.discount}%
        </div>
      )}
      
      {/* 计划功能列表 */}
      <div className={featuresClasses}>
        <h3 className={`text-lg font-semibold ${featuresTitleClasses} mb-4`}>{plan.featuresTitle}</h3>
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className={`flex items-start ${featureTextClasses} group`}>
              {feature.icon || <Check className={`w-5 h-5 ${feature.color} mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform`} />}
              <span className="text-sm md:text-base">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* 操作按钮 - 适应深色主题 */}
        <Button 
          className={`w-full ${plan.buttonClassName || (isHighlighted ? 'bg-white text-purple-600 hover:bg-white/90' : 'bg-white/10 text-white border border-white/30 hover:bg-white/20')} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-600' : ''}`}
          variant={plan.buttonVariant}
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
          disabled={disabled}
        >
          {isCurrentPlan ? '当前订阅' : disabled ? '已定阅' : plan.buttonText}
          {!disabled && !isCurrentPlan && <ChevronRight className="ml-2 w-4 h-4" />}
        </Button>
    </div>
  );
}

export default PricingPlanCard;