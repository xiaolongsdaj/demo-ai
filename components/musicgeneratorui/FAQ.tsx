import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Music } from 'lucide-react';

interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

interface FAQConfig {
  title: string;
  description: string;
  items: FAQItemData[];
}

interface FAQProps {
  config: FAQConfig;
}

export default function FAQ({ config }: FAQProps) {
  // 在组件内部进行数据转换
  const transformedItems = config.items.map(item => ({
    ...item,
    id: item.id.toString()
  }));
  
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const iconColors = [
    'text-blue-400',
    'text-purple-400',
    'text-pink-400',
    'text-indigo-400',
    'text-teal-400',
    'text-violet-400'
  ];

  const toggleQuestion = (id: string) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <>
      <style jsx>{`
        /* FAQ组件样式 */
        .faq-section {
          margin-bottom: 5rem;
          padding: 1.5rem;
          background-color: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          border: 1px solid rgba(75, 85, 99, 0.5);
          opacity: 1;
          transform: none;
        }
        
        @media (min-width: 768px) {
          .faq-section {
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
          gap: 0.5rem;
        }
        
        .section-subtitle {
          color: #d1d5db;
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
        }
        
        .faq-container {
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .faq-item {
          border: 1px solid rgba(107, 114, 128, 0.5);
          border-radius: 0.5rem;
          overflow: hidden;
          background-color: rgba(17, 24, 39, 1);
        }
        
        .faq-question {
          width: 100%;
          text-align: left;
          padding: 1rem 1.5rem;
          background-color: rgba(31, 41, 55, 0.5);
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s ease;
        }
        
        .faq-question:hover {
          background-color: rgba(31, 41, 55, 0.8);
        }
        
        .question-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .question-text {
          font-weight: 500;
          color: white;
          font-size: 1.125rem;
        }
        
        .arrow-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
          transition: transform 0.3s ease;
        }
        
        .arrow-icon.rotated {
          transform: rotate(180deg);
          color: #d1d5db;
        }
        
        .faq-answer {
          padding: 0 1.5rem;
          background-color: rgba(17, 24, 39, 0.3);
          color: #d1d5db;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          border-top: 1px solid rgba(55, 65, 81, 1);
          opacity: 0;
        }
        
        .faq-answer.open {
          max-height: 24rem;
          padding: 1rem 1.5rem;
          opacity: 1;
        }
      `}</style>
      
      <section className="faq-section">
        <div className="section-header">
          <h2 className="section-title">
            <HelpCircle className="w-8 h-8 text-blue-400" />
            {config.title}
          </h2>
          <p className="section-subtitle">{config.description}</p>
        </div>

        <div className="faq-container">
          {transformedItems.map((item, index) => {
            const iconColor = iconColors[index % iconColors.length];
            return (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(item.id)}
                  style={{ backgroundColor: '#111827', color: 'white', border: 'none', outline: 'none' }}
                >
                  <div className="question-content">
                    <Music className={`w-5 h-5 ${iconColor}`} />
                    <span className="question-text">{item.question}</span>
                  </div>
                  <ChevronDown 
                    className={`arrow-icon ${openQuestion === item.id ? 'rotated' : ''}`} 
                  />
                </button>
                <div className={`faq-answer ${openQuestion === item.id ? 'open' : ''}`}>
                  <div className="pl-8">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}