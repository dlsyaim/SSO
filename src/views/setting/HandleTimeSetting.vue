<template>
  <div class="card-container">
    <a-card title="问题处理时限设置" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>一级问题类型：</span>
        <a-select v-model="oneLevelProblemType" class="default-select-width" style="margin-right: 40px"
                  placeholder="请选择一级问题类型">
          <a-select-option v-for="item in oneLevelProblemTypeList" :key="item.id" :value="item.id">{{item.typename}}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="oneLevelProblemType=undefined">重置</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
        <span slot="action" slot-scope="item">
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
        </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      title="修改"
      :visible="isModalVisible"
      @ok="handleOk"
      :confirmLoading="isSaveLoading"
      @cancel="isModalVisible=false"
    >
      <a-form :form="form">
        <a-form-item v-bind="{labelCol: {span: 8},wrapperCol: {span: 14}}" label="问题处理时限">
          <a-input-number
            v-decorator="['limitDay', {rules: [{ required: true, message: '请输入问题处理时限!' }]}]"></a-input-number>
          <span style="margin-left: 4px">天</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import {get, put} from "../../util/axios";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '问题类型', dataIndex: 'typename'},
    {title: '问题处理时限（天）', dataIndex: 'limitDay'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 160}
  ];

  export default {
    data() {
      return {
        oneLevelProblemTypeList: [],
        oneLevelProblemType: undefined,
        loading: true,
        list: [],
        columns,
        pagination: tablePaginationConfig,
        selected:{},
        isModalVisible: false,
        isSaveLoading: false,
        form: null
      }
    },
    mounted() {
      this.getList();
      this.getOneLevelProblemTypeList();
      this.form = this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          parentId: this.oneLevelProblemType,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/eventMgr/v1/ehType/list`, params).then(res => {
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
      getOneLevelProblemTypeList() {
        get(`${BASE_URL}/eventMgr/v1/ehType/parentList`).then(res => {
          if (res.resCode === 1) {
            this.oneLevelProblemTypeList = res.data;
          }
        })
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
        const method = e.target.dataset.method;
        const id = e.target.dataset.id;
        if (method && id) {
          this.selected = this.list.find(item => item.id === id);
          if (method === 'modify') {
            this.isModalVisible = true;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                limitDay: this.selected.limitDay
              });
            });
          }
        }
      },
      handleOk() {
        this.form.validateFields((err, value) => {
          if (!err) {
            const params={
              limitDay:value.limitDay,
              id:this.selected.id
            };
            this.isSaveLoading=true;
            put(`${BASE_URL}/eventMgr/v1/ehType/update`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('修改成功');
                this.getList();
                setTimeout(()=>{
                  this.isModalVisible=false;
                },1500);
              }
            })
          }
        });
      }
    }
  }
</script>

