import {BASE_URL} from "../config/config";

export const GET_RIVER_PATROL_COUNT=BASE_URL+'/patrolMgr/chairmanOnline/v1/countHZOnline';//获取巡河次数

export const GET_PUBLISH_LIST=BASE_URL+'/bulletin/v1/bulletin/selectByFirst'; //获取发布信息列表

export const GET_PUBLISH_DETAIL=BASE_URL+'/bulletin/v1/bulletin/detail';//获取发布信息详情

export const GET_MONTH_RANK=BASE_URL+'/statistic/v1/statistic/regionStatistic';//获取区域考核排名

export const GET_WATER_QUALITY=BASE_URL+'/quality/v1/WaterQualityGrade/selectWaterQualityPercent'; //获取水质质量

export const GET_PROBLEM_SUMMARY_LIST=BASE_URL+'/resumption/v1/resumption/listWithMoreProblemReach'; //获取问题汇总列表

export const GET_RIVER_PATROL_AND_ONLINE_DETAIL=BASE_URL+'/patrolMgr/chairmanOnline/v1/search/';// 获取在线和巡河地理坐标，用于地图绘制
