import React, { useState, useRef, useEffect } from 'react';
import { Camera, Calendar, BookOpen, User, Home, Settings, Search, Bell, Menu, X, Plus, AlertTriangle, CheckCircle, TrendingUp, Target, MessageSquare, HelpCircle, LogOut, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

// ==========================================
// 1. 数据库模拟 (使用localStorage)
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
// 2. 全局数据准备
// ==========================================

// --- 文化传承数据 (非遗长廊) ---
const heritageData = [
  {
    id: 1,
    title: '陕西皮影戏',
    category: '民间美术 / 国家级非遗',
    image: 'https://img95.699pic.com/photo/50064/0488.jpg_wh860.jpg',
    desc: '一口叙说千古事，双手对舞百万兵。',
    detail: '陕西皮影戏起源于汉代，兴盛于唐宋。其造型质朴单纯，富于装饰性，同时又具有精致工巧的艺术特色。表演时，艺人们在白色幕布后面，一边操纵影人，一边用秦腔讲述故事，吼出西北汉子的豪迈。',
    videoUrl: 'https://www.bilibili.com/video/BV1Ax411w7F6/'
  },
  {
    id: 2,
    title: '秦腔',
    category: '传统戏剧 / 国家级非遗',
    image: 'https://img95.699pic.com/photo/50046/5569.jpg_wh860.jpg', 
    desc: '八百里秦川尘土飞扬，三千万老陕齐吼秦腔。',
    detail: '秦腔，别称"邦子腔"，是中国西北最古老的戏剧之一。其特点是高昂激越、强烈急促。听秦腔，能感受到关中八百里秦川的厚重与沧桑，是国家级非物质文化遗产。',
    videoUrl: 'https://www.bilibili.com/video/BV1Qs411N7vK/'
  },
  {
    id: 3,
    title: '凤翔泥塑',
    category: '传统技艺 / 宝鸡',
    image: 'https://img95.699pic.com/photo/50160/3277.jpg_wh860.jpg',
    desc: '色彩艳丽，造型夸张，寓意驱邪避灾。',
    detail: '凤翔泥塑汲取了古代石刻、年画、剪纸和刺绣的纹饰，造型夸张，色彩鲜艳，深受人们喜爱。其中以"挂虎"和"坐虎"最为典型，寓意驱邪避灾，吉祥如意。',
    videoUrl: 'https://www.bilibili.com/video/BV1UW411M7Sg/'
  },
  {
    id: 4,
    title: '安塞腰鼓',
    category: '民俗舞蹈 / 延安',
    image: 'https://img95.699pic.com/photo/40007/3569.jpg_wh860.jpg', 
    desc: '黄土高原上的"第一鼓"，气势磅礴。',
    detail: '安塞腰鼓是黄土高原上的一种独特的民间大型舞蹈艺术形式，具有2000年以上的历史。表演可由几人或上千人一同进行，磅礴的气势，精湛的技艺，使人叹为观止。',
    videoUrl: 'https://www.bilibili.com/video/BV1Mx411w7nQ/'
  },
  {
    id: 5,
    title: '同州梆子',
    category: '传统戏剧 / 渭南',
    image: 'https://img95.699pic.com/photo/50055/5638.jpg_wh860.jpg',
    desc: '秦腔的鼻祖，唱腔激越豪放。',
    detail: '同州梆子是陕西省东府渭南地区的地方戏曲剧种，是秦腔的前身。它保留了更多古老的音韵和表演程式，具有极高的艺术研究价值。',
    videoUrl: '#'
  },
  {
    id: 6,
    title: '耀州窑陶瓷',
    category: '传统技艺 / 铜川',
    image: 'https://img95.699pic.com/photo/50059/8966.jpg_wh860.jpg',
    desc: '巧如范金，精比琢玉，北方青瓷代表。',
    detail: '耀州窑是中国传统制瓷工艺中的珍品，宋代六大窑系。其刀法犀利流畅，线条刚劲有力，素有"北方青瓷之冠"的美誉。',
    videoUrl: '#'
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
      { name: '春饼卷素', calories: 320, desc: '薄饼卷土豆丝、豆芽，寓意咬住春天', icon: '🌯' },
      { name: '凉拌萝卜丝', calories: 80, desc: '清脆爽口，顺气消食，谓之"咬春"', icon: '🥕' },
      { name: '韭菜炒鸡蛋', calories: 260, desc: '春令时鲜，助阳生发', icon: '🥚' }
    ]
  },
  qingming: {
    name: '清明',
    date: '4月4日-6日',
    color: '#13c2c2',
    intro: '清明时节雨纷纷，万物生长此时洁净而明清。此时节气温转暖，但早晚仍有凉意。饮食宜温和，多吃柔肝养肺的食物。陕西关中地区有吃"寒食"的遗风，如凉皮、凉面等。',
    foods: [
      { name: '青团', calories: 220, desc: '艾草汁和面，清淡幽香，软糯可口', icon: '🟢' },
      { name: '秦镇凉皮', calories: 280, desc: '清明吃凉，酸辣开胃，关中特色', icon: '🍜' },
      { name: '螺蛳肉', calories: 150, desc: '清明螺，抵只鹅，肉质肥美', icon: '🐚' }
    ]
  },
  dashu: {
    name: '大暑',
    date: '7月22日-24日',
    color: '#fa8c16',
    intro: '大暑是全年最热的节气，"湿热交蒸"在此时达到顶点。饮食应以清热解暑、健脾利湿为主。老陕人喜欢在夏天喝绿豆汤、吃浆水鱼鱼，既解暑又开胃。',
    foods: [
      { name: '绿豆百合汤', calories: 120, desc: '消暑止渴，清心安神', icon: '🥣' },
      { name: '浆水鱼鱼', calories: 180, desc: '酸香爽滑，也是陕西夏日消暑神器', icon: '🐟' },
      { name: '苦瓜炒肉', calories: 240, desc: '苦味入心，清热祛火', icon: '🥒' }
    ]
  },
  dongzhi: {
    name: '冬至',
    date: '12月21日-23日',
    color: '#1890ff',
    intro: '冬至是"阴极之至，阳气始生"的重要节气。在陕西，冬至地位极高，所谓"冬至大如年"。最核心的习俗就是吃饺子，寓意消寒，不冻耳朵；陕北地区则有喝羊肉汤的习惯，以此温补阳气。',
    foods: [
      { name: '酸汤水饺', calories: 450, desc: '冬至不端饺子碗，冻掉耳朵没人管', icon: '🥟' },
      { name: '铁锅炖羊肉', calories: 500, desc: '温中暖肾，抵御严寒', icon: '🥘' },
      { name: '八宝粥', calories: 300, desc: '五谷杂粮，健脾养胃', icon: '🥣' }
    ]
  }
};

