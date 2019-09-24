import {BASE_URL} from "../config/config";

export const GET_RIVER_CHIEF_DIRECTORY_LIST=BASE_URL+'/watersource/v1/reachChairMan/list'; //获取河长名录列表

export const DELETE_RIVER_CHIEF=BASE_URL+'/watersource/v1/reachChairMan/delete'; //删除河长

export const GET_RIVER_CHIEF_DETAIL=BASE_URL+'/watersource/v1/reachChairMan/detail';//河长详情

export const GET_RIVER_CHIEF_TYPE=BASE_URL+'/watersource/v1/reach/chairmanType';// 获取河长类型

export const GET_RIVER_CHIEF_ROLE_LIST=BASE_URL+'/watersource/v1/reachChairMan/roleList'; //获取角色类型

export const GET_RIVER_CHIEF_GRADE=BASE_URL+'/watersource/v1/river/riverType';//获取河长级别

export const GET_ONE_RIVER_ONE_POLICY_LIST=BASE_URL+'/watersource/v1/doc/list'; //获取一河一策列表
