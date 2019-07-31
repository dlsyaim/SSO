import {BASE_URL} from "../config/config";

export const  GET_SUPERVISE_STATISTIC_LIST=BASE_URL+'/analysis/v1/inspectionStatistics/getList'; //获取区级督办督查统计列表

export const GET_RIVER_AMOUNT_LIST=BASE_URL+'/analysis/v1/supervise/riverLakePondList'; //获取河湖数量接口

export const EXPORT_RIVER_AMOUNT=BASE_URL+'/analysis/v1/supervise/createExcelRiverLakePond';//导出河湖数量
