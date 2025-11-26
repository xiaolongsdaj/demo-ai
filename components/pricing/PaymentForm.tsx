'use client'
import React, { useState } from 'react';
import { X, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingPlan } from '@/app/api/pricing/route';

interface PaymentFormProps {
  selectedPlan: PricingPlan;
  onSubmit: () => void;
  onBack: () => void;
  isProcessing?: boolean;
}

// 支付表单组件
function PaymentForm({ 
  selectedPlan, 
  onSubmit, 
  onBack,
  isProcessing = false 
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  
  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!cardNumber.trim()) {
      newErrors.cardNumber = '请输入卡号';
    } else if (!/^\d{13,16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = '请输入有效的卡号';
    }
    
    if (!cardName.trim()) {
      newErrors.cardName = '请输入持卡人姓名';
    }
    
    if (!expiryDate.trim()) {
      newErrors.expiryDate = '请输入到期日';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      newErrors.expiryDate = '请输入有效的到期日 (MM/YY)';
    }
    
    if (!cvv.trim()) {
      newErrors.cvv = '请输入安全码';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = '请输入有效的安全码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 格式化卡号
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // 格式化到期日
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{2,4}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    if (match.length >= 2) {
      parts.push(match.substring(0, 2));
      if (match.length > 2) {
        parts.push(match.substring(2, 4));
      }
    }
    
    if (parts.length) {
      return parts.join('/');
    } else {
      return value;
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isProcessing) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit();
    } catch (error) {
      setErrors({ general: '支付处理失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理输入变化
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: '' });
    }
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-2xl mx-auto relative overflow-hidden border border-white/20">
      {/* 背景装饰 - 与页面风格一致 */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">支付信息</h2>
        </div>
        
        {/* 订阅计划摘要 - 适应深色主题 */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-1">{selectedPlan.name}</h3>
          <div className="text-lg font-bold text-blue-300">{selectedPlan.price} {selectedPlan.period}</div>
        </div>
        
        {errors.general && (
          <div className="bg-pink-500/20 border border-pink-500/30 text-pink-200 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-white/80 mb-1">
              卡号
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-3 border bg-white/10 backdrop-blur-sm rounded-lg transition-all text-white placeholder-white/50 ${errors.cardNumber ? 'border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'}`}
              />
              {cardNumber.length > 4 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-pink-300 flex items-center gap-1">
                <span className="text-xs">!</span>
                {errors.cardNumber}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-white/80 mb-1">
              持卡人姓名
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                if (errors.cardName) {
                  setErrors({ ...errors, cardName: '' });
                }
              }}
              placeholder="输入持卡人姓名"
                className={`w-full px-4 py-3 border bg-white/10 backdrop-blur-sm rounded-lg transition-all text-white placeholder-white/50 ${errors.cardName ? 'border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'}`}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-pink-300 flex items-center gap-1">
                <span className="text-xs">!</span>
                {errors.cardName}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-white/80 mb-1">
              到期日
            </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                className={`w-full px-4 py-3 border bg-white/10 backdrop-blur-sm rounded-lg transition-all text-white placeholder-white/50 ${errors.expiryDate ? 'border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'}`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-pink-300 flex items-center gap-1">
                  <span className="text-xs">!</span>
                  {errors.expiryDate}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-white/80 mb-1">
              CVV
            </label>
              <div className="relative">
                <input
                  type={showCvv ? "text" : "password"}
                  id="cvv"
                  value={cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setCvv(value);
                    if (errors.cvv) {
                      setErrors({ ...errors, cvv: '' });
                    }
                  }}
                  placeholder="123"
                className={`w-full px-4 py-3 border bg-white/10 backdrop-blur-sm rounded-lg transition-all text-white placeholder-white/50 ${errors.cvv ? 'border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' : 'border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'}`}
                  maxLength={4}
                />
                <button 
                  type="button"
                  onClick={() => setShowCvv(!showCvv)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showCvv ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              {errors.cvv && (
                <p className="mt-1 text-sm text-pink-300 flex items-center gap-1">
                  <span className="text-xs">!</span>
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>
          
          {/* 安全保证图标 - 适应深色主题 */}
        <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-white/80" />
            <span>安全加密</span>
          </div>
          <div className="h-4 w-px bg-white/20"></div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-white/80" />
            <span>随时取消</span>
          </div>
        </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <Button 
              type="submit" 
              variant="default"
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading || isProcessing}
            >
              {(isLoading || isProcessing) ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                  处理中...
                </span>
              ) : '确认支付'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
            className="w-full py-6 text-base border-white/30 text-white bg-black hover:bg-white/10"
              onClick={onBack}
              disabled={isProcessing}
            >
              返回选择套餐
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;