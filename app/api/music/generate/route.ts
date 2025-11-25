import { NextRequest, NextResponse } from 'next/server';
import { MusicGenerateParams, MusicData } from '../types';
import { protectApiRoute, getAuthSession } from '../../../../lib/auth-server';
import fs from 'fs';
import path from 'path';

// 生成音乐的POST方法
export async function POST(req: NextRequest) {
  try {
    // 验证身份（使用统一的认证工具）
    const { userId } = await protectApiRoute();

    // 从请求体中获取参数
    const params: MusicGenerateParams = await req.json();
    
    // 验证必需参数
    if (!params.description || !params.style || !params.mood) {
      return NextResponse.json(
        { error: '请提供完整的音乐描述、风格和情绪' },
        { status: 400 }
      );
    }
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 生成模拟音乐数据（包含用户ID）
    const generatedMusic: MusicData = {
      id: Date.now().toString(),
      userId: userId, // 添加用户ID
      name: params.name,
      title: `${params.style.charAt(0).toUpperCase() + params.style.slice(1)} ${params.mood}`,
      description: params.description,
      style: params.style,
      mood: params.mood,
      duration: parseInt(params.duration),
      tempo: params.tempo,
      vocalType: params.vocalType, // 添加人声类型
      audioUrl: `https://example.com/music_${Date.now()}.mp3`,
      createdAt: new Date().toISOString(),
    };
    
    // 将生成的音乐数据保存到JSON文件
    try {
      const musicDataPath = path.join(process.cwd(), 'data', 'musicdata', 'music.json');
      
      // 读取现有数据
      let existingData: MusicData[] = [];
      if (fs.existsSync(musicDataPath)) {
        const fileContent = fs.readFileSync(musicDataPath, 'utf-8');
        try {
          existingData = JSON.parse(fileContent);
          // 确保数据是数组格式
          if (!Array.isArray(existingData)) {
            existingData = [];
          }
        } catch (parseError) {
          console.error('解析音乐数据文件失败:', parseError);
          existingData = [];
        }
      }
      
      existingData.push(generatedMusic);
      
      const dirPath = path.dirname(musicDataPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // 写入更新后的数据
      fs.writeFileSync(musicDataPath, JSON.stringify(existingData, null, 2));
      console.log('音乐数据已成功保存到JSON文件');
    } catch (fileError) {
      console.error('保存音乐数据到JSON文件失败:', fileError);
    }
    return NextResponse.json(generatedMusic, { status: 200 });
  } catch (error) {
    console.error('生成音乐失败:', error);
    return NextResponse.json(
      { error: '生成音乐时发生错误' },
      { status: 500 }
    );
  }
}

// 获取音乐历史记录的GET方法
export async function GET() {
  try {
    // 验证身份（使用统一的认证工具）
    const { userId } = await protectApiRoute();

    const musicDataPath = path.join(process.cwd(), 'data', 'musicdata', 'music.json');
    
    // 检查文件是否存在
    if (!fs.existsSync(musicDataPath)) {
      return NextResponse.json([], { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    const fileContent = fs.readFileSync(musicDataPath, 'utf8');
    const musicHistory = JSON.parse(fileContent);
    if (!Array.isArray(musicHistory)) {
      throw new Error('音乐历史数据格式错误');
    }
    
    // 只返回当前用户的音乐记录
    const userMusicHistory = musicHistory.filter(
      (music: MusicData) => music.userId === userId
    );
    
    // 规范排版（按创建时间倒序，最新的在前）
    const sortedHistory = userMusicHistory.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // 倒序排列
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(sortedHistory, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('获取历史记录失败:', error);
    return NextResponse.json(
      { error: '获取历史记录时发生错误' },
      { status: 500 }
    );
  }
}