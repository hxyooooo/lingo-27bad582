import React, { useState, useRef, useEffect } from 'react';
import { Camera, Calendar, BookOpen, User, Home, Settings, Search, Bell, Menu, X, Plus, AlertTriangle, CheckCircle, TrendingUp, Target, MessageSquare, HelpCircle, LogOut, ExternalLink, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { format } from 'date-fns';

// ==========================================
// 1. 用户认证数据库 (使用localStorage)
// ==========================================

const userDb = {
  // 存储用户信息
  getUsers: () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  // 添加新用户
  addUser: (userData) => {
    const users = userDb.getUsers();
    const existingUser = users.find(user => user.username === userData.username || user.email === userData.email);
    
    if (existingUser) {
      throw new Error('用户名或邮箱已被注册');
    }
    
    const newUser = {
      id: Date.now() + Math.random(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // 实际应用中应加密存储
      createdAt: new Date().toISOString(),
      isVip: false,
      name: userData.username,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userData.username,
      location: '陕西·西安',
      bmi: 21.5,
      weight: 62.5,
      targetCalories: 1800
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },
  
  // 验证用户登录
  validateUser: (usernameOrEmail, password) => {
    const users = userDb.getUsers();
    const user = users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password
    );
    
    if (user) {
      // 登录成功，更新本地用户信息
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  // 检查用户是否已登录
  isLoggedIn: () => {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? true : false;
  },
  
  // 获取当前登录用户
  getCurrentUser: () => {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  },
  
  // 登出用户
  logout: () => {
    localStorage.removeItem('currentUser');
  }
};

// ==========================================
// 2. 数据库模拟 (使用localStorage)
// ==========================================

// 模拟数据库
const db = {
  // 今日饮食记录
  getDietRecords: () => {
    const records = localStorage.getItem('dietRecords');
    return records ? JSON.parse(records) : [];
  },
  addDietRecord: (record) => {
    const records = db.getDietRecords();
    records.push({
      ...record,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('dietRecords', JSON.stringify(records));
    return records;
  },
  updateDietRecord: (id, updatedRecord) => {
    const records = db.getDietRecords();
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updatedRecord };
      localStorage.setItem('dietRecords', JSON.stringify(records));
    }
    return records;
  },
  deleteDietRecord: (id) => {
    const records = db.getDietRecords().filter(record => record.id !== id);
    localStorage.setItem('dietRecords', JSON.stringify(records));
    return records;
  },
  // 健康报告
  getHealthReports: () => {
    const reports = localStorage.getItem('healthReports');
    return reports ? JSON.parse(reports) : [];
  },
  addHealthReport: (report) => {
    const reports = db.getHealthReports();
    reports.push({
      ...report,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('healthReports', JSON.stringify(reports));
    return reports;
  },
  updateHealthReport: (id, updatedReport) => {
    const reports = db.getHealthReports();
    const index = reports.findIndex(report => report.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updatedReport };
      localStorage.setItem('healthReports', JSON.stringify(reports));
    }
    return reports;
  },
  deleteHealthReport: (id) => {
    const reports = db.getHealthReports().filter(report => report.id !== id);
    localStorage.setItem('healthReports', JSON.stringify(reports));
    return reports;
  },
  // 历史数据统计
  getHistoricalData: () => {
    const data = localStorage.getItem('historicalData');
    return data ? JSON.parse(data) : [];
  },
  addHistoricalData: (data) => {
    const historicalData = db.getHistoricalData();
    historicalData.push({
      ...data,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('historicalData', JSON.stringify(historicalData));
    return historicalData;
  },
  updateHistoricalData: (id, updatedData) => {
    const historicalData = db.getHistoricalData();
    const index = historicalData.findIndex(item => item.id === id);
    if (index !== -1) {
      historicalData[index] = { ...historicalData[index], ...updatedData };
      localStorage.setItem('historicalData', JSON.stringify(historicalData));
    }
    return historicalData;
  },
  deleteHistoricalData: (id) => {
    const historicalData = db.getHistoricalData().filter(item => item.id !== id);
    localStorage.setItem('historicalData', JSON.stringify(historicalData));
    return historicalData;
  },
  // 健康目标设置
  getHealthGoals: () => {
    const goals = localStorage.getItem('healthGoals');
    return goals ? JSON.parse(goals) : [];
  },
  addHealthGoal: (goal) => {
    const goals = db.getHealthGoals();
    goals.push({
      ...goal,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('healthGoals', JSON.stringify(goals));
    return goals;
  },
  updateHealthGoal: (id, updatedGoal) => {
    const goals = db.getHealthGoals();
    const index = goals.findIndex(goal => goal.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updatedGoal };
      localStorage.setItem('healthGoals', JSON.stringify(goals));
    }
    return goals;
  },
  deleteHealthGoal: (id) => {
    const goals = db.getHealthGoals().filter(goal => goal.id !== id);
    localStorage.setItem('healthGoals', JSON.stringify(goals));
    return goals;
  },
  // 用户信息
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : {
      name: '用户管理员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      location: '陕西·西安',
      id: '8827364',
      isVip: true,
      bmi: 21.5,
      weight: 62.5,
      targetCalories: 1800
    };
  },
  updateUserInfo: (info) => {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }
};

// ==========================================
// 3. 全局数据准备
// ==========================================

// --- 文化传承数据 (非遗长廊) ---
const heritageData = [
  {
    id: 1,
    title: '陕西皮影戏',
    category: '民间美术 / 国家级非遗',
    image: 'https://imgs.699pic.com/images/402/686/744.jpg!list1x.v2',
    desc: '一口叙说千古事，双手对舞百万兵。',
    detail: '陕西皮影戏起源于汉代，兴盛于唐宋。其造型质朴单纯，富于装饰性，同时又具有精致工巧的艺术特色。表演时，艺人们在白色幕布后面，一边操纵影人，一边用秦腔讲述故事，吼出西北汉子的豪迈。',
    videoUrl: 'https://www.bilibili.com/video/BV1Wc411f79E/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 2,
    title: '秦腔',
    category: '传统戏剧 / 国家级非遗',
    image: 'https://static.jingjiribao.cn/2022/6/14/139371_W020220614376771912762.jpeg', 
    desc: '八百里秦川尘土飞扬，三千万老陕齐吼秦腔。',
    detail: '秦腔，别称"邦子腔"，是中国西北最古老的戏剧之一。其特点是高昂激越、强烈急促。听秦腔，能感受到关中八百里秦川的厚重与沧桑，是国家级非物质文化遗产。',
    videoUrl: 'https://www.bilibili.com/video/BV1k64y1y7oR/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 3,
    title: '凤翔泥塑',
    category: '传统技艺 / 宝鸡',
    image: 'https://x0.ifengimg.com/ucms/2025_22/9B67A975153E2363431EFCC5EE3A980883D4FFF3_size547_w1000_h666.jpg',
    desc: '色彩艳丽，造型夸张，寓意驱邪避灾。',
    detail: '凤翔泥塑汲取了古代石刻、年画、剪纸和刺otto的纹饰，造型夸张，色彩鲜艳，深受人们喜爱。其中以"挂虎"和"坐虎"最为典型，寓意驱邪避灾，吉祥如意。',
    videoUrl: 'https://www.bilibili.com/video/BV1DL4y1P7b3/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 4,
    title: '安塞腰鼓',
    category: '民俗舞蹈 / 延安',
    image: 'https://ts1.tc.mm.bing.net/th/id/R-C.21668e11208da8644a9c46a1439eb0cf?rik=NUCVdSgSTdPySA&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fphotoblog%2f1006%2f01%2fc16%2f4077920_4077920_1275398392718.jpg&ehk=aKBueP3ldmhvabRp0Olxvf201nwMrYWpwh5TYWiNfFg%3d&risl=&pid=ImgRaw&r=0', 
    desc: '黄土高原上的"第一鼓"，气势磅礴。',
    detail: '安塞腰鼓是黄土高原上的一种独特的民间大型舞蹈艺术形式，具有2000年以上的历史。表演可由几人或上千人一同进行，磅礴的气势，精湛的技艺，使人叹为观止。',
    videoUrl: 'https://www.bilibili.com/video/BV199pTebEoG/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 5,
    title: '同州梆子',
    category: '传统戏剧 / 渭南',
    image: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.9ExaJXuBKtBPnE37LzjP0wAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
    desc: '秦腔的鼻祖，唱腔激越豪放。',
    detail: '同州梆子是陕西省东府渭南地区的地方戏曲剧种，是秦腔的前身。它保留了更多古老的音韵和表演程式，具有极高的艺术研究价值。',
    videoUrl: 'https://www.bilibili.com/video/BV1ciwneoEa4/?spm_id_from=333.337.search-card.all.click'
  },
  {
    id: 6,
    title: '耀州窑陶瓷',
    category: '传统技艺 / 铜川',
    image: 'https://ts1.tc.mm.bing.net/th/id/R-C.048cb580c92ff3c9779f05279ebc0af6?rik=mmKZ7%2brSDLcLpw&riu=http%3a%2f%2fzhongguociwang.cn%2fupload%2f2017-02%2f17021417595907.jpg&ehk=qFH9ZGaeJUPEkmjEosDGmKiqrxDNJFT3Axrtwo%2fZIe0%3d&risl=&pid=ImgRaw&r=0',
    desc: '巧如范金，精比琢玉，北方青瓷代表。',
    detail: '耀州窑是中国传统制瓷工艺中的珍品，宋代六大窑系。其刀法犀利流畅，线条刚劲有力，素有"北方青瓷之冠"的美誉。',
    videoUrl: 'https://www.bilibili.com/video/BV15E411i7mq/?spm_id_from=333.337.search-card.all.click'
  }
];

// --- 节气数据字典 ---
const seasonalData = {
  lichun: {
    name: '立春',
    date: '2月3日-5日',
    color: '#52c41a',
    intro: '立春，为二十四节气之首。立，是"开始"之意；春，代表着温暖、生长。立春不仅是春天的开始，也是一年农事活动的开端。陕西民间有"咬春"的习俗，吃春饼、嚼萝卜，祈求身体健康，五谷丰登。',
    foods: [
      { name: '春饼卷素', calories: 320, desc: '薄饼卷土豆丝、豆芽，寓意咬住春天', icon: '.' },
      { name: '凉拌萝卜丝', calories: 80, desc: '清脆爽口，顺气消食，谓之"咬春"', icon: '.' },
      { name: '韭菜炒鸡蛋', calories: 260, desc: '春令时鲜，助阳生发', icon: '.' }
    ]
  },
  qingming: {
    name: '清明',
    date: '4月4日-6日',
    color: '#13c2c2',
    intro: '清明时节雨纷纷，万物生长此时洁净而明清。此时节气温转暖，但早晚仍有凉意。饮食宜温和，多吃柔肝养肺的食物。陕西关中地区有吃"寒食"的遗风，如凉皮、凉面等。',
    foods: [
      { name: '青团', calories: 220, desc: '艾草汁和面，清淡幽香，软糯可口', icon: '.' },
      { name: '秦镇凉皮', calories: 280, desc: '清明吃凉，酸辣开胃，关中特色', icon: '.' },
      { name: '螺蛳肉', calories: 150, desc: '清明螺，抵只鹅，肉质肥美', icon: '.' }
    ]
  },
  dashu: {
    name: '大暑',
    date: '7月22日-24日',
    color: '#fa8c16',
    intro: '大暑是全年最热的节气，"湿热交蒸"在此时达到顶点。饮食应以清热解暑、健脾利湿为主。老陕人喜欢在夏天喝绿豆汤、吃浆水鱼鱼，既解暑又开胃。',
    foods: [
      { name: '绿豆百合汤', calories: 120, desc: '消暑止渴，清心安神', icon: '.' },
      { name: '浆水鱼鱼', calories: 180, desc: '酸香爽滑，也是陕西夏日消暑神器', icon: '.' },
      { name: '苦瓜炒肉', calories: 240, desc: '苦味入心，清热祛火', icon: '.' }
    ]
  },
  dongzhi: {
    name: '冬至',
    date: '12月21日-23日',
    color: '#1890ff',
    intro: '冬至是"阴极之至，阳气始生"的重要节气。在陕西，冬至地位极高，所谓"冬至大如年"。最核心的习俗就是吃饺子，寓意消寒，不冻耳朵；陕北地区则有喝羊肉汤的习惯，以此温补阳气。',
    foods: [
      { name: '酸汤水饺', calories: 450, desc: '冬至不端饺子碗，冻掉耳朵没人管', icon: '.' },
      { name: '铁锅炖羊肉', calories: 500, desc: '温中暖肾，抵御严寒', icon: '.' },
      { name: '八宝粥', calories: 300, desc: '五谷杂粮，健脾养胃', icon: '.' }
    ]
  }
};

// ==========================================
// 4. Coze智能体API调用函数
// ==========================================

// Coze智能体API调用函数
const callCozeAgentAPI = async (userMessage) => {
  try {
    // 构造请求体
    const requestBody = {
      user_id: "user123", // 可以根据需要生成用户ID
      stream: false, // 非流式响应
      query: userMessage,
      conversation_id: "", // 空字符串表示新对话
      attachments: [] // 暂时没有附件
    };

    // 发送请求到Coze智能体
    const response = await fetch('https://7kf89hm5y6.coze.site/stream_run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzYzBiMjdjLWI4YjMtNGIxMy1hNWU1LTExMTE3MzBjYjkwMCJ9.eyJpc3MiOiJodHRwczovL2FwaS5jb3plLmNuIiwiYXVkIjpbIjBYNmE2eWNlRGJIbVZmUHhuR3NqeHpXc0VxcWpheU1UIl0sImV4cCI6ODIxMDI2Njg3Njc5OSwiaWF0IjoxNzY3NzY2NDYyLCJzdWIiOiJzcGlmZmU6Ly9hcGkuY29uLmNuL3dvcmtsb2FkX2lkOjc1OTI0NzM4NzI3NDI0ODE5MjYiLCJzcmMiOiJpbmJvdW5kX2F1dGhfYWNjZXNzX3Rva2VuX2lkOjc1OTI0OTkxNDUwMTc5MTc0ODIifQ.OGAsjEO0rTbTMHci5AUIKxVtxJt1giuGG_BHyc0p1uyn_B0ZAsQrzWOWbZukXM5C1zrIuqEK7_bbRd8Ojhq6z3fF5OYU3qFWHKMLlyi4Zqr-1OQ5yr-SfwkG1fRvT7iN990OY5BKNBdFq-gsKGM7hVj-qwVuKxAJFWLO0dFle67h7OXLbFDeJ45_KYD0Lki_0FPrYLD08gCQ2Ni3dsKmJIxspvmAw2Pi_akRm_PwEf4Su-7FUHIekLXcalU0V-aeEXi5MxxEEiVFbcyLpYTaHJtmtIl_elpk24cATfMFBjlS5tL3dZwT4mRlgvn8XSzupei8iHA809zAvYWWttNYcA'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 根据Coze API响应格式提取内容
    // 假设响应中包含一个message字段
    if (data && data.message) {
      return data.message;
    } else if (data && data.content) {
      return data.content;
    } else {
      // 如果响应格式不同，返回整个响应的字符串表示
      return JSON.stringify(data);
    }
  } catch (error) {
    console.error('Coze API调用失败:', error);
    // 返回错误信息，但不暴露具体错误细节给用户
    return '很抱歉，AI助手暂时无法提供服务，请稍后再试。';
  }
};

// 智能体API调用函数 - 专门用于AI助手
const callIntelligentAgentAPI = async (userMessage) => {
  // 调用Coze智能体
  return await callCozeAgentAPI(userMessage);
};

// ==========================================
// 5. AI健康报告生成算法
// ==========================================

// AI健康报告生成函数
const generateAIHealthReport = (userInfo, dietList, historicalData) => {
  // 计算基础数据
  const baseCalories = 1240;
  const addedCalories = dietList.reduce((acc, cur) => acc + (cur.calories || 0), 0);
  const totalCalories = baseCalories + addedCalories;
  const caloriePercentage = (totalCalories / userInfo.targetCalories) * 100;
  
  // 计算营养素估算（基于热量分配）
  const estimatedProtein = Math.floor(totalCalories * 0.15 / 4); // 每克蛋白质4卡路里
  const estimatedCarbs = Math.floor(totalCalories * 0.55 / 4);   // 每克碳水化合物4卡路里
  const estimatedFat = Math.floor(totalCalories * 0.30 / 9);     // 每克脂肪9卡路里
  
  // 生成个性化评估
  let calorieAssessment = '';
  let calorieRecommendation = '';
  
  if (caloriePercentage < 80) {
    calorieAssessment = `您今日的热量摄入为${totalCalories}kcal，仅达到目标的${Math.round(caloriePercentage)}%，摄入量偏低。`;
    calorieRecommendation = `建议适当增加营养密度高的食物，如坚果、牛油果等健康脂肪，以及优质蛋白质如鸡蛋、瘦肉等，以达到每日营养需求。`;
  } else if (caloriePercentage > 120) {
    calorieAssessment = `您今日的热量摄入为${totalCalories}kcal，超出目标${Math.round(caloriePercentage - 100)}%，摄入量偏高。`;
    calorieRecommendation = `建议适当减少高热量食物的摄入，增加蔬菜、水果等低热量高纤维食物的比例，保持营养均衡。`;
  } else {
    calorieAssessment = `您今日的热量摄入为${totalCalories}kcal，占目标的${Math.round(caloriePercentage)}%，摄入量适中。`;
    calorieRecommendation = '继续保持当前的饮食习惯，注意食物多样化，确保各类营养素的均衡摄入。';
  }
  
  // 基于BMI的健康评估
  let bmiAssessment = '';
  let bmiRecommendation = '';
  
  if (userInfo.bmi < 18.5) {
    bmiAssessment = '您的BMI为' + userInfo.bmi + '，属于偏瘦范围。';
    bmiRecommendation = '建议适当增加热量摄入，特别是蛋白质和健康脂肪的摄入，帮助增加体重至健康范围。';
  } else if (userInfo.bmi >= 18.5 && userInfo.bmi < 24) {
    bmiAssessment = '您的BMI为' + userInfo.bmi + '，属于正常范围。';
    bmiRecommendation = '继续保持当前的饮食和运动习惯，维持健康体重。';
  } else if (userInfo.bmi >= 24 && userInfo.bmi < 28) {
    bmiAssessment = '您的BMI为' + userInfo.bmi + '，属于超重范围。';
    bmiRecommendation = '建议适当控制热量摄入，增加运动量，逐步将体重调整至健康范围。';
  } else {
    bmiAssessment = '您的BMI为' + userInfo.bmi + '，属于肥胖范围。';
    bmiRecommendation = '建议制定科学的减重计划，控制总热量摄入，增加有氧运动，逐步改善健康状况。';
  }
  
  // 分析饮食结构
  let dietStructure = '';
  let dietRecommendation = '';
  
  if (dietList.length === 0) {
    dietStructure = '今日尚未记录任何饮食。';
    dietRecommendation = '建议使用AI识食功能或节气饮食功能记录您的饮食，以便获得更精准的健康建议。';
  } else {
    const foodNames = dietList.map(item => item.name).join('、');
    dietStructure = `今日饮食包括：${foodNames}。`;
    
    // 根据食物类型给出建议
    const hasProtein = dietList.some(item => ['肉夹馍', '羊肉泡馍', '鸡蛋', '肉', '鱼', '鸡'].some(keyword => item.name.includes(keyword)));
    const hasVegetables = dietList.some(item => ['蔬菜', '菜', '萝卜', '韭菜', '青团'].some(keyword => item.name.includes(keyword)));
    const hasGrains = dietList.some(item => ['饼', '米皮', '饺子', '粥', '面'].some(keyword => item.name.includes(keyword)));
    
    if (!hasProtein) {
      dietRecommendation += '建议增加蛋白质食物的摄入，如肉类、蛋类、豆制品等。';
    }
    if (!hasVegetables) {
      dietRecommendation += '建议增加蔬菜摄入，以补充维生素和纤维素。';
    }
    if (!hasGrains) {
      dietRecommendation += '建议适当摄入主食，保证碳水化合物供应。';
    }
    
    if (dietRecommendation === '') {
      dietRecommendation = '饮食结构较为均衡，建议继续保持。';
    }
  }
  
  // 基于历史数据的趋势分析
  let trendAnalysis = '';
  if (historicalData.length > 0) {
    const recentData = historicalData.slice(-7); // 最近7天数据
    const avgWeight = recentData.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0) / recentData.length;
    const avgCalories = recentData.reduce((sum, item) => sum + parseInt(item.calories || 0), 0) / recentData.length;
    
    if (avgWeight > userInfo.weight) {
      trendAnalysis = `最近一周平均体重为${avgWeight.toFixed(1)}kg，呈下降趋势，说明您的减重计划可能正在见效。`;
    } else if (avgWeight < userInfo.weight) {
      trendAnalysis = `最近一周平均体重为${avgWeight.toFixed(1)}kg，呈上升趋势，可能需要调整饮食和运动计划。`;
    } else {
      trendAnalysis = `最近一周体重保持稳定，说明您的饮食和运动习惯较为稳定。`;
    }
  } else {
    trendAnalysis = '暂无历史数据进行趋势分析。';
  }
  
  // 生成陕西文化贴士
  const seasonalTips = [
    '陕西传统饮食注重五味调和，今日推荐搭配一些时令蔬菜，如春季的韭菜、夏季的冬瓜等.',
    '根据节气养生，当前时节适合清淡饮食，避免过于油腻，可适当食用一些具有地方特色的养生食材.',
    '陕西人有"冬吃萝卜夏吃姜"的养生智慧，根据季节调整饮食结构，有助于身体健康.',
    '传统陕西美食如肉夹馍、凉皮等虽美味，但需注意搭配蔬菜，保证营养均衡.'
  ];
  
  const randomSeasonalTip = seasonalTips[Math.floor(Math.random() * seasonalTips.length)];
  
  // 返回详细的健康报告对象
  return {
    id: Date.now(),
    date: new Date().toISOString(),
    summary: calorieAssessment,
    overallAssessment: {
      title: '总体评估',
      content: calorieAssessment
    },
    bmiAssessment: {
      title: 'BMI健康评估',
      content: bmiAssessment
    },
    dietAnalysis: {
      title: '饮食结构分析',
      content: dietStructure
    },
    trendAnalysis: {
      title: '健康趋势分析',
      content: trendAnalysis
    },
    recommendations: [
      {
        title: '热量摄入建议',
        content: calorieRecommendation
      },
      {
        title: 'BMI健康建议',
        content: bmiRecommendation
      },
      {
        title: '饮食结构建议',
        content: dietRecommendation
      }
    ],
    nutrition: {
      protein: estimatedProtein,
      carbs: estimatedCarbs,
      fat: estimatedFat,
      calories: totalCalories
    },
    culturalTips: [
      randomSeasonalTip,
      '陕西饮食文化博大精深，合理搭配传统美食与现代营养学知识，有助于实现健康目标.',
      '根据个人体质和季节变化选择合适的陕西传统美食，既满足味蕾又维护健康.'
    ],
    personalizedInsights: {
      title: '个性化洞察',
      content: `基于您的个人数据（BMI: ${userInfo.bmi}, 目标热量: ${userInfo.targetCalories}kcal）和今日饮食记录，系统为您生成了这份个性化健康报告.`
    }
  };
};

// ==========================================
// 6. 登录注册页面组件
// ==========================================

const LoginRegisterView = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = userDb.validateUser(username, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      setIsLoading(false);
      return;
    }

    try {
      const newUser = userDb.addUser({ username, email, password });
      // 自动登录新注册的用户
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-primary p-8 text-white text-center">
          <h1 className="text-3xl font-bold">AI健康饮食</h1>
          <p className="text-primary-light mt-2">陕西传统文化融合平台</p>
        </div>
        
        <div className="p-8">
          {/* Tab切换 */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-3 font-medium ${
                activeTab === 'login' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('login')}
            >
              登录
            </button>
            <button
              className={`flex-1 py-3 font-medium ${
                activeTab === 'register' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-primary'
              }`}
              onClick={() => setActiveTab('register')}
            >
              注册
            </button>
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-error-light text-error p-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* 登录表单 */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户名或邮箱</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入用户名或邮箱"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">密码</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-primary text-white rounded-lg font-medium ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                }`}
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                <a href="#" className="text-primary hover:underline">忘记密码？</a>
              </div>
            </form>
          )}
          
          {/* 注册表单 */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">用户名</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">邮箱</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">密码</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请输入密码（至少6位）"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">确认密码</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="请再次输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-primary text-white rounded-lg font-medium ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                }`}
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>登录即表示您同意我们的 <a href="#" className="text-primary hover:underline">服务条款</a> 和 <a href="#" className="text-primary hover:underline">隐私政策</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. 页面组件
// ==========================================

// --- 首页 ---
const HomeView = ({ toPage }) => (
  <div className="max-w-6xl mx-auto p-10 text-center">
    <h1 className="text-5xl font-bold text-gray-800 mb-2">AI健康饮食</h1>
    <h1 className="text-5xl font-bold text-primary mb-6">陕西传统文化融合</h1>
    <p className="text-lg text-gray-600 mb-10">以AI轻量化赋能精准健康饮食，结合陕西非遗饮食文化传承的移动应用</p>
    
    <div className="flex justify-center gap-5 mb-16">
      <button 
        onClick={() => toPage('recognition')} 
        className="px-9 py-3 bg-primary text-white border-none rounded-lg text-lg cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
      >
        开始体验
      </button>
      <button className="px-9 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg text-lg cursor-pointer hover:bg-gray-50 transition-colors">
        了解更多
      </button>
    </div>

    <div className="flex justify-center gap-8 mb-16 flex-wrap">
      {[
        { num: '42+', label: '非遗菜品' }, 
        { num: '128+', label: '传统食谱' }, 
        { num: '2456+', label: '注册用户' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl w-56 shadow-md">
          <div className="text-4xl font-bold text-warning">{stat.num}</div>
          <div className="text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    <h2 className="text-3xl mb-8 text-left">核心功能概览</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[
        { title: 'AI非遗识别', desc: '拍照识别陕西非遗菜品', icon: <Camera className="w-8 h-8" />, link: 'recognition' },
        { title: '节气饮食', desc: '根据节气推荐传统食谱', icon: <Calendar className="w-8 h-8" />, link: 'season' },
        { title: '文化传承', desc: '学习陕西非遗技艺', icon: <BookOpen className="w-8 h-8" />, link: 'culture' },
        { title: '个人中心', desc: '查看健康数据与设置', icon: <User className="w-8 h-8" />, link: 'report' }
      ].map((item, idx) => (
        <div 
          key={idx} 
          onClick={() => toPage(item.link)} 
          className="bg-white p-6 rounded-xl cursor-pointer transition-transform hover:transform hover:-translate-y-1 shadow-md text-left"
        >
          <div className="bg-light-blue text-primary w-15 h-15 flex items-center justify-center rounded-full mb-4">
            {item.icon}
          </div>
          <h3 className="m-0 mb-2 text-xl font-semibold">{item.title}</h3>
          <p className="text-gray-500 text-sm m-0">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);



// --- [修改后] AI识食 ---
const RecognitionView = ({ onAdd }) => {
  const [imgPreview, setImgPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const mockDatabase = [
    { name: '腊汁肉夹馍', calories: 455, unit: '个', intro: '陕西省非物质文化遗产，中式汉堡.', recipe: '老卤炖煮五花肉，白吉馍烤制酥脆.' },
    { name: '羊肉泡馍', calories: 560, unit: '碗', intro: '苏轼赞誉"秦烹唯羊羹".', recipe: '羊骨熬汤，死面烙饼，配糖蒜辣酱.' },
    { name: '秦镇米皮', calories: 280, unit: '份', intro: '色白光润，皮薄筋道，酸辣味浓.', recipe: '大米磨浆蒸制，切条拌入秘制调料.' }
  ];

  const handleBtnClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setStatus('loading');
        setIsAnalyzing(true);
        
        // 模拟AI分析过程
        setTimeout(async () => {
          const isSuccess = Math.random() > 0.1; 
          if (isSuccess) {
            const randomDish = mockDatabase[Math.floor(Math.random() * mockDatabase.length)];
            setResult(randomDish);
            setStatus('success');
            
            // 使用模拟AI分析
            const analysisResult = `这是${randomDish.name}，${randomDish.intro}。这道菜的营养价值包括蛋白质、碳水化合物和多种维生素。建议适量食用，搭配蔬菜以保持营养均衡。`;
            setAiAnalysis(analysisResult);
          } else {
            setStatus('error');
            setAiAnalysis('');
          }
          setIsAnalyzing(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToDiet = () => {
    if(onAdd && result) {
        onAdd(result);
        alert(`成功！已将【${result.name}】加入个人中心的饮食清单.`);
    }
  };

  return (
    <div className="text-center p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl text-gray-800 mb-2">AI非遗菜品识别</h1>
      <p className="text-gray-600 mb-8">上传图片，AI自动分析营养成分与文化背景</p>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <div className="flex gap-8 items-start flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div 
            onClick={status === 'loading' ? null : handleBtnClick} 
            className={`bg-white rounded-2xl shadow-md h-88 flex flex-col justify-center items-center border-2 border-dashed ${status === 'loading' ? 'cursor-wait' : 'cursor-pointer'} overflow-hidden relative`}
          >
            {imgPreview ? (
              <>
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
                {status === 'loading' && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-80 flex items-center justify-center flex-col">
                    <div className="text-4xl mb-2">?</div>
                    <div className="text-primary font-bold">AI 正在分析...</div>
                    {isAnalyzing && (
                      <div className="mt-2 flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <><div className="text-6xl text-gray-300 mb-2">?</div><div className="text-gray-500">点击上传图片</div></>
            )}
          </div>
          <div className="mt-5">
             <button 
               onClick={handleBtnClick} 
               className="px-8 py-3 bg-primary text-white border-none rounded-lg text-lg cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
             >
               {imgPreview ? '? 重新上传' : '? 上传图片'}
             </button>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] text-left">
          {status === 'idle' && (
             <div className="bg-white p-10 rounded-2xl h-88 flex flex-col justify-center items-center text-gray-500 shadow-md">
               <div className="text-5xl mb-5 opacity-50">?</div>
               <div>请上传图片，右侧将显示分析结果</div>
             </div>
          )}
          {status === 'success' && result && (
            <div className="bg-white p-8 rounded-2xl shadow-md">
               <div className="flex justify-between items-start mb-5">
                 <div>
                   <span className="bg-light-blue text-primary px-3 py-1 rounded text-sm">陕西非遗美食</span>
                   <h2 className="m-2.5 text-2xl text-gray-800">{result.name}</h2>
                 </div>
                 <div className="text-right">
                   <div className="text-4xl text-success font-bold">{result.calories}</div>
                   <div className="text-xs text-gray-500">kcal / {result.unit}</div>
                 </div>
               </div>
               <div className="mb-5">
                 <h4 className="m-0 mb-2 text-gray-600">? 介绍</h4>
                 <p className="m-0 text-gray-700">{result.intro}</p>
               </div>
               <div className="mb-5">
                 <h4 className="m-0 mb-2 text-gray-600">? 做法概览</h4>
                 <div className="bg-gray-50 p-4 rounded-lg text-gray-600">{result.recipe}</div>
               </div>
               {aiAnalysis && (
                 <div className="mb-5">
                   <h4 className="m-0 mb-2 text-gray-600">? AI详细分析</h4>
                   <div className="bg-blue-50 p-4 rounded-lg text-gray-700 border border-blue-200">
                     {aiAnalysis}
                   </div>
                 </div>
               )}
               <button 
                 onClick={handleAddToDiet}
                 className="w-full py-3 bg-success text-white border-none rounded-xl text-lg font-bold cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
               >
                 <span>➕</span> 加入今日饮食清单
               </button>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-error-light p-10 rounded-2xl h-88 flex flex-col justify-center items-center text-error border border-error-light">
              <div className="text-6xl mb-5">⚠️</div>
              <h3 className="m-0 mb-2.5">无法识别图片内容</h3>
              <p className="m-0 text-gray-600 text-center max-w-xs">未检测到已知的陕西非遗菜品，请确保图片清晰，主体完整.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- [修改后] 节气饮食 ---
const SeasonalView = ({ onAdd }) => {
  // 默认选中"立春"
  const [activeTerm, setActiveTerm] = useState('lichun');
  
  // 获取当前选中节气的数据
  const termInfo = seasonalData[activeTerm];

  // 处理添加食物到清单
  const handleAddFood = (food) => {
    if (onAdd) {
      onAdd({
        name: `${termInfo.name}·${food.name}`,
        calories: food.calories,
        unit: '份'
      });
      alert(`已将【${food.name}】加入个人中心的饮食清单！`);
    }
  };

  // 节气按钮配置
  const termButtons = [
    { key: 'lichun', label: '立春', color: 'bg-success' },
    { key: 'qingming', label: '清明', color: 'bg-info' },
    { key: 'dashu', label: '大暑', color: 'bg-warning' },
    { key: 'dongzhi', label: '冬至', color: 'bg-primary' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-10">
      {/* 标题区域 */}
      <div className="text-left mb-8">
        <h2 className="text-3xl text-gray-800 m-0">? 节气饮食推荐</h2>
        <p className="text-gray-600 mt-1">根据二十四节气，推荐适合当季的传统美食</p>
      </div>

      {/* 节气选择按钮 */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {termButtons.map((term) => (
          <button
            key={term.key}
            onClick={() => setActiveTerm(term.key)}
            className={`px-8 py-3 ${
              activeTerm === term.key 
                ? `${term.color} text-white font-bold` 
                : 'bg-white text-gray-600 border border-gray-300'
            } rounded-full text-lg cursor-pointer transition-all shadow-md hover:shadow-lg`}
          >
            {term.label}
          </button>
        ))}
      </div>

      {/* 节气介绍卡片 */}
      <div className={`bg-white rounded-2xl p-8 mb-8 border-l-4 ${termInfo.color.replace('bg-', 'border-')} shadow-md`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-3xl m-0 text-gray-800">{termInfo.name}</h3>
            <span className={`${termInfo.color}-light text-${termInfo.color.replace('bg-', '')} px-3 py-1 rounded text-sm font-bold`}>
              {termInfo.date}
            </span>
          </div>
          <div className={`${termInfo.color} bg-opacity-15 text-white rounded-full w-15 h-15 flex items-center justify-center text-2xl`}>
            {termInfo.name.charAt(0)}
          </div>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed m-0">
          {termInfo.intro}
        </p>
      </div>

      {/* 食物推荐列表 */}
      <h3 className="text-2xl text-gray-800 mb-5 ml-2.5">? 推荐食谱</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {termInfo.foods.map((food, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleAddFood(food)}
          >
            <div className="flex items-center mb-4">
              <div className={`${termInfo.color}-light bg-opacity-15 rounded-xl w-13 h-13 flex items-center justify-center text-2xl`}>
                {food.icon}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-xl m-0 mb-1.5 text-gray-800">{food.name}</h4>
                <span className={`${termInfo.color.replace('bg-', 'text-')} font-bold`}>
                  {food.calories} kcal
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {food.desc}
            </p>
            <div className={`${termInfo.color}-light bg-opacity-10 flex items-center justify-center gap-2 p-2.5 rounded-lg ${termInfo.color.replace('bg-', 'text-')} text-lg font-bold`}>
              <span>➕</span>
              加入今日饮食清单
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- [新增] 文化传承（非遗长廊）---
const CultureView = ({ toPage }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="text-left mb-8">
        <h2 className="text-3xl text-gray-800 m-0">? 陕西非遗文化长廊</h2>
        <p className="text-gray-600 mt-1">探索三秦大地千年的文化积淀</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {heritageData.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)} 
            className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform hover:-translate-y-1.5"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-4">
              <div className="text-xs text-primary font-bold mb-1.5">
                {item.category}
              </div>
              <h3 className="m-0 mb-2.5 text-lg text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed m-0">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 详情弹窗 */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-5"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-90vh overflow-y-auto shadow-2xl"
          >
            <img 
              src={selectedItem.image} 
              alt={selectedItem.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="mb-5">
                <span className="bg-light-blue text-primary px-3 py-1 rounded text-xs font-bold">
                  {selectedItem.category}
                </span>
                <h2 className="text-3xl m-2.5 text-gray-800">{selectedItem.title}</h2>
                <p className="text-lg text-gray-600 italic m-0">
                  {selectedItem.desc}
                </p>
              </div>
              <div className="mb-6">
                <h4 className="m-0 mb-2.5 text-gray-600">? 详细介绍</h4>
                <p className="text-gray-700 leading-relaxed m-0">
                  {selectedItem.detail}
                </p>
              </div>
              {selectedItem.videoUrl && selectedItem.videoUrl !== '#' && (
                <button
                  onClick={() => window.open(selectedItem.videoUrl, '_blank')}
                  className="w-full py-3 bg-primary text-white border-none rounded-lg text-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>▶️</span>
                  观看视频
                </button>
              )}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white border-none rounded-full w-9 h-9 text-xl cursor-pointer flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- [新增] 历史数据统计组件 ---
const HistoricalDataView = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    weight: '',
    calories: '',
    notes: ''
  });

  // 加载历史数据
  useEffect(() => {
    setHistoricalData(db.getHistoricalData());
  }, []);

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // 更新数据
      const updatedData = db.updateHistoricalData(editingItem.id, formData);
      setHistoricalData(updatedData);
      setEditingItem(null);
    } else {
      // 添加新数据
      const newData = db.addHistoricalData(formData);
      setHistoricalData(newData);
    }
    setFormData({ date: '', weight: '', calories: '', notes: '' });
    setShowForm(false);
  };

  // 编辑数据
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      weight: item.weight,
      calories: item.calories,
      notes: item.notes
    });
    setShowForm(true);
  };

  // 删除数据
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const updatedData = db.deleteHistoricalData(id);
      setHistoricalData(updatedData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-gray-800 m-0">? 历史数据统计</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ date: '', weight: '', calories: '', notes: '' });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 添加记录
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
          <h3 className="text-xl m-0 mb-4 text-gray-800">
            {editingItem ? '编辑记录' : '添加新记录'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">体重 (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">热量摄入 (kcal)</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">备注</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-success text-white rounded-lg"
              >
                {editingItem ? '更新' : '添加'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setFormData({ date: '', weight: '', calories: '', notes: '' });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 数据列表 */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        {historicalData.length === 0 ? (
          <div className="text-center text-gray-400 p-10">
            <div className="text-5xl mb-2.5">?</div>
            <div>暂无历史数据</div>
            <div className="text-xs mt-1.5">点击上方按钮添加第一条记录</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-gray-600">日期</th>
                  <th className="text-left p-3 text-gray-600">体重 (kg)</th>
                  <th className="text-left p-3 text-gray-600">热量摄入 (kcal)</th>
                  <th className="text-left p-3 text-gray-600">备注</th>
                  <th className="text-left p-3 text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.weight}</td>
                    <td className="p-3">{item.calories}</td>
                    <td className="p-3">{item.notes || '-'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [新增] 健康目标设置组件 ---
const HealthGoalsView = () => {
  const [healthGoals, setHealthGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalType: 'weight',
    targetValue: '',
    targetDate: '',
    currentValue: '',
    notes: ''
  });

  // 加载健康目标
  useEffect(() => {
    setHealthGoals(db.getHealthGoals());
  }, []);

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      // 更新目标
      const updatedGoals = db.updateHealthGoal(editingGoal.id, formData);
      setHealthGoals(updatedGoals);
      setEditingGoal(null);
    } else {
      // 添加新目标
      const newGoal = db.addHealthGoal(formData);
      setHealthGoals(newGoal);
    }
    setFormData({
      goalType: 'weight',
      targetValue: '',
      targetDate: '',
      currentValue: '',
      notes: ''
    });
    setShowForm(false);
  };

  // 编辑目标
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      targetDate: goal.targetDate,
      currentValue: goal.currentValue,
      notes: goal.notes
    });
    setShowForm(true);
  };

  // 删除目标
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个目标吗？')) {
      const updatedGoals = db.deleteHealthGoal(id);
      setHealthGoals(updatedGoals);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-gray-800 m-0">? 健康目标设置</h2>
        <button
          onClick={() => {
            setEditingGoal(null);
            setFormData({
              goalType: 'weight',
              targetValue: '',
              targetDate: '',
              currentValue: '',
              notes: ''
            });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 设置目标
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
          <h3 className="text-xl m-0 mb-4 text-gray-800">
            {editingGoal ? '编辑目标' : '设置新目标'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">目标类型</label>
                <select
                  value={formData.goalType}
                  onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="weight">体重管理</option>
                  <option value="calories">热量摄入</option>
                  <option value="exercise">运动目标</option>
                  <option value="sleep">睡眠目标</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">目标值</label>
                <input
                  type="text"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">截止日期</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">当前值</label>
                <input
                  type="text"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">备注</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-success text-white rounded-lg"
              >
                {editingGoal ? '更新' : '设置'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setFormData({
                    goalType: 'weight',
                    targetValue: '',
                    targetDate: '',
                    currentValue: '',
                    notes: ''
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 目标列表 */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        {healthGoals.length === 0 ? (
          <div className="text-center text-gray-400 p-10">
            <div className="text-5xl mb-2.5">?</div>
            <div>暂无健康目标</div>
            <div className="text-xs mt-1.5">点击上方按钮设置您的第一个健康目标</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {healthGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 m-0">
                      {goal.goalType === 'weight' && '体重管理'}
                      {goal.goalType === 'calories' && '热量摄入'}
                      {goal.goalType === 'exercise' && '运动目标'}
                      {goal.goalType === 'sleep' && '睡眠目标'}
                    </h3>
                    <p className="text-sm text-gray-600 m-0">目标: {goal.targetValue}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <div>当前值: {goal.currentValue}</div>
                  <div>截止日期: {goal.targetDate}</div>
                </div>
                {goal.notes && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {goal.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- [修复后] 个人中心 ---
const PersonalCenterView = ({ dietList = [], onDelete }) => {
  const [activeTab, setActiveTab] = useState('diet');
  const [healthReports, setHealthReports] = useState([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const safeList = Array.isArray(dietList) ? dietList : [];
  const userInfo = db.getUserInfo();
  const historicalData = db.getHistoricalData();
  const baseCalories = 1240;
  const addedCalories = safeList.reduce((acc, cur) => acc + (cur.calories || 0), 0);
  const totalCalories = baseCalories + addedCalories;

  // 加载健康报告
  useEffect(() => {
    setHealthReports(db.getHealthReports());
  }, []);

  // 生成健康报告
  const generateHealthReport = () => {
    setIsGeneratingReport(true);
    
    // 模拟AI生成报告的过程
    setTimeout(() => {
      const newReport = generateAIHealthReport(userInfo, safeList, historicalData);
      const updatedReports = db.addHealthReport(newReport);
      setHealthReports(updatedReports);
      setIsGeneratingReport(false);
    }, 2000);
  };

  // 删除健康报告
  const handleDeleteReport = (id) => {
    if (window.confirm('确定要删除这份健康报告吗？')) {
      const updatedReports = db.deleteHealthReport(id);
      setHealthReports(updatedReports);
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null);
      }
    }
  };

  // 修复后的 MenuItem 组件 - 确保 title 始终有值
  const MenuItem = ({ icon, title = '', isRed, onClick }) => (
    <div 
      onClick={onClick} 
      className={`flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer text-${isRed ? 'error' : 'gray-800'} transition-colors hover:bg-gray-50`}
    >
      <div className="flex items-center gap-3 text-lg">
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </div>
      <span className="text-gray-300">&gt;</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* 1. 用户信息 */}
      <div className="bg-white rounded-2xl p-8 flex items-center gap-5 shadow-md mb-5">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img src={userInfo.avatar} alt="avatar" className="w-full h-full" />
        </div>
        <div className="flex-1">
          <h2 className="m-0 mb-1.5 text-2xl text-gray-800">{userInfo.name} <span className="text-xs bg-light-orange text-warning px-2 py-0.5 rounded-full border border-warning-light">VIP会员</span></h2>
          <p className="m-0 text-gray-500 text-sm">ID: {userInfo.id} | {userInfo.location}</p>
        </div>
        <button className="py-2 px-5 border border-primary text-primary bg-white rounded-full cursor-pointer hover:bg-primary-light transition-colors">签到打卡</button>
      </div>

      {/* 2. 健康数据 */}
      <h3 className="ml-2.5 text-gray-600">我的健康数据</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-gray-500 text-sm mb-1.5">身体质量指数 (BMI)</div>
          <div className="text-3xl font-bold text-success">{userInfo.bmi} <span className="text-sm font-normal">正常</span></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-gray-500 text-sm mb-1.5">今日热量摄入</div>
          <div className="text-3xl font-bold text-primary">{totalCalories} <span className="text-sm font-normal text-gray-500">/ {userInfo.targetCalories} kcal</span></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="text-gray-500 text-sm mb-1.5">当前体重</div>
          <div className="text-3xl font-bold text-warning">{userInfo.weight} <span className="text-sm font-normal text-gray-500">kg</span></div>
        </div>
      </div>

      {/* 3. 标签页切换 */}
      <div className="flex gap-4 mb-5 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('diet')}
          className={`pb-3 px-4 font-medium ${activeTab === 'diet' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          今日饮食清单
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 font-medium ${activeTab === 'reports' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
        >
          健康报告
        </button>
      </div>

      {/* 4. 内容区域 */}
      {activeTab === 'diet' && (
        <div className="bg-white rounded-2xl p-5 shadow-md mb-8 min-h-25">
          {safeList.length === 0 ? (
            <div className="text-center text-gray-400 p-5">
              <div className="text-5xl mb-2.5">?</div>
              <div>暂无记录</div>
              <div className="text-xs mt-1.5">请使用AI识食或节气食谱功能添加</div>
            </div>
          ) : (
            safeList.map((item, index) => (
              <div key={item.id || index} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-lg text-gray-800 font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.unit || ''}</div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {item.calories} kcal
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-error hover:text-error-dark ml-3"
                  >
                    删除
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl p-5 shadow-md mb-8 min-h-25">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold text-gray-800">健康报告</h3>
            <button 
              onClick={generateHealthReport}
              disabled={isGeneratingReport}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isGeneratingReport ? 'bg-gray-400' : 'bg-success hover:bg-success-dark'
              }`}
            >
              {isGeneratingReport ? '生成中...' : '生成今日报告'}
            </button>
          </div>
          
          {healthReports.length === 0 ? (
            <div className="text-center text-gray-400 p-10">
              <div className="text-5xl mb-2.5">?</div>
              <div>暂无健康报告</div>
              <div className="text-xs mt-1.5">点击上方按钮生成今日健康报告</div>
            </div>
          ) : (
            <div className="space-y-4">
              {healthReports.map((report) => (
                <div 
                  key={report.id} 
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div 
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium text-gray-800">
                        {format(new Date(report.date), 'yyyy年MM月dd日')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {report.summary}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-error hover:text-error-dark"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. 菜单列表 */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md">
        <MenuItem 
          icon="?" 
          title="历史数据统计" 
          onClick={() => window.location.hash = '#historical-data'} 
        />
        <MenuItem 
          icon="?" 
          title="健康目标设置" 
          onClick={() => window.location.hash = '#health-goals'} 
        />
        <MenuItem icon="?" title="消息通知" />
        <MenuItem icon="?" title="系统设置" />
        <MenuItem icon="❓" title="帮助与反馈" />
        <MenuItem 
          icon="?" 
          title="退出登录" 
          isRed 
          onClick={() => {
            userDb.logout();
            window.location.hash = '#login';
          }} 
        />
      </div>

      {/* 健康报告详情弹窗 */}
      {selectedReport && (
        <div 
          onClick={() => setSelectedReport(null)}
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-5/6 overflow-y-auto shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl m-0 text-gray-800">健康报告</h2>
                  <p className="text-gray-500 m-0 mt-1">
                    {format(new Date(selectedReport.date), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* 个性化洞察 */}
              {selectedReport.personalizedInsights && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">{selectedReport.personalizedInsights.title}</h3>
                  <p className="text-blue-700">{selectedReport.personalizedInsights.content}</p>
                </div>
              )}
              
              {/* 总体评估 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedReport.overallAssessment.title}</h3>
                <p className="text-gray-700">{selectedReport.overallAssessment.content}</p>
              </div>
              
              {/* BMI健康评估 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedReport.bmiAssessment.title}</h3>
                <p className="text-gray-700">{selectedReport.bmiAssessment.content}</p>
              </div>
              
              {/* 饮食结构分析 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedReport.dietAnalysis.title}</h3>
                <p className="text-gray-700">{selectedReport.dietAnalysis.content}</p>
              </div>
              
              {/* 健康趋势分析 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedReport.trendAnalysis.title}</h3>
                <p className="text-gray-700">{selectedReport.trendAnalysis.content}</p>
              </div>
              
              {/* 营养分析 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">营养分析</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedReport.nutrition.calories}kcal</div>
                    <div className="text-sm text-gray-600">总热量</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedReport.nutrition.protein}g</div>
                    <div className="text-sm text-gray-600">蛋白质</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedReport.nutrition.carbs}g</div>
                    <div className="text-sm text-gray-600">碳水化合物</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedReport.nutrition.fat}g</div>
                    <div className="text-sm text-gray-600">脂肪</div>
                  </div>
                </div>
              </div>
              
              {/* 健康建议 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">健康建议</h3>
                <div className="space-y-4">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="border-l-4 border-success pl-4 py-1">
                      <h4 className="font-medium text-gray-800">{rec.title}</h4>
                      <p className="text-gray-700">{rec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 陕西文化贴士 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">陕西文化贴士</h3>
                <ul className="space-y-2">
                  {selectedReport.culturalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="text-warning mr-2">?</div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- [修复] AI助手对话组件 ---
const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: '您好！我是您的AI健康饮食助手，专注于陕西传统文化与健康饮食的结合。我可以为您提供饮食建议、文化知识、节气食谱等信息。有什么我可以帮您的吗？' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // 存储上传的图片
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 调用智能体API
  const API_URL = 'http://47.86.161.122:8000/run';

  const callAPI = async (text, imageFile = null) => {
    try {
      let options = {};

      if (imageFile) {
        // 📸 情况 A: 有图片，使用 FormData (自动适配 multipart/form-data)
        const formData = new FormData();
        formData.append('text', text);
        formData.append('image', imageFile); // 把原始文件放进去

        options = {
          method: 'POST',
          body: formData,
          // 注意：发 FormData 时，千万不要手动设置 Content-Type，浏览器会自动处理
        };
      } else {
        // 📝 情况 B: 只有文字，使用 JSON
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: text }]
          }),
        };
      }

      const response = await fetch(API_URL, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || "未获取到有效回复";

    } catch (error) {
      console.error("API调用失败:", error);
      return "抱歉，系统暂时无法响应，请检查后端连接。";
    }
  };



    const handleSendMessage = async () => {
    // 如果没有输入且没有图片，直接返回
    if (inputValue.trim() === '' && uploadedImages.length === 0) return;

    const currentText = inputValue;
    const currentImages = [...uploadedImages]; // 复制一份当前的图片列表
    
    // 1. 设置用户消息显示
    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      content: currentText,
      images: currentImages,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setUploadedImages([]); // 清空上传区
    setIsTyping(true);

    try {
      // 2. 准备发送的数据
      // 目前后端只支持一次传一张图，我们取第一张
      const imageToSend = currentImages.length > 0 ? currentImages[0].originFile : null;

      // 3. 调用 API
      const aiResponseText = await callAPI(currentText, imageToSend);

      // 4. 显示 AI 回复
      const newAiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMsg]);

    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: "发生错误，请重试。",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  // 图片上传处理
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // 使用 URL.createObjectURL 生成预览，既快又保留了原始 file 对象
        const newImage = {
          id: Date.now(),
          url: URL.createObjectURL(file), 
          name: file.name,
          originFile: file // 👈 关键：保存原始文件对象，发送时要用
        };
        setUploadedImages(prev => [...prev, newImage]);
      });
    }
  };


  // 其他代码保持不变...
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-5/6 flex flex-col shadow-2xl">
        {/* 顶部栏 */}
        <div className="bg-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="m-0 text-lg font-bold">AI健康饮食助手</h3>
              <p className="m-0 text-xs opacity-80">专注于陕西传统文化与健康饮食</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}
                >
                  {/* 渲染图片 */}
                  {message.images && message.images.length > 0 && (
                    <div className="mb-2 flex gap-2 flex-wrap">
                      {message.images.map(img => (
                        <img 
                          key={img.id}
                          src={img.url}
                          alt={img.name}
                          className="max-w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  {/* 渲染文本内容 */}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {/* 图片预览 */}
          {uploadedImages.length > 0 && (
            <div className="mb-2 flex gap-2 flex-wrap">
              {uploadedImages.map(img => (
                <div key={img.id} className="relative">
                  <img 
                    src={img.url}
                    alt={img.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedImages(prev => prev.filter(i => i.id !== img.id))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            {/* 图片上传按钮 */}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-xl px-3 flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              ?
            </label>
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题，或上传食物图片..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' && uploadedImages.length === 0}
              className={`bg-primary text-white px-6 rounded-xl flex items-center justify-center ${
                (inputValue.trim() === '' && uploadedImages.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
              }`}
            >
              <span className="font-bold">发送</span>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            ? 支持文本咨询和图片识别（上传食物图片分析营养）
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. 布局结构 (修改版：左侧导航 + 顶部标题栏)
// ==========================================

// 侧边栏按钮组件
const SidebarItem = ({ label, icon, active, onClick }) => (
  <div 
    onClick={onClick} 
    className={`p-4 cursor-pointer flex items-center gap-3 text-lg ${
      active 
        ? 'bg-primary-light text-primary border-r-2 border-primary' 
        : 'text-gray-600'
    } hover:bg-gray-50 transition-colors`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </div>
);

function App() {
  const [activePage, setActivePage] = useState(userDb.isLoggedIn() ? 'home' : 'login'); // 初始页面根据登录状态决定
  const [dietList, setDietList] = useState(db.getDietRecords());
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // 登录成功回调
  const handleLoginSuccess = (user) => {
    db.updateUserInfo(user);
    setActivePage('home');
  };

  // 退出登录
  const handleLogout = () => {
    userDb.logout();
    setActivePage('login');
  };

  // 监听URL hash变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#historical-data') {
        setActivePage('historical-data');
      } else if (hash === '#health-goals') {
        setActivePage('health-goals');
      } else if (hash === '#login') {
        setActivePage('login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始化

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 通用添加方法（保持功能不变）
  const handleAddToDiet = (foodItem) => {
    const updatedList = db.addDietRecord(foodItem);
    setDietList(updatedList);
  };

  // 删除饮食记录
  const handleDeleteDiet = (id) => {
    const updatedList = db.deleteDietRecord(id);
    setDietList(updatedList);
  };

  return (
    // 1. 最外层容器：Flex纵向排列，占满全屏
    <div className="font-sans bg-background h-screen flex flex-col overflow-hidden">
      {/* 如果用户未登录，只显示登录注册页面 */}
      {!userDb.isLoggedIn() && activePage !== 'login' && (
        <LoginRegisterView onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 登录后显示主界面 */}
      {(userDb.isLoggedIn() || activePage === 'login') && (
        <>
          {/* 顶部导航栏 - 如果已登录则显示完整导航 */}
          {userDb.isLoggedIn() && (
            <header className="bg-primary h-16 flex items-center justify-between px-6 shadow-lg z-20 text-white">
              {/* 左上方：标题 */}
              <div className="flex items-center font-bold text-xl">
                 <span className="mr-3 bg-white text-primary w-9 h-9 rounded-full flex items-center justify-center text-2xl shadow-md">食</span>
                 AI健康饮食 · 陕西文化
              </div>

              {/* 右上方：登录/用户信息 */}
              <div className="flex items-center gap-5">
                 <Bell className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100" />
                 <div className="flex items-center gap-2.5 cursor-pointer bg-white bg-opacity-20 px-4 py-1.5 rounded-full transition-colors hover:bg-opacity-30">
                    <div className="w-7 h-7 bg-gray-400 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={db.getUserInfo().avatar} 
                        alt="user" 
                        className="w-full h-full" 
                      />
                    </div>
                    <span className="text-white text-sm font-medium">{db.getUserInfo().name}</span>
                 </div>
              </div>
            </header>
          )}

          {/* 3. 下方主体内容 (Body) */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* 左侧：竖排导航栏 (Sidebar) - 仅在登录后显示 */}
            {userDb.isLoggedIn() && (
              <aside className="w-60 bg-white shadow-lg flex flex-col pt-5 z-10">
                {/* 搜索框 */}
                <div className="px-5 pb-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="搜索功能..." 
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 outline-none box-border"
                    />
                  </div>
                </div>

                {/* 导航菜单 */}
                <div className="flex-1 overflow-y-auto">
                  <SidebarItem label="首页概览" icon={<Home className="w-5 h-5" />} active={activePage === 'home'} onClick={() => setActivePage('home')} />
                  <SidebarItem label="AI识食" icon={<Camera className="w-5 h-5" />} active={activePage === 'recognition'} onClick={() => setActivePage('recognition')} />
                  <SidebarItem label="节气饮食" icon={<Calendar className="w-5 h-5" />} active={activePage === 'season'} onClick={() => setActivePage('season')} />
                  <SidebarItem label="文化传承" icon={<BookOpen className="w-5 h-5" />} active={activePage === 'culture'} onClick={() => setActivePage('culture')} />
                  <SidebarItem label="个人中心" icon={<User className="w-5 h-5" />} active={activePage === 'report'} onClick={() => setActivePage('report')} />
                </div>

                {/* 底部设置 */}
                <div className="px-5 py-5 border-t border-gray-200 text-gray-500 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                   <LogOut className="w-4 h-4" onClick={handleLogout}/> 退出登录
                </div>
              </aside>
            )}

            {/* 右侧：主内容区域 (Main) */}
            <main className={`flex-1 overflow-y-auto p-8 bg-background relative ${userDb.isLoggedIn() ? '' : 'hidden'}`}>
              {/* 页面路由渲染 */}
              {activePage === 'home' && <HomeView toPage={setActivePage} />}
              {activePage === 'recognition' && <RecognitionView onAdd={handleAddToDiet} />}
              {activePage === 'season' && <SeasonalView onAdd={handleAddToDiet} />}
              {activePage === 'culture' && <CultureView />}
              {activePage === 'report' && <PersonalCenterView dietList={dietList} onDelete={handleDeleteDiet} />}
              {activePage === 'historical-data' && <HistoricalDataView />}
              {activePage === 'health-goals' && <HealthGoalsView />}
              {activePage === 'login' && <LoginRegisterView onLoginSuccess={handleLoginSuccess} />}
            </main>
          </div>
          
          {/* 悬浮助手按钮 - 仅在登录后显示 */}
          {userDb.isLoggedIn() && (
            <div 
              onClick={() => setIsAIAssistantOpen(true)}
              className="fixed bottom-10 right-10 bg-success text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center gap-2 z-40 font-bold hover:bg-success-dark transition-colors"
            >
              <span>✨</span> AI助手
            </div>
          )}

          {/* AI助手对话框 - 仅在登录后显示 */}
          {userDb.isLoggedIn() && (
            <AIAssistant 
              isOpen={isAIAssistantOpen} 
              onClose={() => setIsAIAssistantOpen(false)} 
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;