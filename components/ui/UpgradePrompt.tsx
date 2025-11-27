import React from 'react';

interface UpgradePromptProps {
  isVisible: boolean;
  onClose: () => void;
  onViewPricing: () => void;
}

/**
 * 升级订阅提示弹窗组件
 * 当用户尝试使用高级功能但订阅等级不足时显示
 */
const UpgradePrompt: React.FC<UpgradePromptProps> = ({ isVisible, onClose, onViewPricing }) => {
  // 只有当isVisible为true时才渲染
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700/50 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-3">需要升级订阅</h3>
        <p className="text-gray-300 mb-5">
          您正在尝试使用高级功能，这需要升级到标准版或企业版订阅。
        </p>
        <div className="space-y-3">
          <button
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-bold transition-colors"
            onClick={onViewPricing}
          >
            查看订阅计划
          </button>
          <button
            className="w-full py-3 px-6 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-white font-medium transition-all"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
