/**
 * api根路径
 * @type {string}
 */
export const BASE_URL='http://125.119.246.114:9080';

/**
 * 上传文件接口
 * @type {string}
 */
export const UPLOAD_URL='http://125.119.246.114/inform/v1/informReport/upload';

export const FILE_URL_PREFIX='http://125.119.246.114:9085/files';

/**
 * SSO登录中心地址
 */
export const SSO_CENTER_URl='http://125.119.246.114:9081';

/**
 * 表格常用默认分页配置
 */
export const tablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total:0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal:total => `共 ${total} 条`
};

/**
 * 西青区regionId
 */
export const REGION_ID=120111000000;
/**
 * 地图密钥
 */
export const MAP_KEY='ff19838854ae3d41e75b90bb56f0aed6&SERVICE=WMTS&REQUEST=GetTile&VERSION';

/**
 * 菜单列表
 * @type {*[]}
 */
export const menuList = [
  {id: '1', funcUrl: '/home', icon: 'file', name: '综合首页', children: []},
  {
    id: '2',
    name: '综合统计分析',
    children: [
      {id: '20', funcUrl: '/statistic/river-patrol', pId: '2', name: '巡河统计'},
      {id: '21', funcUrl: '/statistic/event', pId: '2', name: '问题事件统计'},
      {id: '22', funcUrl: '/statistic/supervise', pId: '2', name: '区级督查督办统计'},
      {id: '23', funcUrl: '/statistic/annual-inspection', pId: '2', name: '年度考核统计'},
      {id: '24', funcUrl: '/statistic/water-quality', pId: '2', name: '水质变化与达标情况统计'},
      {id: '25', funcUrl: '/statistic/automatic-monitoring-station', pId: '2', name: '自动监测站统计与水质分析图'},
      {id: '26', funcUrl: '/statistic/unmanned-aerial', pId: '2', name: '无人机巡河预警分析统计'},
      {id: '27', funcUrl: '/statistic/video-monitoring', pId: '2', name: '视频监控预警分析统计'},
      {id: '28', funcUrl: '/statistic/execution', pId: '2', name: '一河（湖）一策任务完成情况统计'},
      {id: '29', funcUrl: '/statistic/data-update', pId: '2', name: '一河（湖）一档数据更新统计'},
      {id: '2a', funcUrl: '/statistic/river-amount', pId: '2', name: '河流数量统计'},
      {id: '2b', funcUrl: '/statistic/river-chief-count', pId: '2', name: '河长人数统计'},
    ]
  },
  {
    id: '3',
    icon: 'file',
    name: '信息查询', children: [
      {id: '30', funcUrl: '/information/river-chief-directory', icon: 'file', name: '河长名录'},
      {id: '31', funcUrl: '/information/reach', icon: 'file', name: '河段管理'},
      {id: '37', funcUrl: '/information/one-river-one-policy', icon: 'file', name: '一河（湖）一策'},
      {id: '38', funcUrl: '/information/supervise-event', icon: 'file', name: '督办事件'},
    ]
  },
  {
    id: '4',
    icon: 'file',
    name: '信息发布',
    children: [
      {id: '40', funcUrl: '/publish/info-publish', icon: 'file', name: '信息发布'},
    ]
  },
  {
    id: '5',
    icon: 'file',
    name: '河长巡河',
    children: [
      {id: '50', funcUrl: '/river-patrol/standing-book', icon: 'file', name: '河长巡河台账'},
      {id: '51', funcUrl: '/river-patrol/rectification-feedback', icon: 'file', name: '整改反馈'},
      {id: '52', funcUrl: '/river-patrol/review', icon: 'file', name: '巡河复查'},
    ]
  },
  {
    id: '6',
    name: '监督督导',
    children: [
      {id: '60', funcUrl: '/supervise/supervise', icon: 'file', name: '督办'},
      {id: '61', funcUrl: '/supervise/bulletin', icon: 'file', name: '通报批评'},
      {id: '62', funcUrl: '/supervise/interview-meeting', icon: 'file', name: '约谈会议'},
    ]
  },
  {id: '7', funcUrl: 'river-patrol', icon: 'file', name: '公众投诉', children: []},
  {
    id: '8',
    icon: 'file',
    name: '信息报送',
    children: [
      {id:'80',funcUrl:'/submitted/information-submitted',name:'信息报送'},
      {id:'81',funcUrl:'/submitted/submitted-statistic',name:'报送统计'}
    ]
  },
  {
    id: '9',
    icon: 'file',
    name: '事件处理',
    children: [
      {id:'90',funcUrl:'/event/wait-deal',name:'待办问题'},
      {id:'91',funcUrl:'/event/trace',name:'问题跟踪'},
      {id:'92',funcUrl:'/event/comprehensive-query',name:'综合查询'},
      {id:'93',funcUrl:'/event/not-handled-on-time',name:'未及时处理问题'}
    ]
  },
  {id: 'a', funcUrl: 'river-patrol', icon: 'file', name: '河长制考核', children: []}
];

export const settingMenuList=[
  {id: 'b',
    icon: 'file',
    name: '系统管理',
    children: [
      {id:'b0',icon:'file',name:'用户列表',funcUrl:'/setting/user-list'},
      {id:'b1',icon:'file',name:'角色设置',funcUrl:'/setting/role'}
    ]
  },
  {
    id: 'c',
    icon: 'file',
    name: '考核设置',
    children: [
      {id:'c0',icon:'file',name:'考核评分类型管理',funcUrl:'/setting/assessment-score'},
      {id:'c1',icon:'file',name:'河段考核配置',funcUrl:'/setting/reach-assessment'},
      {id:'c2',icon:'file',name:'评分规则配置',funcUrl:'/setting/scoring-rules'},
      {id:'c5',icon:'file',name:'考核评分占比配置',funcUrl:'/setting/rating-ratio'},
      {id:'c6',icon:'file',name:'问题处理时限设置',funcUrl:'/setting/handle-time'}
    ]
  },
  {id: 'd',
    name: '权限设置',
    children: [
      {id:'d0',icon:'file',name:'菜单权限',funcUrl:'/setting/menu-permission'},
      {id:'d1',icon:'file',name:'角色权限',funcUrl:'/setting/role-permission'},
      {id:'d2',icon:'file',name:'app菜单权限设置',funcUrl:'/setting/app-menu-permission'}
    ]
  }
];