// ==========================================
// 3. 页面组件
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

// --- AI识食 ---
const RecognitionView = ({ onAdd }) => {
  const [imgPreview, setImgPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const mockDatabase = [
    { name: '腊汁肉夹馍', calories: 455, unit: '个', intro: '陕西省非物质文化遗产，中式汉堡。', recipe: '老卤炖煮五花肉，白吉馍烤制酥脆。' },
    { name: '羊肉泡馍', calories: 560, unit: '碗', intro: '苏轼赞誉"秦烹唯羊羹"。', recipe: '羊骨熬汤，死面烙饼，配糖蒜辣酱。' },
    { name: '秦镇米皮', calories: 280, unit: '份', intro: '色白光润，皮薄筋道，酸辣味浓。', recipe: '大米磨浆蒸制，切条拌入秘制调料。' }
  ];

  const handleBtnClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
        setStatus('loading');
        setTimeout(() => {
          const isSuccess = Math.random() > 0.1; 
          if (isSuccess) {
            const randomDish = mockDatabase[Math.floor(Math.random() * mockDatabase.length)];
            setResult(randomDish);
            setStatus('success');
          } else {
            setStatus('error');
          }
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToDiet = () => {
    if(onAdd) {
        onAdd(result);
        alert(`成功！已将【${result.name}】加入个人中心的饮食清单。`);
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
                    <div className="text-4xl mb-2">🤖</div>
                    <div className="text-primary font-bold">AI 正在分析...</div>
                  </div>
                )}
              </>
            ) : (
              <><div className="text-6xl text-gray-300 mb-2">📷</div><div className="text-gray-500">点击上传图片</div></>
            )}
          </div>
          <div className="mt-5">
             <button 
               onClick={handleBtnClick} 
               className="px-8 py-3 bg-primary text-white border-none rounded-lg text-lg cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
             >
               {imgPreview ? '🔄 重新上传' : '📤 上传图片'}
             </button>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] text-left">
          {status === 'idle' && (
             <div className="bg-white p-10 rounded-2xl h-88 flex flex-col justify-center items-center text-gray-500 shadow-md">
               <div className="text-5xl mb-5 opacity-50">📊</div>
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
                 <h4 className="m-0 mb-2 text-gray-600">💡 介绍</h4>
                 <p className="m-0 text-gray-700">{result.intro}</p>
               </div>
               <div className="mb-8">
                 <h4 className="m-0 mb-2 text-gray-600">🍲 做法概览</h4>
                 <div className="bg-gray-50 p-4 rounded-lg text-gray-600">{result.recipe}</div>
               </div>
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
              <p className="m-0 text-gray-600 text-center max-w-xs">未检测到已知的陕西非遗菜品，请确保图片清晰，主体完整。</p>
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
        <h2 className="text-3xl text-gray-800 m-0">📅 节气饮食推荐</h2>
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
      <h3 className="text-2xl text-gray-800 mb-5 ml-2.5">🍽 推荐食谱</h3>
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
        <h2 className="text-3xl text-gray-800 m-0">🏛 陕西非遗文化长廊</h2>
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
                <h4 className="m-0 mb-2.5 text-gray-600">📖 详细介绍</h4>
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

// --- 个人中心 ---
const PersonalCenterView = ({ dietList = [] }) => {
  const [activeTab, setActiveTab] = useState('diet');
  const [healthReports, setHealthReports] = useState([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const safeList = Array.isArray(dietList) ? dietList : [];
  const userInfo = db.getUserInfo();
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
      const newReport = {
        id: Date.now(),
        date: new Date().toISOString(),
        summary: `根据您今日的饮食情况，总热量摄入${totalCalories}kcal，占目标${Math.round((totalCalories / userInfo.targetCalories) * 100)}%。`,
        recommendations: [
          `您今日摄入的热量为${totalCalories}kcal，${totalCalories > userInfo.targetCalories ? '略高于' : '符合'}目标摄入量${userInfo.targetCalories}kcal。`,
          '建议增加蔬菜摄入，保持营养均衡。',
          '继续保持良好的饮食习惯。'
        ],
        nutrition: {
          protein: Math.floor(totalCalories * 0.15), // 假设蛋白质占15%
          carbs: Math.floor(totalCalories * 0.55),   // 假设碳水化合物占55%
          fat: Math.floor(totalCalories * 0.30)      // 假设脂肪占30%
        },
        culturalTips: [
          '陕西传统饮食注重五味调和，今日推荐搭配一些时令蔬菜。',
          '根据节气养生，当前时节适合清淡饮食，避免过于油腻。'
        ]
      };
      
      const updatedReports = db.addHealthReport(newReport);
      setHealthReports(updatedReports);
      setIsGeneratingReport(false);
    }, 2000);
  };

  const MenuItem = ({ icon, title, isRed, onClick }) => (
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
              <div className="text-5xl mb-2.5">📝</div>
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
              <div className="text-5xl mb-2.5">📊</div>
              <div>暂无健康报告</div>
              <div className="text-xs mt-1.5">点击上方按钮生成今日健康报告</div>
            </div>
          ) : (
            <div className="space-y-4">
              {healthReports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setSelectedReport(report)}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">
                        {format(new Date(report.date), 'yyyy年MM月dd日')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {report.summary}
                      </div>
                    </div>
                    <div className="text-xs bg-success-light text-success px-2 py-1 rounded">
                      已生成
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
        <MenuItem icon="📊" title="历史数据统计" />
        <MenuItem icon="🎯" title="健康目标设置" />
        <MenuItem icon="📱" title="消息通知" />
        <MenuItem icon="🔧" title="系统设置" />
        <MenuItem icon="❓" title="帮助与反馈" />
        <MenuItem icon="🚪" title="退出登录" isRed />
      </div>

      {/* 健康报告详情弹窗 */}
      {selectedReport && (
        <div 
          onClick={() => setSelectedReport(null)}
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-90vh overflow-y-auto shadow-2xl"
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
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">总体评估</h3>
                <p className="text-gray-700">{selectedReport.summary}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">营养分析</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedReport.nutrition.protein}g</div>
                    <div className="text-sm text-gray-600">蛋白质</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedReport.nutrition.carbs}g</div>
                    <div className="text-sm text-gray-600">碳水化合物</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedReport.nutrition.fat}g</div>
                    <div className="text-sm text-gray-600">脂肪</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">健康建议</h3>
                <ul className="space-y-2">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="text-success mr-2">✓</div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">陕西文化贴士</h3>
                <ul className="space-y-2">
                  {selectedReport.culturalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="text-warning mr-2">💡</div>
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

// --- [新增] AI助手对话组件 ---
const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: '您好！我是您的AI健康饮食助手，专注于陕西传统文化与健康饮食的结合。我可以为您提供饮食建议、文化知识、节气食谱等信息。有什么我可以帮您的吗？' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟AI回复
  const getAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // 针对陕西饮食文化的回复
    if (lowerMsg.includes('陕西') || lowerMsg.includes('文化') || lowerMsg.includes('非遗')) {
      return '陕西有着丰富的饮食文化，比如腊汁肉夹馍、羊肉泡馍、秦镇米皮等都是陕西省非物质文化遗产。这些美食不仅美味，还承载着深厚的历史文化内涵。';
    }
    
    // 针对节气饮食的回复
    if (lowerMsg.includes('节气') || lowerMsg.includes('季节') || lowerMsg.includes('饮食')) {
      return '根据二十四节气调整饮食是中医养生的重要理念。比如立春宜吃春饼，清明宜吃青团，大暑宜喝绿豆汤，冬至宜吃饺子。这些传统食俗既符合时令特点，又有利于身体健康。';
    }
    
    // 针对健康饮食的回复
    if (lowerMsg.includes('健康') || lowerMsg.includes('营养') || lowerMsg.includes('热量')) {
      return '健康饮食需要均衡搭配，适量摄入蛋白质、碳水化合物和脂肪。陕西传统美食中，肉夹馍提供蛋白质，米皮富含碳水化合物，搭配蔬菜可以实现营养均衡。';
    }
    
    // 针对AI识食的回复
    if (lowerMsg.includes('拍照') || lowerMsg.includes('识别') || lowerMsg.includes('菜品')) {
      return '您可以使用我们的AI识食功能，只需上传一张陕西传统美食的图片，系统就能识别菜品名称、热量和制作方法。非常方便！';
    }
    
    // 默认回复
    return '关于陕西传统文化与健康饮食，我可以为您提供很多有用的信息。您可以问我关于陕西非遗美食、节气饮食、营养搭配等方面的问题。';
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // 添加用户消息
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // 模拟AI回复延迟
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: getAIResponse(inputValue)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

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
                  {message.content}
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
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="2"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              className={`bg-primary text-white px-6 rounded-xl flex items-center justify-center ${
                inputValue.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
              }`}
            >
              <span className="font-bold">发送</span>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            您可以询问陕西非遗美食、节气饮食、营养搭配等相关问题
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. 布局结构 (修改版：左侧导航 + 顶部标题栏)
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
  const [activePage, setActivePage] = useState('home');
  const [dietList, setDietList] = useState(db.getDietRecords());
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

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
      
      {/* 2. 顶部导航栏 (Header) */}
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
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" className="w-full h-full" />
              </div>
              <span className="text-white text-sm font-medium">用户管理员</span>
           </div>
        </div>
      </header>

      {/* 3. 下方主体内容 (Body) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 左侧：竖排导航栏 (Sidebar) */}
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
             <Settings className="w-4 h-4" /> 系统设置
          </div>
        </aside>

        {/* 右侧：主内容区域 (Main) */}
        <main className="flex-1 overflow-y-auto p-8 bg-background relative">
          {/* 页面路由渲染 */}
          {activePage === 'home' && <HomeView toPage={setActivePage} />}
          {activePage === 'recognition' && <RecognitionView onAdd={handleAddToDiet} />}
          {activePage === 'season' && <SeasonalView onAdd={handleAddToDiet} />}
          {activePage === 'culture' && <CultureView />}
          {activePage === 'report' && <PersonalCenterView dietList={dietList} onDelete={handleDeleteDiet} />}
        </main>
      </div>
      
      {/* 悬浮助手按钮 */}
      <div 
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-10 right-10 bg-success text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center gap-2 z-40 font-bold hover:bg-success-dark transition-colors"
      >
        <span>✨</span> AI助手
      </div>

      {/* AI助手对话框 */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
}

export default App;