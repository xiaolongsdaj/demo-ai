import React, { useEffect, useState } from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import { Button } from './button';

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

interface ErrorNotificationProps {
  error: string | null | undefined;
  type?: NotificationType;
  autoHide?: boolean;
  autoHideDuration?: number; // 毫秒
  onClose?: () => void;
  onRetry?: () => void;
  showCloseButton?: boolean;
  showRetryButton?: boolean;
  retryText?: string;
  title?: string;
  className?: string;
}

/**
 * 通用错误通知组件
 * 支持多种类型（错误、警告、信息、成功），自动消失，重试按钮等功能
 */
const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  type = 'error',
  autoHide = true,
  autoHideDuration = 5000,
  onClose,
  onRetry,
  showCloseButton = true,
  showRetryButton = false,
  retryText = '重试',
  title,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  // 根据类型获取颜色和图标
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-900/30 border-green-700/30',
          text: 'text-green-300',
          icon: <AlertCircle className="text-green-400" />,
          defaultTitle: '成功',
        };
      case 'warning':
        return {
          container: 'bg-amber-900/30 border-amber-700/30',
          text: 'text-amber-300',
          icon: <AlertCircle className="text-amber-400" />,
          defaultTitle: '警告',
        };
      case 'info':
        return {
          container: 'bg-blue-900/30 border-blue-700/30',
          text: 'text-blue-300',
          icon: <AlertCircle className="text-blue-400" />,
          defaultTitle: '信息',
        };
      case 'error':
      default:
        return {
          container: 'bg-red-900/30 border-red-700/30',
          text: 'text-red-300',
          icon: <AlertCircle className="text-red-400" />,
          defaultTitle: '错误',
        };
    }
  };

  const styles = getTypeStyles();
  const displayTitle = title || (type !== 'info' ? styles.defaultTitle : undefined);

  // 自动隐藏功能
  useEffect(() => {
    if (error && visible && autoHide && onClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [error, visible, autoHide, autoHideDuration, onClose]);

  // 只有当error存在且visible为true时才渲染
  if (!error || !visible) return null;

  return (
    <div 
      className={`max-w-md mx-auto mt-4 p-4 ${styles.container} border rounded-lg shadow-lg ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className="mt-1">
          {styles.icon}
        </div>
        
        {/* 内容区域 */}
        <div className="flex-1">
          {displayTitle && (
            <h3 className={`font-bold mb-1 text-white ${styles.text}`}>
              {displayTitle}
            </h3>
          )}
          <p className={`${styles.text} mb-3`}>
            {error}
          </p>
          
          {/* 按钮区域 */}
          {(showRetryButton && onRetry) && (
            <div className="flex justify-end gap-2">
              <Button
                className={`${styles.container} hover:opacity-90 border ${styles.text}`}
                onClick={onRetry}
                variant="default"
                size="sm"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                {retryText}
              </Button>
              {showCloseButton && onClose && (
                <Button
                  className={`bg-transparent hover:bg-white/10 border-none ${styles.text}`}
                  onClick={() => {
                    setVisible(false);
                    onClose();
                  }}
                  variant="default"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          
          {/* 只显示关闭按钮 */}
          {!showRetryButton && showCloseButton && onClose && (
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => {
                setVisible(false);
                onClose();
              }}
              aria-label="关闭通知"
            >
              <X className={`h-4 w-4 ${styles.text}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
