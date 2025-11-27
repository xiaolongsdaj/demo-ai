import React from 'react';

interface ButtonData {
  text: string;
}

interface TitleData {
  text: string;
}

interface CTAProps {
  config: {
    title: string | TitleData;
    description?: string;
    buttons: ButtonData[];
  };
}

const CTA: React.FC<CTAProps> = ({ config }) => {
  // 统一处理title格式
  const titleText = typeof config.title === 'object' ? config.title.text : config.title;
  const titleGradient = 'bg-gradient-to-r from-indigo-400 to-purple-400';
  
  const transformedButtons = config.buttons.map((button, index) => ({
    text: button.text,
    className: index === 0 
      ? 'px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg'
      : 'px-6 py-3 rounded-lg font-medium text-indigo-400 bg-transparent border border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-300'
  }));

  return (
    <>
      <style jsx>{`
        /* CTA组件样式 */
        .cta-section {
          margin-bottom: 4rem;
          background-color: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(4px);
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid rgba(55, 65, 81, 0.5);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        /* 装饰元素 */
        .decoration-1 {
          position: absolute;
          top: -8rem;
          left: -8rem;
          width: 16rem;
          height: 16rem;
          background-color: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          filter: blur(80px);
        }
        
        .decoration-2 {
          position: absolute;
          bottom: -8rem;
          right: -8rem;
          width: 16rem;
          height: 16rem;
          background-color: rgba(147, 51, 234, 0.1);
          border-radius: 50%;
          filter: blur(80px);
        }
        
        .cta-content {
          text-align: center;
          position: relative;
          z-index: 10;
          max-width: 4xl;
          margin: 0 auto;
        }
        
        .cta-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        
        @media (min-width: 768px) {
          .cta-title {
            font-size: 2.25rem;
          }
        }
        
        .cta-description {
          margin-bottom: 2rem;
          color: #d1d5db;
          max-width: 2xl;
          margin-left: auto;
          margin-right: auto;
          font-size: 1.125rem;
          line-height: 1.6;
        }
        
        .buttons-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .buttons-container {
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
          }
        }
        
        .cta-button {
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
      
      <section className="cta-section">
        {/* 装饰元素 */}
        <div className="decoration-1"></div>
        <div className="decoration-2"></div>
        
        <div className="cta-content">
          <h3 className={`cta-title ${titleGradient}`}>
            {titleText}
          </h3>
          
          {config.description && (
            <p className="cta-description">
              {config.description}
            </p>
          )}
          
          <div className="buttons-container">
            {transformedButtons.map((button, index) => (
              <button
                key={index}
                className={`cta-button ${button.className}`}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;