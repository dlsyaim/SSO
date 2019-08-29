<template>
  <div class="card-container">
    <a-card title="督办" :bordered="false" style="min-height: 100%">
      <a-row>
        <a-col span="5">
          <span>督办事项：</span>
          <a-input class="default-select-width" placeholder="请输入督办事项" v-model="searchCondition.project"></a-input>
        </a-col>
        <a-col span="5">
          <span>督办标题：</span>
          <a-input class="default-select-width" placeholder="请输入督办标题" v-model="searchCondition.title"></a-input>
        </a-col>
        <a-col span="5">
          <span>行政区域：</span>
          <a-select class="default-select-width" v-model="searchCondition.region" placeholder="请选择行政区域">
            <a-select-option v-for="item in regionList" :value="item.regionId" :key="item.regionId">
              {{item.regionName}}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>开始时间：</span>
          <a-date-picker class="default-select-width" v-model="searchCondition.startTime"
                         :disabledDate="disableStartDate"/>
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="5">
          <span>结束时间：</span>
          <a-date-picker class="default-select-width" v-model="searchCondition.endTime" :disabledDate="disableEndDate"/>
        </a-col>
        <a-col span="5">
          <span>督办文号：</span>
          <a-input class="default-select-width" placeholder="请输入督办文号" v-model="searchCondition.proof"></a-input>
        </a-col>
        <a-col span="5">
          <span>是否办结：</span>
          <a-select class="default-select-width" v-model="searchCondition.status" placeholder="请选择是否办结">
            <a-select-option value="1">未办结</a-select-option>
            <a-select-option value="2">未按期整改</a-select-option>
            <a-select-option value="3">已办结</a-select-option>
          </a-select>
        </a-col>
        <a-col span="5">
          <span>督办类型：</span>
          <a-select class="default-select-width" v-model="searchCondition.type" placeholder="请选择督办类型">
            <a-select-option v-for="(value,key) in superviseTypeEnum" :value="key" :key="key">{{value}}</a-select-option>
          </a-select>
        </a-col>
        <a-col span="4">
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </a-col>
      </a-row>
      <a-divider style="margin: 12px 0"/>
      <div style="display: flex;align-items: center;justify-content: flex-end">
        <a-button @click="isAddSuperviseModalVisible=true" type="primary" style="margin-right: 20px">
          <a-icon type="plus" style="font-size: 16px"/>
          发起督办
        </a-button>
        <a-button @click="exportFile">
          <a-icon type="export" style="font-size: 18px"/>
          导出
        </a-button>
      </div>
      <div style="margin-top: 12px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange"
        >
          <div slot="status" slot-scope="item">
            <a-tag v-if="item.status==='1'" color="#87d068">未办结</a-tag>
            <a-tag v-if="item.status==='2'" color="#108ee9">已办结</a-tag>
            <a-tag v-if="item.status==='3'" color="#f50">未按期整改</a-tag>
          </div>
          <div slot="whetherinspect" slot-scope="item">
            <span v-if="item.whetherinspect==='1'">已发起</span>
            <span v-if="item.whetherinspect==='2'">已核查</span>
          </div>
          <span slot="action" slot-scope="item">
            <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
            <a-divider type="vertical"/>
            <span data-method="feedback" :data-id="item.id" class="table-operation">督办反馈</span>
            <a-divider type="vertical"/>
            <template v-if="item.whetherinspect==='2'">
              <span data-method="check" :data-id="item.id" class="table-operation">现场核查</span>
              <a-divider type="vertical"/>
            </template>
            <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
              <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
            </a-popconfirm>
            <br/>
            <span data-method="dan" :data-id="item.id" class="table-operation">生成督办单</span>
            <a-divider type="vertical"/>
            <span data-method="han" :data-id="item.id" class="table-operation">生成督办函</span>
          </span>
        </a-table>
      </div>
    </a-card>
    <!--详情-->
    <SuperviseDetail v-model="isDetailModalVisible" :detail="selected"/>
    <!--发起督办-->
    <AddSupervise :region-list="regionList" :supervise-type-enum="superviseTypeEnum" v-model="isAddSuperviseModalVisible" @success="getList"/>
    <!--督办反馈-->
    <SuperviseFeedBack :region-list="regionList" :feedback-list="feedbackList" :record-id="selected.id" v-model="isSuperviseFeedbackVisible" @success="getList"/>
    <!--现场核查-->
    <OnsiteVertification v-model="isCheckVisible" :record-id="selected.id" :check-result="checkResult" @success="getList"/>
    <!--生成督办单-->
    <SuperviseDan v-model="isDanVisible" :record="selected" @success="getList"/>
    <!--生成督办函-->
    <SuperviseHan v-model="isHanVisible" :record="selected" @success="getList"/>
  </div>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import moment from 'moment';
  import {BASE_URL, tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get, post} from "../../../util/axios";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import SuperviseFeedBack from "./SuperviseFeedBack";
  import AddSupervise from "./AddSupervise";
  import SuperviseDan from "./SuperviseDan";
  import SuperviseHan from "./SuperviseHan";
  import OnsiteVertification from "./OnsiteVertification";
  import SuperviseDetail from "./SuperviseDetail";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '督办标题', dataIndex: 'title', sorter: true},
    {title: '督办事项', dataIndex: 'project', sorter: true},
    {title: '督办对象', dataIndex: 'objectname', sorter: true},
    {title: '督办单文号', dataIndex: 'dubandanProof'},
    {title: '督办函文号', dataIndex: 'dubanhanProof'},
    {title: '应回复日期', dataIndex: 'deadlinedate', sorter: true},
    {title: '督办点位', dataIndex: 'address', sorter: true},
    {title: '督办类型', dataIndex: 'type', sorter: true},
    {title: '督办结果', dataIndex: 'resule', sorter: true},
    {title: '是否办结', key: 'status', scopedSlots: {customRender: 'status'},sorter: true},
    {title: '督办结果',scopedSlots: {customRender: 'whetherinspect'} ,sorter: true},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 244,align:'center'}
  ];

  const superviseTypeEnum={
    '1':'普通督办',
    '2':'现场督办',
    '3':'挂牌督办',
  };

  export default {
    components: {
      SuperviseDetail,
      OnsiteVertification, SuperviseHan, SuperviseDan, AddSupervise, SuperviseFeedBack, ATextarea, ARow},
    data() {
      return {
        searchCondition: {
          project: '',
          title: '',
          region: undefined,
          startTime: null,
          endTime: null,
          proof: '',
          status: undefined,
          type: undefined,
          column: undefined,
          order: undefined,
        },
        superviseTypeEnum,
        regionList:[],
        selected:{},
        list: [],
        loading: false,
        pagination: tablePaginationConfig,
        columns,
        BASE_URL,
        isDetailModalVisible:false,
        isAddSuperviseModalVisible: false,
        isSuperviseFeedbackVisible:false,
        feedbackList:[],
        isCheckVisible:false,
        checkResult:{},
        isDanVisible:false,
        isHanVisible:false
      }
    },
    mounted() {
      this.getList();
      this.getRegionList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          project: this.searchCondition.project,
          title: this.searchCondition.title,
          region: this.searchCondition.region,
          startTime: this.searchCondition.startTime ? moment(this.searchCondition.startTime).format('YYYY-MM-DD') : null,
          endTime: this.searchCondition.endTime ? moment(this.searchCondition.endTime).format('YYYY-MM-DD') : null,
          proof: this.searchCondition.proof,
          status: this.searchCondition.status,
          type: this.searchCondition.type,
          column: this.searchCondition.column,
          order: this.searchCondition.order,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/duban/v1/DubanSupervision/list`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
            this.pagination.total = res.data.total;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
          item.type=this.superviseTypeEnum[item.type];
          // 督办结果
          if(item.resule==='1'){
            item.resule='未完成';
          }else if(item.resule==='2'){
            item.resule='完成';
          }else {
            item.resule='';
          }
        });
        this.list = list;
      },
      getRegionList() {
        get(`${BASE_URL}/duban/v1/DubanSupervision/selectPersonnel`).then(res => {
          if (res.resCode === 1) {
            this.regionList = res.data;
          }
        });
      },
      disableStartDate(startTime) {
        if (!startTime || !this.searchCondition.endTime) {
          return false
        } else {
          return startTime.valueOf() > this.searchCondition.endTime.valueOf()
        }
      },
      disableEndDate(endTime) {
        if (!endTime || !this.searchCondition.startTime) {
          return false
        } else {
          return endTime.valueOf() < this.searchCondition.startTime.valueOf()
        }
      },
      resetSearchCondition() {
        this.searchCondition = {
          project: '',
          title: '',
          region: undefined,
          startTime: null,
          endTime: null,
          proof: '',
          status: undefined,
          type: undefined,
          column: undefined,
          order: undefined,
        };
      },
      handleTableChange(pagination, filters, sorter) {
        this.pagination = pagination;
        if (sorter.order === 'ascend') {
          this.searchCondition.column = sorter.columnKey;
          this.searchCondition.order = 'asc';
        } else if (sorter.order === 'descend') {
          this.searchCondition.column = sorter.columnKey;
          this.searchCondition.order = 'desc';
        } else {
          this.searchCondition.column = '';
          this.searchCondition.order = '';
        }
        this.getList();
      },
      handleTableClick(e) {
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='detail'){
            this.isDetailModalVisible=true;
          }else if(method==='feedback'){
            this.getFeedbackList();
          }else if(method==='check'){
            this.getCheckResult();
          }else if(method==='dan'){
             this.isDanVisible=true;
          }else if(method==='han'){
             this.isHanVisible=true;
          }
        }
      },
      getFeedbackList(){
        this.loading=true;
        const params={
          reportId:this.selected.id,
          replyStatus: 1
        };
        get(`${BASE_URL}/inform/v1/informAccept/list`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            if(res.data.length===0){
              this.$message.warn('暂无反馈结果');
            }else {
              this.feedbackList=res.data;
              this.isSuperviseFeedbackVisible=true;
            }
          }
        })
      },
      getCheckResult(){
        this.loading=true;
        get(`${BASE_URL}/duban/v1/DubanSupervision/detailFeedbackhc`,{supervisionid:this.selected.id}).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.checkResult=res.data[0];
            this.isCheckVisible=true;
          }
        })
      },
      deleteItem(){
        this.loading=true;
        deleteRequest(`${BASE_URL}/duban/v1/DubanSupervision/delete?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.getList();
            // 由于删除成功或者失败，resCode都是1，只能用一个中性的信息提示
            // 坑！
            this.$message.info(res.data);
          }
        })
      },
      exportFile() {
        window.location.href = BASE_URL + '/duban/v1/DubanSupervision/createExcel?project='
        + this.searchCondition.project
        + '&statTime='
        + (this.searchCondition.startTime ? moment(this.searchCondition.startTime).format('YYYY-MM-DD') : '')
        + '&endTime='
        + (this.searchCondition.endTime ? moment(this.searchCondition.endTime).format('YYYY-MM-DD') : '')
          + '&objectid='
          + (this.searchCondition.region?this.searchCondition.region:'')
          + '&proof='
          + (this.searchCondition.proof?this.searchCondition.proof:'')
          + '&status='
          + (this.searchCondition.status?this.searchCondition.status:'')
          + '&type='
          + (this.searchCondition.type?this.searchCondition.type:'');
      }
    }
  }
</script>

<style scoped>

</style>
