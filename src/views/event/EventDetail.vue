<template>
  <div class="card-container">
    <a-card title="问题详情" :bordered="false" style="min-height: 100%" id="card">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <a-card :title="null" :bodyStyle="{padding:'16px'}">
        <div style="display: flex;justify-content: space-between">
          <div style="width: 72%;">
            <a-row class="modal-detail-item">
              <a-col span="8">问题编号：{{eventDetail.serialno}}</a-col>
              <a-col span="8" style="padding-right: 20px;">问题类型：{{eventDetail.typename}}</a-col>
              <a-col span="8">问题等级：{{eventLevelEnum[eventDetail.eventlevel]}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="8">问题来源：{{eventSourceEnum[eventDetail.eventresource]}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="8">问题内容：{{eventDetail.content}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="8">事发地：{{eventDetail.address}}</a-col>
              <a-col span="8">发现时间：{{eventDetail.createtime}}</a-col>
              <a-col span="8">上报人：{{eventDetail.reportperson}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="8">上报时间：{{eventDetail.reporttime}}</a-col>
              <a-col span="8">联系方式：{{eventDetail.reportphone}}</a-col>
              <a-col span="8">河流名称：{{eventDetail.eventrivername}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="8">河道名称：{{eventDetail.eventreachname}}</a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="24">处理前：
                <div style="display: inline-flex" v-if="beforeAccessory.length!==0">
                  <template  v-for="(item,index) in beforeAccessory">
                    <img v-if="item.accessorytype === 1||item.accessorytype === 2" style="cursor: pointer" width="60" height="60" :src="FILE_URL_PREFIX+item.accessoryurl" @click="previewImage(item)" :key="index"/>
                    <img v-if="item.accessorytype === 3" style="cursor: pointer" width="60" height="60" src="/sdf" @click="playAudio(item)" :key="index"/>
                    <img v-if="item.accessorytype === 4" style="cursor: pointer" width="60" height="60" src="/sdf" @click="playVideo(item)" :key="index"/>
                  </template>
                </div>
              </a-col>
            </a-row>
            <a-row class="modal-detail-item">
              <a-col span="24">处理后：
                  <div v-if="afterAccessory.length!==0" style="display:inline-flex;">
                    <template  v-for="(item,index) in afterAccessory">
                      <img v-if="item.accessorytype === 1||item.accessorytype === 2" style="cursor: pointer" width="60" height="60" :src="FILE_URL_PREFIX+item.accessoryurl" @click="previewImage(item)" :key="index"/>
                      <img v-if="item.accessorytype === 3" style="cursor: pointer" width="60" height="60" src="/sdf" @click="playAudio(item)" :key="index"/>
                      <img v-if="item.accessorytype === 4" style="cursor: pointer" width="60" height="60" src="/sdf" @click="playVideo(item)" :key="index"/>
                    </template>
                  </div>
              </a-col>
              <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
                <img width="480" :src="previewImageUrl" />
              </a-modal>
            </a-row>
            <a-row style="margin-top: 8px">
              <a-col span="24">说明：上报电话请填写手机号码或者座机号码，联系方式无限制</a-col>
            </a-row>
          </div>
          <div id="map"
               style="width: 320px;height: 240px;border: 1px solid #cccccc;display: flex;align-items: center;justify-content: center">
            <span style="color: rgba(0,0,0,.35)">无经纬度信息，无法绘制</span>
          </div>
        </div>
      </a-card>
      <a-card :title="null" style="margin: 18px 0" :bodyStyle="{padding:'16px'}">
        <span style="font-size: 16px;color: rgba(0,0,0,.85);">处理状况</span>
        <!--span设置margin-bottom，transform不起作用，所以勇哥div占位-->
        <div style="height: 4px"></div>
        <a-table :columns="columns"
                 :rowKey="record => record.index"
                 :dataSource="processStatusList"
                 :pagination="false">
        </a-table>
      </a-card>
      <a-card :title="null" v-if="operationTypeList.length" :bodyStyle="{padding:'16px'}">
        <a-tabs>
          <a-tab-pane tab="委办" key="1" v-if="operationTypeList.lastIndexOf('sendOrder')!==-1" forceRender>
            <Delegate :user-id="userId" :event-id="id"></Delegate>
          </a-tab-pane>
          <a-tab-pane tab="派单" key="2" v-if="operationTypeList.lastIndexOf('delegate')!==-1" forceRender>
            <SendOrder :region-list="regionList" :user-id="userId" :event-id="id"></SendOrder>
          </a-tab-pane>
          <a-tab-pane tab="结案" key="3" v-if="operationTypeList.lastIndexOf('close')!==-1" forceRender>
            <Close :event-id="id" :user-id="userId"></Close>
          </a-tab-pane>
          <a-tab-pane tab="退回" key="4" v-if="operationTypeList.lastIndexOf('rollback')!==-1" forceRender>
            <Rollback :event-id="id" :user-id="userId"></Rollback>
          </a-tab-pane>
          <a-tab-pane tab="下发督办单" key="5" forceRender>
            <SuperviseOrder :region-list="regionList"></SuperviseOrder>
          </a-tab-pane>
          <a-tab-pane tab="下发函" key="6" forceRender>
            <SendLetter :region-list="regionList" :event-id="id"></SendLetter>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_EVENT_DETAIL, GET_EVENT_HANDLE_TYPE_LIST, GET_EVENT_PROCESS_STATUS} from "../../api/event";
  import SendOrder from "./event-detail-operation/SendOrder";
  import Delegate from "./event-detail-operation/Delegate";
  import Rollback from "./event-detail-operation/Rollback";
  import Close from "./event-detail-operation/Close";
  import {BASE_URL, FILE_URL_PREFIX} from "../../config/config";
  import SuperviseOrder from "./event-detail-operation/SuperviseOrder";
  import SendLetter from "./event-detail-operation/SendLetter";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  const columns = [
    {title: '到达时间', dataIndex: 'taskCreateTime'},
    {title: '问题状态', dataIndex: 'taskName'},
    {title: '处理人', dataIndex: 'handler'},
    {title: '处理内容', dataIndex: 'taskComment'},
    {title: '处理时间', dataIndex: 'taskEndTime'},
    {title: '处理时长（小时）', dataIndex: 'handlerTime'}
  ];

  const eventSourceEnum = {
    'A': '河长APP',
    'B': '电话上报',
    'C': '公众APP',
    'D': '微信',
    'F': '曝光台',
    'G': '钉钉平台',
  };

  const eventLevelEnum = {
    '0':'一般',
    '1':'紧急',
    '2':'特急',
  };

  export default {
    components: {ACol, ARow, SendLetter, SuperviseOrder, Delegate, SendOrder,Rollback,Close},
    data() {
      return {
        id: '',
        userId:'',
        eventDetail: {},
        processStatusList: [],
        columns,
        operationTypeList: [],
        regionList: [],
        eventSourceEnum,
        eventLevelEnum,
        FILE_URL_PREFIX,
        beforeAccessory:[],
        afterAccessory:[],
        previewVisible:false,
        previewImageUrl:''
      }
    },
    beforeMount() {
      this.id = this.$route.query.id;
    },
    mounted() {
      this.getEventDetail();
      this.getProcessStatus();
      this.getOperationTypeList();
      this.getRegionList();
      this.getAccessoryList();
      this.userId = JSON.parse(sessionStorage.getItem('userDTO')).id;
    },
    methods: {
      getEventDetail() {
        get(GET_EVENT_DETAIL, {eventId: this.id}).then(res => {
          if (res.resCode === 1) {
            this.eventDetail = res.data;
            this.initMap()
          }
        })
      },
      getOperationTypeList() {
        const params = {
          eventId: this.id,
          userId: 'a78fb3f6cd53411dbac9bdeb65897294'
        };
        get(GET_EVENT_HANDLE_TYPE_LIST, params).then(res => {
          if (res.resCode === 1) {
            this.operationTypeList = res.data;
          }
        })
      },
      getRegionList() {
        const regionId = JSON.parse(sessionStorage.getItem('userDTO')).regionId;
        get(`${BASE_URL}/information/v1/administrativeRegion/regionTree?parentCode=${regionId}`).then(res => {
          if (res.resCode) {
            this.regionList = res.data;
          }
        })
      },
      getProcessStatus() {
        get(GET_EVENT_PROCESS_STATUS, {eventId: this.id}).then(res => {
          if (res.resCode === 1) {
            this.handleData(res.data);
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = index + 1;
        });
        this.processStatusList = list;
      },
      getAccessoryList(){
         get(`${BASE_URL}/eventMgr/v1/event/findAccessoryList?eventId=${this.id}`).then(res=>{
           this.beforeAccessory=res.data.beforeAccessory;
           this.afterAccessory=res.data.afterAccessory;
         })
      },
      initMap() {
        const longitude = this.eventDetail.longitude;
        const latitude = this.eventDetail.latitude;
        if (latitude && longitude) {
          const map = new T.Map("map");
          map.centerAndZoom(new T.LngLat(longitude, latitude), 11);
          const marker = new T.Marker(new T.LngLat(longitude, latitude));
          map.addOverLay(marker);
          const control = new T.Control.Zoom();
          map.addControl(control);
        } else {
          this.$message.warn('缺少坐标，无法绘制地图');
        }
      },
      previewImage(target){
        this.previewImageUrl=FILE_URL_PREFIX+target.accessoryurl;
        this.previewVisible=true;
      },
      playAudio(target){

      },
      playVideo(target){

      }
    }
  }
</script>

<style scoped>

</style>
