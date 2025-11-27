import React from 'react';

interface ErrorNotificationProps {
  error: string | null;
}

/**
 * 错误提示组件
 * 用于显示错误信息，支持自动消失
 */
const ErrorNotification: React.FC<ErrorNotificationProps> = ({ error }) => {
  // 只有当error不为null时才渲染
  if (!error) return null;

  return (
    <div className="mt-4 p-3 bg-red-900/30 border border-red-700/30 rounded-lg text-red-300">
      {error}
    </div>
  );
};

export default ErrorNotification;
