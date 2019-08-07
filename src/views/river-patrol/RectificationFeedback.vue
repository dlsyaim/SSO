<template>
  <div class="card-container">
    <a-card title="整改统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>行政区域：</span>
          <a-select class="default-select-width" v-model="region" placeholder="请选择行政区域" style="margin-right: 40px">
            <a-select-option v-for="item in regionList" :value="item.areaCode" :key="item.id">{{item.areaName}}</a-select-option>
          </a-select>
          <span>开始月份：</span>
          <a-month-picker v-model="startTime" :disabledDate="disableStartDate" style="margin-right: 40px" class="default-select-width"/>
          <span>结束日期：</span>
          <a-month-picker v-model="endTime" :disabledDate="disableEndDate" style="margin-right: 40px" class="default-select-width"/>
          <span>结束月份：</span>
          <a-radio-group v-model="state" style="margin-right: 40px">
            <a-radio value="1">是</a-radio>
            <a-radio value="2">否</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="showAddModal"><a-icon type="plus" style="font-size: 16px;"/>新增</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 @change="handleTableChange"
                 :rowKey="record => record.id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading">
          <span slot="action" slot-scope="item">
            <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
            <a-divider type="vertical"/>
            <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
              <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      :title="isEdit?'编辑':'新增整改'"
      :visible="isFormModalVisible"
      @cancel="isFormModalVisible=false"
      :confirmLoading="confirmLoading"
      @ok="submit"
      width="760px"
    >
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="整改日期">
              <a-date-picker style="width: 100%" v-decorator="['begin_time', {rules: [{ required: true, message: '请选择整改日期!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="行政区域">
              <a-select placeholder="请选择行政区域" v-decorator="['region', {rules: [{ required: true, message: '请选择行政区域!' }]}]">
                <a-select-option v-for="item in regionList" :value="item.areaCode" :key="item.id">{{item.areaName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="整改时限">
              <a-date-picker style="width: 100%" v-decorator="['deadline', {rules: [{ required: true, message: '请选择整改时限!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="是否完成">
              <a-radio-group v-decorator="['state', {rules: [{ required: true, message: '请选择是否完成!'}],initialValue:'1'}]">
                <a-radio value="1">是</a-radio>
                <a-radio value="2">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="回复时限">
              <a-date-picker style="width: 100%" v-decorator="['reply_time', {rules: [{ required: true, message: '请选择回复时限!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="记录人">
              <a-input placeholder="请输入记录人" v-decorator="['notekeeper', {rules: [{ required: true, message: '请输入记录人!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="下达对象">
              <a-input placeholder="请输入下达对象" v-decorator="['object', {rules: [{ required: true, message: '请输入下达对象!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="职务">
              <a-input placeholder="请输入职务" v-decorator="['duty', {rules: [{ required: true, message: '请输入职务!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="整改事项">
              <a-textarea rows="3" placeholder="请输入整改事项" v-decorator="['items', {rules: [{ required: true, message: '请输入整改事项!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="备注">
              <a-textarea rows="3" placeholder="请输入备注" v-decorator="['remark']" />
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="附件">
              <a-upload :fileList="fileList"
                        :remove="handleFileRemove">
                <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                  <a-button>
                    <a-icon type="upload" />上传文件
                  </a-button>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="详情"
      v-model="isDetailModalVisible"
      :footer="null"
    >

    </a-modal>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import moment from 'moment';
  import ARow from "ant-design-vue/es/grid/Row";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import ACol from "ant-design-vue/es/grid/Col";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'下达行政区',dataIndex:'region'},
    {title:'下达对象',dataIndex:'object'},
    {title:'整改事项',dataIndex:'items'},
    {title:'回复时限',dataIndex:'replyTime'},
    {title:'整改时限',dataIndex:'deadline'},
    {title:'是否完成',dataIndex:'stateName'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'},width:200}
  ];

  export default {
    components: {ACol, ATextarea, ARow},
    data() {
      return {
        region:undefined,
        startTime:null,
        endTime:null,
        state:null,
        regionList:[],
        list:[],
        loading:true,
        pagination:tablePaginationConfig,
        columns,
        form:null,
        isFormModalVisible:false,
        isEdit:false,
        confirmLoading:false,
        selected:{},
        isDetailModalVisible:false,
        formLayout,
        fileList:[]
      }
    },
    mounted(){
      this.getList();
      this.getRegionList();
      this.form=this.$form.createForm(this);
    },
    methods:{
      getList(){
        this.loading=true;
        const params={
          region:this.region,
          startTime:this.startTime?moment(this.startTime).format('YYYY-MM'):null,
          endTime:this.endTime?moment(this.endTime).format('YYYY-MM'):null,
          state:this.state,
          pageSize:this.pagination.pageSize,
          pageNumber:this.pagination.current
        };
        get(`${BASE_URL}/analysis/v1/saAbarbeitung/list`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.pagination.total=res.data.total;
            this.handleData(res.data.list);
          }
        })
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=(this.pagination.current-1)*this.pagination.pageSize+index+1;
          item.stateName=item.state===1?'是':'否';
        });
        this.list=list;
      },
      getRegionList(){
        get(`${BASE_URL}/information/v1/administrativeRegion/list?grade=3&pageNum=-1&pageSize=-1`).then(res=>{
          if(res.resCode===1){
            this.regionList=res.data.list;
          }
        })
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
      resetSearchCondition(){
        this.region=undefined;
        this.startTime=null;
        this.endTime=null;
        this.state=null;
      },
      showAddModal(){
        this.isEdit=false;
        this.isFormModalVisible=true;
      },
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      },
      handleTableClick(e){
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='detail'){
            this.isDetailModalVisible=true;
          }else if(method==='modify'){
            this.isFormModalVisible=true;
            this.isEdit=true;
          }
        }
      },
      submit(){

      },
      add(){

      },
      edit(){

      },
      deleteItem(){

      },
      handleFileRemove(){

      }
    }
  }
</script>
