import {BASE_URL} from "../config/config";

export const GET_PROBLEM_LIST=BASE_URL+'/eventMgr/v1/event/toDoTasks'; // 获取待办问题列表

export const GET_PROBLEM_TYPE=BASE_URL+'/eventMgr/v1/event/getEventTypes';// 获取问题类型

export const GET_NOT_HANDLED_ON_TIME_EVENT_LIST=BASE_URL+'/eventMgr/v1/event/list/OutDeadtimeEvent';// 获取未及时处理问题列表

export const GET_REGION_LIST=BASE_URL+'/patrolMgr/chairmanOnline/v1/regionArea';// 获取区域列表

export const GET_EVENT_LIST=BASE_URL+'/resumption/v1/resumption/listProblemStatistic';// 获取问题事件统计列表

export const GET_PATROL_AND_ONLINE_DATA=BASE_URL+'/patrolMgr/chairmanOnline/v1/countHZStatus/';// 获取在线或者巡河数据
