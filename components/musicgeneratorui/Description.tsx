import { Music } from 'lucide-react';

interface CardProps {
  icon: string;
  title: string;
  description: string;
}

interface TitleConfig {
  text: string;
  icon: string;
}

interface DescriptionConfig {
  title: TitleConfig;
  description: string;
  cards: CardProps[];
}

interface DescriptionProps {
  config: DescriptionConfig;
}

export default function Description({ config }: DescriptionProps) {
  const { title, description, cards } = config;
  return (
    <section className={`relative py-16 px-4 overflow-hidden translate-y-10 transition-all duration-1000 ease-out  mb-24`} style={{ backgroundColor: '#0F172A' }}>
      {/* 背景装饰元素 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow-delay"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 relative z-10">
      <div className="col-span-full">
        <h3 className="text-xl font-semibold mb-6 text-white flex items-center justify-center gap-3">
          <Music className={`w-6 h-6 text-indigo-400`} />
          {title.text}
        </h3>
        <p className="mb-8 text-gray-300 text-lg max-w-4xl mx-auto text-center">
          {description}
        </p>
      </div>
      {cards.map((card, index) => (
        <div key={index} className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 hover:border-border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-border-blue-500/10 transform hover:-translate-y-1`}>
          <div className={`w-12 h-12 mb-4 rounded-full bg-border-green-500.replace('-500', '-900')}/50 flex items-center justify-center`}>
            <Music className={`w-6 h-6 text-amber-400`} />
          </div>
          <h4 className={`text-lg font-medium mb-3 text-white`}>{card.title}</h4>
          <p className="text-gray-300">{card.description}</p>
        </div>
      ))}
    </div>
  </section>
  );
}