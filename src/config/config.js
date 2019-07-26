/**
 * api根路径
 * @type {string}
 */
export const BASE_URL='http://39.106.76.142';

/**
 * 上传文件接口
 * @type {string}
 */
export const UPLOAD_URL='http://60.28.163.75/inform/v1/informReport/upload';

export const FILE_URL_PReFIX='http://60.28.163.75:6001';

/**
 * 表格常用默认分页配置
 */
export const tablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total:0,
  showSizeChanger: true,
  showQuickJumper: true,
};

/**
 * 菜单列表
 * @type {*[]}
 */
export const menuList = [
  {id: 1, funcUrl: 'river-patrol', icon: 'file', name: '巡河管理', children: []},
  {
    id: 2,
    funcUrl: 'problem',
    icon: 'file', name: '问题管理',
    children: [
      {id: 20, funcUrl: 'wait-to-deal', icon: 'file', name: '待办问题',children:[]},
      {id: 21, funcUrl: 'problem-tracking', icon: 'file', name: '问题跟踪',children:[]},
      {id: 22, funcUrl: 'river-patrol', icon: 'file', name: '综合查询',children:[]},
      {id: 23, funcUrl: 'river-patrol', icon: 'file', name: '日常抽查',children:[]},
      {id: 24,
        funcUrl: 'river-patrol',
        icon: 'file',
        name: '巡查问题列表',
        children:[
          {id:240,funcUrl:'234',name:'三级标题1'},
          {id:241,funcUrl:'234',name:'三级标题2'}
        ]
      },
    ]
  },
  {id: 3, funcUrl: 'river-patrol', icon: 'file', name: '考核评估', children: []},
  {id: 4, funcUrl: 'river-patrol', icon: 'file', name: '分析统计', children: []},
  {id: 5, funcUrl: 'river-patrol', icon: 'file', name: '信息填报', children: []},
  {id: 6, funcUrl: 'river-patrol', icon: 'file', name: '信息管理', children: []},
  {id: 7, funcUrl: 'river-patrol', icon: 'file', name: '河湖档案', children: []},
  {id: 8, funcUrl: 'river-patrol', icon: 'file', name: '抽查督导', children: []},
  {id: 9, funcUrl: 'river-patrol', icon: 'file', name: '系统管理', children: []},
  {id: 'a', funcUrl: 'river-patrol', icon: 'file', name: '移动平台', children: []},
  {id: 'b', funcUrl: 'river-patrol', icon: 'file', name: '信息服务', children: []},
  {id: 'c', funcUrl: 'river-patrol', icon: 'file', name: '工作台账', children: []},
  {id: 'd', funcUrl: 'river-patrol', icon: 'file', name: '展示发布', children: []}
];
