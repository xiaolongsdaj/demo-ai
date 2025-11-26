'use client'
import MusicGeneratorForm from "@/components/musicgeneratorui/MusicGeneratorForm";

export default function InstrumentalMusicGenerator() {
  return (
    <div>
      <h1>纯音乐</h1>
      <MusicGeneratorForm 
            mode="instrumental"
            generateButtonText="生成纯音乐"
          />
    </div>
  );
}