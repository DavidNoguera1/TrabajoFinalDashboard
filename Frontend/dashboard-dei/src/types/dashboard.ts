export interface KPIData {
  averageGrade: number;
  riskPercentage: number;
  resourceUsage: number;
  averageHours: number;
}

export interface ScatterData {
  student: string;
  hours: number;
  grade: number;
}

export interface ResourceData {
  resource: string;
  usage: number;
}

export interface TrendData {
  semester: string;
  average: number;
}