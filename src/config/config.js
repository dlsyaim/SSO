/**
 * api根路径
 * @type {string}
 */
export const BASE_URL='http://39.106.76.142';

/**
 * 上传文件接口
 * @type {string}
 */
export const UPLOAD_URL='http://10.0.0.96/inform/v1/informReport/upload';

export const FILE_URL_PREFIX='http://47.93.191.69:8080';

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
 * 河西区regionId
 */
export const REGION_ID=120103000000;
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
    funcUrl: 'statistic',
    icon: 'file', name: '综合统计分析',
    children: [
      {id: '20', funcUrl: '/statistic/river-patrol', icon: 'file', name: '巡河统计'},
      {id: '21', funcUrl: '/statistic/event', icon: 'file', name: '问题事件统计'},
      {id: '22', funcUrl: '/statistic/supervise', icon: 'file', name: '区级督查督办统计'},
      {id: '23', funcUrl: '/statistic/annual-inspection', icon: 'file', name: '年度考核统计'},
      {id: '24', funcUrl: '/statistic/water-quality', icon: 'file', name: '水质变化与达标情况统计'},
      {id: '25', funcUrl: '/statistic/automatic-monitoring-station', icon: 'file', name: '自动监测站统计与水质分析图'},
      {id: '26', funcUrl: '/statistic/unmanned-aerial', icon: 'file', name: '无人机巡河预警分析统计'},
      {id: '27', funcUrl: '/statistic/video-monitoring', icon: 'file', name: '视频监控预警分析统计'},
      {id: '28', funcUrl: '/statistic/execution', icon: 'file', name: '一河（湖）一策任务完成情况统计'},
      {id: '29', funcUrl: '/statistic/data-update', icon: 'file', name: '一河（湖）一档数据更新统计'},
      {id: '2a', funcUrl: '/statistic/river-amount', icon: 'file', name: '河流数量统计'},
      {id: '2b', funcUrl: '/statistic/river-chief-count', icon: 'file', name: '河长人数统计'},
    ]
  },
  {
    id: '3',
    funcUrl: 'information',
    icon: 'file',
    name: '信息查询', children: [
      {id: '30', funcUrl: '/information/river-chief-directory', icon: 'file', name: '河长名录'},
      {id: '31', funcUrl: '/information/one-river-one-policy', icon: 'file', name: '一河（湖）一策'},
      {id: '32', funcUrl: '/information/supervise-event', icon: 'file', name: '督办事件'},
    ]
  },
  {id: '4', funcUrl: 'river-patrol', icon: 'file', name: '信息发布', children: []},
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
  {id: '6', funcUrl: 'river-patrol', icon: 'file', name: '监督督导', children: []},
  {id: '7', funcUrl: 'river-patrol', icon: 'file', name: '公众投诉', children: []},
  {
    id: '8',
    icon: 'file',
    name: '信息报送',
    children: [
      {id:'80',funcUrl:'/submitted/information-submitted',name:'信息报送'}
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
      {id:'b0',icon:'file',name:'用户列表',funcUrl:'/setting/user-list'}
    ]
  },
  {id: 'c', funcUrl: 'river-patrol', icon: 'file', name: '考核设置', children: []},
  {id: 'd', funcUrl: 'river-patrol', icon: 'file', name: '权限设置', children: []},
  {id: 'e', funcUrl: 'river-patrol', icon: 'file', name: '数字字典管理', children: []}
];
