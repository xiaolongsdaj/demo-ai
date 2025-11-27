import React from 'react';

interface TitleConfig {
  text: string;
}

interface HeroConfig {
  title: TitleConfig;
  description: string;
}

interface HeroProps {
  config: HeroConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  const { title, description} = config;
  return (
    <section className={`mb-16 bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-lg translate-y-10 transition-all duration-1000 ease-out mb-16`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center`}>
        {title.text}
      </h2>
      <p className="mb-8 text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto text-center">
        {description}
      </p>
    </section>
  );
};

export default Hero;