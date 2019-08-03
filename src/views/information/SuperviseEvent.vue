<template>
  <div class="card-container">
    <a-card title="督办事件" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>开始日期：</span>
          <a-date-picker v-model="startTime" :disabledDate="disableStartDate" style="margin-right: 40px"/>
          <span>结束日期：</span>
          <a-date-picker v-model="endTime" :disabledDate="disableEndDate" style="margin-right: 40px"/>
          <span>是否公开：</span>
          <a-radio-group v-model="isPublic" style="margin-right: 40px">
            <a-radio :value="1">公开</a-radio>
            <a-radio :value="2">私有</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="isAddModalVisible=true">
          <a-icon type="plus" style="font-size: 16px;"/>
          新增文档
        </a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.index"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
          <span slot="action" slot-scope="item">
          <span data-method="download" :data-id="item.id" class="table-operation">下载</span>
          <a-divider type="vertical"/>
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
          <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
          </a-popconfirm>
        </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      title="新增文档"
      :visible="isAddModalVisible"
      @cancel="isAddModalVisible=false"
      :confirmLoading="confirmLoading"
      @ok="add"
    >
      <a-form :form="form">
        <a-form-item v-bind="formLayout" label="所属区域">
          <a-input placeholder="请选择所属区域" style="cursor: pointer" readOnly @click="visible=true"
                   v-decorator="['regionId',{rules: [{ required: true, message: '请选择所属区域!' }]}]"></a-input>
        </a-form-item>
        <RegionTreeModal :show-mask="false" v-model="visible" @getRegion="getRegion"></RegionTreeModal>
        <a-form-item v-bind="formLayout" label="上传文件">
          <a-upload :fileList="fileList"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload">
            <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
              <a-button>
                <a-icon type="upload" />选择文件
              </a-button>
              <a-tooltip>
                <template slot='title'>
                  只能上传pdf，doc，docx格式的文件
                </template>
                <a-icon type="exclamation-circle" style="font-size: 18px;cursor: help" />
              </a-tooltip>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import moment from 'moment';
  import {GET_ONE_RIVER_ONE_POLICY_LIST} from "../../api/information";
  import {tablePaginationConfig} from "../../config/config";
  import RegionTreeModal from "../../components/RegionTreeModal";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '标题', dataIndex: 'name'},
    {title: '类别', dataIndex: 'typeName'},
    {title: '上传时间', dataIndex: 'createdate'},
    {title: '行政区域', dataIndex: 'regionName'},
    {title: '浏览总量', dataIndex: 'count'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 200}
  ];

  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
  };
  export default {
    components: {RegionTreeModal},
    data() {
      return {
        startTime: null,
        endTime: null,
        isPublic:null,// TODO
        type:173, // TODO
        loading: true,
        list: [],
        columns,
        pagination:tablePaginationConfig,
        selected:{},
        isAddModalVisible:false,
        confirmLoading:false,
        form:null,
        formLayout,
        fileList:[],
        visible:false,
        region:null
      }
    },
    mounted() {
      this.getList();
      this.form=this.$form.createForm(this);
    },
    methods: {
      getList() {
        const params = {
          startTime: this.startTime ? moment(this.startTime).format('YYYY-mm-DD') : '',
          endTime: this.endTime ? moment(this.endTime).format('YYYY-mm-DD') : '',
          pageSize:this.pagination.pageSize,
          pageNumber:this.pagination.current,
          type: this.type
        };
        this.loading = true;
        get(GET_ONE_RIVER_ONE_POLICY_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.pagination.total=res.data.total;
            this.handleData(res.data.list);
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index =(this.pagination.current-1)*this.pagination.pageSize+ index + 1;
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
        this.isPublic = null;
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
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      },
      handleTableClick(e){
        const method=e.target.dataset.method;
        const id=e.target.dataset.id;
        if(method&&id){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='download'){
            window.location.href=this.selected.filepath;
          }else if(method ==='detail'){

          }
        }
      },
      deleteItem(){

      },
      add(){
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            console.log(this.fileList);
          }
        });
      },
      getRegion(e){
        this.region=e;
        this.form.setFieldsValue({
          regionId:e.name
        })
      },
      beforeUpload(file){
        const typeList=['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'];
        if(typeList.lastIndexOf(file.type)===-1){
          this.$message.warn('只能上传pdf，doc，docx格式的文件');
          return false;
        }else if(this.fileList.map(item=>item.lastModified).lastIndexOf(file.lastModified)!==-1){
          return false;
        }else {
          this.fileList = [...this.fileList, file];
          return false;
        }
      },
      handleRemove(file){
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      }
    }
  }
</script>

<style scoped>

</style>
