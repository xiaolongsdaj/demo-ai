// 导入必要的Next.js模块
import { NextRequest, NextResponse } from 'next/server';

// 定义订阅计划的类型，确保与前端组件一致
 export interface PricingFeature {
  text: string;
  color: string;
  icon?: React.ReactNode;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string; // 原始价格，用于显示折扣
  period?: string;
  description: string;
  featuresTitle: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant: 'outline' | 'default' | 'secondary';
  isHighlighted?: boolean;
  cardClassName?: string;
  buttonClassName?: string;
  details?: string; // 额外的计划详情
  popularBadge?: string; // 热门计划徽章
  discount?: number; // 折扣百分比
}

// 模拟数据库中的订阅计划数据
const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '免费版',
    price: '$0',
    period: '永久免费',
    description: '适合个人用户入门使用',
    featuresTitle: '基础功能',
    features: [
      { text: '每日10次音乐生成', color: 'text-green-500' },
      { text: '基础音乐风格选择', color: 'text-green-500' },
      { text: '720p音频质量', color: 'text-green-500' },
      { text: '基础功能支持', color: 'text-green-500' },
      { text: '社区模板使用', color: 'text-yellow-500' }
    ],
    buttonText: '免费开始',
    buttonVariant: 'outline',
    details: '免费版账号没有使用期限限制，但功能和使用频率有所限制。'
  },
  {
    id: 'standard',
    name: '标准版',
    price: '$9.99',
    period: '每月',
    description: '适合个人创作者和小型团队',
    featuresTitle: '进阶功能',
    features: [
      { text: '无限音乐生成次数', color: 'text-green-500' },
      { text: '自定义音乐参数调节', color: 'text-green-500' },
      { text: '累计使用量统计', color: 'text-green-500' },
      { text: '高级功能支持', color: 'text-green-500' },
      { text: '1080p高清音频', color: 'text-green-500' },
      { text: '优先技术支持', color: 'text-green-500' }
    ],
    buttonText: '升级订阅',
    buttonVariant: 'default',
    isHighlighted: true,
    cardClassName: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
    buttonClassName: 'bg-white text-blue-600 hover:bg-gray-100 font-bold',
    details: '标准版提供所有基础功能，并增加了高级编辑和优先支持。'
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '$49.99',
    period: '每月',
    description: '适合专业工作室和大型企业',
    featuresTitle: '企业专属功能',
    features: [
      { text: '无限音乐生成和存储', color: 'text-green-500' },
      { text: '企业级安全保障', color: 'text-green-500' },
      { text: '多轨道混音编辑', color: 'text-green-500' },
      { text: '4K超高清音频导出', color: 'text-green-500' },
      { text: 'API优先接入权限', color: 'text-green-500' },
      { text: '专属客户经理', color: 'text-green-500' },
      { text: '团队协作功能', color: 'text-green-500' }
    ],
    buttonText: '升级订阅',
    buttonVariant: 'secondary',
    details: '企业版提供最全面的功能和服务，支持团队协作和企业级需求。'
  }
];

// 获取所有订阅计划
export async function GET() {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回订阅计划数据
    return NextResponse.json({
      success: true,
      plans: pricingPlans,
      message: '订阅计划获取成功'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('获取订阅计划失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取订阅计划失败，请稍后重试',
      message: '服务器错误'
    }, {
      status: 500
    });
  }
}

// 获取特定订阅计划详情
export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    const { planId } = body;
    
    // 验证参数
    if (!planId) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数',
        message: '请提供有效的订阅计划ID'
      }, {
        status: 400
      });
    }
    
    // 查找对应的订阅计划
    const selectedPlan = pricingPlans.find(plan => plan.id === planId);
    
    if (!selectedPlan) {
      return NextResponse.json({
        success: false,
        error: '订阅计划不存在',
        message: '未找到指定的订阅计划'
      }, {
        status: 404
      });
    }
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 返回选中的订阅计划详情，添加折扣信息
    const planWithDiscount = {
      ...selectedPlan,
      discount: selectedPlan.id !== 'free' ? 15 : 0, // 示例：非免费计划提供15%折扣
      originalPrice: selectedPlan.id !== 'free' 
        ? `$${(parseFloat(selectedPlan.price.replace('$', '')) / 0.85).toFixed(2)}` 
        : undefined
    };
    
    return NextResponse.json({
      success: true,
      plan: planWithDiscount,
      message: '订阅计划详情获取成功',
      timestamp: new Date().toISOString()
    }, {
      status: 200
    });
  } catch (error) {
    console.error('获取订阅计划详情失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取订阅计划详情失败，请稍后重试',
      message: '服务器错误'
    }, {
      status: 500
    });
  }
}

// 处理订阅流程 - 模拟支付和订阅处理
export async function PUT(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    const { planId, paymentInfo } = body;
    
    // 验证必要参数
    if (!planId) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数',
        message: '请提供有效的订阅计划ID'
      }, {
        status: 400
      });
    }
    
    // 查找对应的订阅计划
    const selectedPlan = pricingPlans.find(plan => plan.id === planId);
    
    if (!selectedPlan) {
      return NextResponse.json({
        success: false,
        error: '订阅计划不存在',
        message: '未找到指定的订阅计划'
      }, {
        status: 404
      });
    }
    
    // 模拟支付处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟支付处理逻辑（实际项目中应该与支付网关集成）
    // 这里简单模拟95%的成功率
    const isPaymentSuccessful = Math.random() > 0.05;
    
    if (!isPaymentSuccessful) {
      return NextResponse.json({
        success: false,
        error: '支付处理失败',
        message: '很抱歉，支付处理失败，请重试或联系客服'
      }, {
        status: 400
      });
    }
    
    // 生成模拟订阅ID和到期时间
    const subscriptionId = `sub_${Math.random().toString(36).substring(2, 15)}`;
    const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // 模拟成功的订阅响应
    return NextResponse.json({
      success: true,
      subscriptionId,
      planId,
      planName: selectedPlan.name,
      nextBillingDate,
      message: '订阅成功！',
      timestamp: new Date().toISOString(),
      // 添加一些附加信息
      paymentStatus: 'succeeded',
      customerEmail: paymentInfo?.email || 'user@example.com',
      renewalStatus: 'active'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('订阅处理失败:', error);
    return NextResponse.json({
      success: false,
      error: '订阅处理失败，请稍后重试',
      message: '服务器错误'
    }, {
      status: 500
    });
  }
}