import {BASE_URL} from "../config/config";

export const  GET_SUPERVISE_STATISTIC_LIST=BASE_URL+'/analysis/v1/inspectionStatistics/getList'; //获取区级督办督查统计列表

export const GET_ASSESSMENT_STATISTICS_LIST=BASE_URL+'/statistic/v1/statistic/regionStatistic';// 获取考核统计列表

export const GET_ASSESSMENT_RATE=BASE_URL+'/assessment/v1/assessScorePercent/detail'; // 获取考核评估评分比重

export const UPDATE_ASSEMENT_SCORE=BASE_URL+'/statistic/v1/statistic/updateResultScore'; // 更新月度考核总成绩

export const GET_RIVER_AMOUNT_LIST=BASE_URL+'/analysis/v1/supervise/riverLakePondList'; //获取河湖数量接口

export const EXPORT_RIVER_AMOUNT=BASE_URL+'/analysis/v1/supervise/createExcelRiverLakePond';//导出河湖数量
