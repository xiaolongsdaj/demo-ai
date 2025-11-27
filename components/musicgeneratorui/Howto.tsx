import { Music } from 'lucide-react';

interface StepData {
  id: number,
  icon: string,
  title: string;
  description: string;
}

interface HowtoProps {
  config: {
    title: string;
    description: string;
    steps: StepData[];
  };
}

export default function Howto({ config }: HowtoProps) {
  // 使用固定样式
  const transformedSteps = config.steps.map(step => ({
    ...step,
    gradientBg: 'from-indigo-600/20 to-purple-600/20',
    hoverBorderColor: 'border-indigo-400',
    shadowColor: 'indigo-400'
  }));

  return (
    <>
      <style jsx>{`
        /* Howto组件样式 */
        .howto-section {
          margin-bottom: 4rem;
          background-color: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(75, 85, 99, 0.5);
          opacity: 1;
          transform: none;
        }
        
        @media (min-width: 768px) {
          .howto-section {
            padding: 2.5rem;
          }
        }
        
        .section-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }
        
        .section-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        
        .section-description {
          color: #d1d5db;
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
          font-size: 1.125rem;
        }
        
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .step-card {
          position: relative;
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid rgba(107, 114, 128, 0.5);
          transition: all 0.3s ease;
          transform: translateY(0);
        }
        
        .step-card:hover {
          transform: translateY(-0.25rem);
        }
        
        .step-number {
          position: absolute;
          top: -1rem;
          left: -1rem;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.125rem;
        }
        
        .step-content {
          padding-top: 1rem;
        }
        
        .step-title {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
        
        .step-description {
          color: #d1d5db;
        }
      `}</style>
      
      <section className="howto-section">
        <div className="section-header">
          <h2 className="section-title">
            <Music className="w-6 h-6 text-pink-400" />
            {config.title}
          </h2>
          <p className="section-description">{config.description}</p>
        </div>
        
        <div className="steps-grid">
          {transformedSteps.map((step, index) => (
            <div 
              key={index} 
              className="step-card"
              style={{ 
                background: `linear-gradient(135deg, ${step.gradientBg}10, rgba(15, 23, 42, 0.8))`,
                borderColor: step.hoverBorderColor,
                boxShadow: `0 10px 15px -3px ${step.shadowColor}20`
              }}
            >
              <div className="step-number">
                {index + 1}
              </div>
              <div className="step-content">
                <h4 className="step-title" style={{ color: '#a5b4fc' }}>{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}