<template>
  <div class="card-container">
    <a-card title="通报批评" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>标题：</span>
          <a-input v-model="title" placeholder="请输入标题" style="margin-right: 40px;width: 200px"></a-input>
          <span>发起日期：</span>
          <a-date-picker v-model="startTime" style="margin-right: 40px" class="default-select-width"/>
          <span>通知类别：</span>
          <a-select v-model="informType" placeholder="请选择通知类别" class="default-select-width" style="margin-right: 40px">
            <a-select-option value="600101">信息通知</a-select-option>
            <a-select-option value="600102">信息通报</a-select-option>
            <a-select-option value="600103">督查</a-select-option>
            <a-select-option value="600104">督办</a-select-option>
            <a-select-option value="600105">一区一单</a-select-option>
          </a-select>
          <span>是否已阅：</span>
          <a-radio-group v-model="readStatus" style="margin-right: 40px">
            <a-radio value="1">已阅</a-radio>
            <a-radio value="2">未阅</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <div>
          <a-button @click="isModalVisible=true" style="margin-right: 20px">
            <a-icon type="plus" style="font-size: 16px;"/>
            发起通知通报
          </a-button>
          <a-button @click="exportFile">
            <a-icon type="download" style="font-size: 16px;"/>
            导出
          </a-button>
        </div>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 @change="handleTableChange"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading">
          <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
            <span data-method="reply" :data-id="item.id" class="table-operation">答复</span>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
            <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要撤回这条数据吗?" @confirm="recall" placement="topRight">
            <span data-method="delete" :data-id="item.id" class="table-operation">撤回</span>
          </a-popconfirm>
          </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      title="发起通知报"
      :visible="isModalVisible"
      @ok="handleOk"
      width="760px"
      :confirmLoading="isSaveLoading"
      @cancel="isModalVisible=false"
    >
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item label="类型" v-bind="formLayout">
              <a-radio-group @change="onTypeChange" v-decorator="['informType',{initialValue:'600101'}]">
                <a-radio value="600101">信息通知</a-radio>
                <a-radio value="600102">信息通报</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12" v-if="showIsReplyFormItem">
            <a-form-item v-bind="formLayout" label="需要答复">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['isreply', { valuePropName: 'checked' }]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="12">
            <a-form-item label="标题" v-bind="formLayout">
              <a-input placeholder="请输入标题" v-decorator="['title',{rules:[{required:true,message:'请输入标题'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="发起日期" v-bind="formLayout">
              <a-date-picker  v-decorator="['createDate',{rules:[{required:true,message:'请选择发起日期'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col span="12"></a-col>
          <a-col span="12"></a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import {get} from "../../util/axios";
  import moment from 'moment';
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '标题', dataIndex: 'title', sorter: true},
    {title: '通知类别', dataIndex: 'informType_name', sorter: true},
    {title: '发起人', dataIndex: 'createPerson', sorter: true},
    {title: '发起日期', dataIndex: 'createDate', sorter: true},
    {title: '是否上报', key: 'weatherSent', sorter: true, scopedSlots: {customRender: 'weatherSent'}},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 200}
  ];

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {ACol, ARow},
    data() {
      return {
        title: null,
        startTime: null,
        informType: undefined,
        readStatus: undefined,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        sortColumn: '',
        sortOrder: '',
        selected: {},
        isModalVisible: false,
        isSaveLoading: false,
        form: null,
        formLayout,
        showIsReplyFormItem:false
      }
    },
    mounted() {
      this.getList();
      this.form = this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          title: this.title,
          createDate: this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : null,
          informType: this.informType,
          readStatus: this.readStatus,
          column: this.sortColumn,
          order: this.sortOrder,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/inform/v1/informReport/list`, params).then(res => {
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
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.title = null;
        this.startTime = null;
        this.informType = undefined;
        this.readStatus = undefined;
        this.sortColumn = '';
        this.sortOrder = '';
      },
      onTypeChange(e) {
        const value=e.target.value;
        if (value === '600101') {
         this.showIsReplyFormItem=false;
        } else if (value === '600102') {
         this.showIsReplyFormItem=true;
        }
      },
      handleOk() {

      },
      exportFile() {
        const project = this.project ? this.project : '';
        const statTime = this.startTime ? moment(this.startTime).format('YYYY-MM-DD') : '';
        const endTime = this.endTime ? moment(this.endTime).format('YYYY-MM-DD') : '';
        window.location.href = `${BASE_URL}/duban/v1/DubanSupervision/createExcel?project=${project}&statTime=${statTime}&endTime=${endTime}`;
      },
      handleTableClick(e) {
        const id = e.target.dataset.id;
        const method = e.target.dataset.method;
        if (id && method) {
          this.selected = this.list.filter(item => item.id === id);

        }
      },
      handleTableChange(pagination, filters, sorter) {
        this.pagination = pagination;
        if (sorter.order === 'ascend') {
          this.sortColumn = sorter.columnKey;
          this.sortOrder = 'asc';
        } else if (sorter.order === 'descend') {
          this.sortOrder = 'desc';
          this.sortColumn = sorter.columnKey;
        } else {
          this.sortOrder = '';
          this.sortColumn = '';
        }
        this.getList();
      },
      deleteItem() {

      },
      recall() {

      }
    }
  }
</script>

<style scoped>

</style>
