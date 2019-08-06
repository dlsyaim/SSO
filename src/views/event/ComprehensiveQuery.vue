<template>
  <div class="card-container">
    <a-card title="综合查询" :bordered="false" style="min-height: 100%">
      <a-row>
        <a-col span="5">
          <span>问题来源：</span>
          <a-select class="default-select-width" placeholder="请选择问题来源" v-model="searchCondition.eventResource">
            <a-select-option value="A">河长APP</a-select-option>
            <a-select-option value="S">市平台同步</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>问题等级：</span>
          <a-select class="default-select-width" placeholder="请选择问题等级" v-model="searchCondition.eventLevel">
            <a-select-option value="0">一般</a-select-option>
            <a-select-option value="1">紧急</a-select-option>
            <a-select-option value="2">特急</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>问题类型：</span>
          <a-select class="default-select-width" placeholder="请选择问题类型" v-model="searchCondition.eventTypeId">
            <a-select-opt-group v-for="oneLevelProblem in problemTypeList" :key="oneLevelProblem.id">
              <span slot="label">{{oneLevelProblem.name}}</span>
              <a-select-option v-for="twoLevelProblem in oneLevelProblem.children" :key="twoLevelProblem.id"
                               :value="twoLevelProblem.id" :title="twoLevelProblem.name">{{twoLevelProblem.name}}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>开始日期：</span>
          <a-date-picker v-model="searchCondition.startTime" :disabledDate="disableStartDate" style="width: 200px"/>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="5">
          <span>结束日期：</span>
          <a-date-picker v-model="searchCondition.endTime" :disabledDate="disableEndDate" style="width: 200px"/>
        </a-col>
        <a-col span="5">
          <span>问题内容：</span>
          <a-input v-model="searchCondition.content" placeholder="请输入问题内容" style="width: 200px"></a-input>
        </a-col>
        <a-col span="5">
          <span>事发区域：</span>
          <a-input :value="searchCondition.region.name" placeholder="请选择事发区域" style="width: 200px;cursor: pointer"
                   readOnly @click="searchCondition.visible=true"></a-input>
          <RegionTreeModal v-model="searchCondition.visible" @getRegion="getRegion"></RegionTreeModal>
        </a-col>
        <a-col span="5">
          <span>问题状态：</span>
          <a-select class="default-select-width" placeholder="请选择问题状态" v-model="searchCondition.status">
            <a-select-option value="1">处理中</a-select-option>
            <a-select-option value="2">已结案</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="5">
          <span>上报号码：</span>
          <a-input style="width: 200px" v-model="searchCondition.reportPhone" placeholder="请输入上报号码"></a-input>
        </a-col>
        <a-col span="5">
          <span>委办单位：</span>
          <a-input style="width: 200px" v-model="searchCondition.acceptPerson" placeholder="请输入委办单位"></a-input>
        </a-col>
        <a-col span="14" style="display: flex;justify-content: flex-end">
          <a-button type="primary" @click="getList">查询</a-button>
          <a-button @click="resetSearchCondition" style="margin-left: 20px">重置</a-button>
        </a-col>
      </a-row>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
         <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
           <a-divider type="verticle"></a-divider>
          <span data-method="modify" :data-id="item.id" class="table-operation">分值修正</span>
        </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {GET_PROBLEM_LIST, GET_PROBLEM_TYPE} from "../../api/event";
  import {tablePaginationConfig} from "../../config/config";
  import {eventStatusEnum} from "../../config/enum";
  import ACol from "ant-design-vue/es/grid/Col";
  import moment from 'moment';
  import RegionTreeModal from "../../components/RegionTreeModal";
  import ARow from "ant-design-vue/es/grid/Row";

  const columns = [
    {title: '到达时间', dataIndex: 'arrivalTime'},
    {title: '问题来源', dataIndex: 'eventResourceName'},
    {title: '问题等级', dataIndex: 'eventLevelName'},
    {title: '发现时间', dataIndex: 'createtime'},
    {title: '问题内容', dataIndex: 'content'},
    {title: '所属区域', dataIndex: 'belongArea'},
    {title: '问题状态', dataIndex: 'eventStatusName'},
    {title: '委办单位', dataIndex: 'acceptperson'},
    {title: '扣分分值', dataIndex: 'deductionScore'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 160}
  ];
  const problemSourceEnum = {
    'A': '河长APP',
    'B': '电话上报',
    'C': '公众APP',
    'D': '微信',
    'F': '曝光台',
    'G': '钉钉平台',
    'S': '市平台同步'
  };
  const problemLevelEnum = {
    '0': '一般',
    '1': '紧急',
    '2': '特急',
  };
  export default {
    components: { ARow, RegionTreeModal, ACol},
    data() {
      return {
        searchCondition: {
          userId: '',
          eventResource: undefined,
          eventLevel: undefined,
          eventTypeId: undefined,
          startTime: null,
          endTime: null,
          content: '',
          region: {},
          visible: false,
          status: undefined,
          reportPhone: '',
          acceptPerson: ''
        },
        columns,
        list: [],
        loading: false,
        pagination: tablePaginationConfig,
        problemSourceEnum,
        problemLevelEnum,
        eventStatusEnum,
        problemTypeList: []
      }
    },
    mounted() {
      this.searchCondition.userId = JSON.parse(sessionStorage.getItem('userDTO')).id;
      this.getList();
      this.getProblemType();
    },
    methods: {
      getList() {
        const params = {
          userId: this.searchCondition.userId,
          eventResource: this.searchCondition.eventResource,
          eventLevel: this.searchCondition.eventLevel,
          eventTypeId: this.searchCondition.eventTypeId,
          content: this.searchCondition.content,
          regionId: this.searchCondition.region.id,
          startTime: this.searchCondition.startTime ? moment(this.searchCondition.startTime).format('YYYY-MM-DD') : null,
          endTime: this.searchCondition.endTime ? moment(this.searchCondition.endTime).format('YYYY-MM-DD') : null,
          status: this.searchCondition.status,
          reportPhone: this.searchCondition.reportPhone,
          acceptPerson: this.searchCondition.acceptPerson,
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize
        };
        this.loading = true;
        get(GET_PROBLEM_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleList(res.data.list);
            this.pagination.total = res.data.total;
          }
        })
      },
      handleList(list) {
        list.forEach(item => {
          item.eventResourceName = this.problemSourceEnum[item.eventresource];
          item.eventLevelName = this.problemLevelEnum[item.eventlevel];
          item.belongArea = item.eventbelongcity + item.eventbelongcounty + item.eventbelongtown + item.eventbelongvillage;
          item.eventStatusName = this.eventStatusEnum[item.status];
        });
        this.list = list;
      },
      getProblemType() {
        get(GET_PROBLEM_TYPE).then(res => {
          if (res.resCode) {
            const oneLevelProblemTypeList = [];
            res.data.forEach(item => {
              if (!item.isParent) {
                oneLevelProblemTypeList.push(item);
              }
            });
            oneLevelProblemTypeList.forEach(item => {
              item.children = [];
              res.data.forEach(subItem => {
                if (subItem.pId === item.id) {
                  item.children.push(subItem);
                }
              })
            });
            this.problemTypeList = oneLevelProblemTypeList;
          }
        });
      },
      disableStartDate(startTime) {
        if (!startTime || !this.endTime) {
          return false
        } else {
          return startTime.valueOf() > this.endTime.valueOf()
        }
      },
      disableEndDate(endTime) {
        if (!endTime || !this.startTime) {
          return false
        } else {
          return endTime.valueOf() < this.startTime.valueOf()
        }
      },
      getRegion(e) {
        this.searchCondition.region = e;
      },
      resetSearchCondition() {
        this.searchCondition = {
          userId: '',
          eventResource: undefined,
          eventLevel: undefined,
          eventTypeId: undefined,
          startTime: null,
          endTime: null,
          content: '',
          region: {},
          visible: false,
          status: undefined,
          reportPhone: '',
          acceptPerson: ''
        }
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e){

      }
    }
  }
</script>

<style scoped>

</style>
