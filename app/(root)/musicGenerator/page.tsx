'use client'
// 引入音乐生成器表单组件 - 支持多种模式配置
import MusicGeneratorForm from '@/components/musicgeneratorui/MusicGeneratorForm';
import Header from '@/components/musicgeneratorui/Header';
import Hero from '@/components/musicgeneratorui/Hero';
import Description from '@/components/musicgeneratorui/Description';
import Feature from '@/components/musicgeneratorui/Feature';
import Howto from '@/components/musicgeneratorui/Howto';
import FAQ from '@/components/musicgeneratorui/FAQ';
import CTA from '@/components/musicgeneratorui/CTA';
import musicData from'@/data/musicgenerator/inspirationMusic.json';



export default function MusicGenerator() {
  
  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/10">
      <div className="mx-auto max-w-7xl">
        <Header config={musicData.header} />
        <div className="mt-8">
          <MusicGeneratorForm 
            mode="inspiration"
            generateButtonText="开始创作音乐"
          />
          <Hero config={musicData.hero}/>
          <Description config={musicData.description}/>
          <Feature config={musicData.feature}/>
          <Howto config={musicData.howto}/>
          <FAQ config={musicData.faq}/>
          <CTA config={musicData.cta}/>
        </div>
       </div>
      </div>
    </>
  )}