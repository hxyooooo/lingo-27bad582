from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI(title="AI健康饮食与陕西传统文化融合应用API")

# 添加CORS中间件，允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)

# 数据模型
class FoodRecord(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    calories: int
    protein: float
    carbs: float
    fat: float
    timestamp: str
    image_url: Optional[str] = None

class HealthData(BaseModel):
    weight: float
    height: float
    age: int
    gender: str
    activity_level: str

class HealthReport(BaseModel):
    id: Optional[str] = None
    date: str
    overall_score: int
    bmi: float
    bmi_status: str
    nutrition_analysis: dict
    health_tips: List[str]
    cultural_tips: List[str]

# 模拟数据库
FOOD_RECORDS_FILE = "data/food_records.json"
HEALTH_REPORTS_FILE = "data/health_reports.json"

# 初始化数据目录
os.makedirs("data", exist_ok=True)

# 初始化数据文件
def init_data_files():
    if not os.path.exists(FOOD_RECORDS_FILE):
        with open(FOOD_RECORDS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False)
    
    if not os.path.exists(HEALTH_REPORTS_FILE):
        with open(HEALTH_REPORTS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False)

# 读取食物记录
def read_food_records():
    with open(FOOD_RECORDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# 保存食物记录
def save_food_records(records):
    with open(FOOD_RECORDS_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

# 读取健康报告
def read_health_reports():
    with open(HEALTH_REPORTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# 保存健康报告
def save_health_reports(reports):
    with open(HEALTH_REPORTS_FILE, "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)

@app.on_event("startup")
def startup_event():
    init_data_files()

# API路由
@app.get("/")
def read_root():
    return {"message": "AI健康饮食与陕西传统文化融合应用API"}

@app.get("/api/food-records")
def get_food_records():
    records = read_food_records()
    return {"records": records}

@app.post("/api/food-records")
def add_food_record(record: FoodRecord):
    records = read_food_records()
    record.id = str(len(records) + 1)
    record.timestamp = datetime.now().isoformat()
    records.append(record.dict())
    save_food_records(records)
    return {"message": "食物记录添加成功", "record": record}

@app.delete("/api/food-records/{record_id}")
def delete_food_record(record_id: str):
    records = read_food_records()
    records = [r for r in records if r["id"] != record_id]
    save_food_records(records)
    return {"message": "食物记录删除成功"}

@app.put("/api/food-records/{record_id}")
def update_food_record(record_id: str, updated_record: FoodRecord):
    records = read_food_records()
    for i, record in enumerate(records):
        if record["id"] == record_id:
            records[i] = {**record, **updated_record.dict(exclude_unset=True)}
            records[i]["id"] = record_id  # 确保ID不变
            save_food_records(records)
            return {"message": "食物记录更新成功", "record": records[i]}
    
    raise HTTPException(status_code=404, detail="食物记录未找到")

@app.get("/api/health-reports")
def get_health_reports():
    reports = read_health_reports()
    return {"reports": reports}

@app.post("/api/health-reports")
def generate_health_report(health_data: HealthData):
    reports = read_health_reports()
    
    # 计算BMI
    height_m = health_data.height / 100
    bmi = round(health_data.weight / (height_m * height_m), 2)
    
    # BMI状态
    if bmi < 18.5:
        bmi_status = "偏瘦"
    elif 18.5 <= bmi < 24:
        bmi_status = "正常"
    elif 24 <= bmi < 28:
        bmi_status = "超重"
    else:
        bmi_status = "肥胖"
    
    # 营养分析
    nutrition_analysis = {
        "calories_recommendation": "根据您的身体数据，建议每日摄入约2000卡路里",
        "protein_intake": "建议每日蛋白质摄入量约为体重(kg)的1.2-1.6倍",
        "carbs_fat_balance": "建议碳水化合物占总热量50-65%，脂肪占20-30%"
    }
    
    # 健康贴士
    health_tips = [
        "保持规律作息，每日饮水充足",
        "适量运动，每周至少150分钟中等强度运动",
        "均衡膳食，多摄入蔬菜水果"
    ]
    
    # 陕西文化贴士
    cultural_tips = [
        "陕西传统饮食注重五味调和，可适当加入当地特色食材",
        "关中地区传统养生理念强调顺应节气调整饮食",
        "陕北特色杂粮如小米、荞麦等营养价值丰富"
    ]
    
    report = HealthReport(
        id=str(len(reports) + 1),
        date=datetime.now().strftime("%Y-%m-%d"),
        overall_score=85,
        bmi=bmi,
        bmi_status=bmi_status,
        nutrition_analysis=nutrition_analysis,
        health_tips=health_tips,
        cultural_tips=cultural_tips
    )
    
    reports.append(report.dict())
    save_health_reports(reports)
    
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)