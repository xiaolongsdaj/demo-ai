import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  fullHeight?: boolean;
  className?: string;
}

/**
 * 通用加载组件
 * 用于显示加载状态，可以自定义大小、颜色、消息和高度
 */
const Loading: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-blue-400',
  message,
  fullHeight = false,
  className = '',
}) => {
  // 根据size确定加载图标的大小
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-16 h-16';
      case 'medium':
      default:
        return 'w-12 h-12';
    }
  };

  // 根据size确定消息的字体大小
  const getMessageSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  // 基础容器类
  const baseContainerClass = 'flex flex-col items-center justify-center';
  // 高度类
  const heightClass = fullHeight ? 'h-full min-h-[200px]' : 'py-6';

  return (
    <div className={`${baseContainerClass} ${heightClass} ${className}`}>
      <div className={`${getSpinnerSize()} ${color} animate-spin mb-4`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-full h-full"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {message && (
        <p className={`${getMessageSize()} text-white text-center`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;