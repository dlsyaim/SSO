import {BASE_URL} from "../config/config";

export const GET_PROBLEM_LIST=BASE_URL+'/eventMgr/v1/event/toDoTasks'; // 获取待办问题列表

export const GET_PROBLEM_TYPE=BASE_URL+'/eventMgr/v1/event/getEventTypes';// 获取问题类型

export const GET_NOT_HANDLED_ON_TIME_EVENT_LIST=BASE_URL+'/eventMgr/v1/event/list/OutDeadtimeEvent';// 获取未及时处理问题列表
