import { Music } from 'lucide-react';

interface HeaderProps {
  config: {
    title: string;
    description: string;
  };
}

export default function Header({ config }: HeaderProps) {
  return (
    <>
      <style jsx>{`
        .header-section {
          margin-bottom: 3rem;
          text-align: center;
          opacity: 1;
          transform: none;
        }
        
        .icon-container {
          display: inline-block;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          border-radius: 9999px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .header-title {
          font-size: 2.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #818cf8, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @media (min-width: 768px) {
          .header-title {
            font-size: 3rem;
          }
        }
        
        @media (min-width: 1024px) {
          .header-title {
            font-size: 3.5rem;
          }
        }
        
        .header-description {
          color: #d1d5db;
          max-width: 2xl;
          margin-left: auto;
          margin-right: auto;
          font-size: 1.125rem;
        }
      `}</style>
      
      <header className={`header-section mb-16`}>
        <div className="icon-container">
          <Music className={`w-8 h-8 text-indigo-400`} />
        </div>
        <h1 className="header-title">
          {config.title}
        </h1>
        <p className="header-description">
          {config.description}
        </p>
      </header>
    </>
  );
}