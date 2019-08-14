<template>
  <div class="card-container">
    <a-card title="角色设置" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>基础类型：</span>
          <a-select style="margin-right: 40px" class="default-select-width" v-model="typeId" placeholder="请选择基本类型">
            <a-select-option v-for="item in roleTypeList" :key="item.id" :value="item.id">{{item.name}}
            </a-select-option>
          </a-select>
          <span>角色名称：</span>
          <a-input class="default-select-width" style="margin-right: 40px" v-model="roleName"
                   placeholder="请输入角色名称"></a-input>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="roleName='';typeId=undefined">重置</a-button>
        </div>
        <a-button type="primary" @click="showAddModal">
          <a-icon type="plus" style="font-size: 16px"/>
          新增角色
        </a-button>
      </div>
      <div @click="handleTableClick" style="margin-top: 18px">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :loading="loading"
                 @change="handleTableChange"
                 :pagination="pagination">
          <div slot="status" slot-scope="item">
            <a-tag v-if="item.status===1" color="#87d068">激活</a-tag>
            <a-tag v-if="item.status===2" color="#f50">禁用</a-tag>
          </div>
          <span slot="action" slot-scope="item">
          <span data-method="enable" v-if="item.status===2" :data-id="item.id" class="table-operation">启用</span>
          <span data-method="disable" v-else-if="item.status===1" :data-id="item.id" class="table-operation">禁用</span>
          <span v-else style="visibility: hidden">禁用</span>
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
      :title="isEdit?'修改':'新增'"
      :visible="isModalVisible"
      @ok="handleOk"
      :confirmLoading="isSaveLoading"
      @cancel="isModalVisible=false"
    >
      <a-form :form="form">
        <a-form-item v-bind="formLayout" label="角色名称">
          <a-input v-decorator="['name', {rules: [{ required: true, message: '请输入角色名称!' }]}]"
                   placeholder="请输入角色名称"></a-input>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="基础类型">
          <a-select v-decorator="['typeId', {rules: [{ required: true, message: '请选择基础类型!' }]}]" placeholder="请选择基础类型">
            <a-select-option v-for="item in roleTypeList" :key="item.id" :value="item.id">{{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="描述">
          <a-textarea rows="3" v-decorator="['description']" placeholder="请输入描述"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {deleteRequest, get, post, put} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '角色名称', dataIndex: 'name'},
    {title: '基础类型', dataIndex: 'typeName'},
    {title: '状态', key: 'status', scopedSlots: {customRender: 'status'}, width: 160},
    {title: '备注', dataIndex: 'description'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 200}
  ];

  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 17}
  };

  export default {
    components: {ATextarea},
    data() {
      return {
        roleName: '',
        typeId: undefined,
        roleTypeList: [],
        list: [],
        pagination: tablePaginationConfig,
        loading: true,
        columns,
        selected: {},
        isEdit: false,
        isModalVisible: false,
        form: null,
        formLayout,
        isSaveLoading: false
      }
    },
    mounted() {
      this.getList();
      this.getRoleTypeList();
      this.form = this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current,
          type: this.typeId,
          status: -1
        };
        get(`${BASE_URL}/uip/smRole/queryRoleList`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.records);
            this.pagination.total = res.data.totalNum;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        });
        this.list = list;
      },
      getRoleTypeList() {
        get(`${BASE_URL}/uip/smRole/queryRoleTypeList`).then(res => {
          if (res.resCode === 1) {
            this.roleTypeList = res.data;
          }
        })
      },
      showAddModal() {
        this.form.resetFields();
        this.isModalVisible = true;
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
        const id = e.target.dataset.id;
        const method = e.target.dataset.method;
        if (id && method) {
          this.selected = this.list.find(item => item.id === id);
          if (method === 'modify') {
            this.showEditModal();
          }else if(method==='enable'){
            this.enable();
          }else if(method==='disable'){
            this.disable();
          }else if(method==='delete'){

          }
        }
      },
      enable(){
        const params={
          id:this.selected.id,
          status:1
        };
        this.loading=true;
        put(`${BASE_URL}/uip/smRole/updateById`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('启用成功');
            this.getList();
          }
        })
      },
      disable(){
        const params={
          id:this.selected.id,
          status:2
        };
        this.loading=true;
        put(`${BASE_URL}/uip/smRole/updateById`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('禁用成功');
            this.getList();
          }
        })
      },
      showEditModal() {
        this.isEdit = true;
        this.isModalVisible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            name: this.selected.name,
            typeId: this.selected.typeId,
            description: this.selected.description
          });
        });
      },
      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/uip/smRole/deleteById?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('删除成功');
            this.getList();
          }
        })
      },
      handleOk() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            if (this.isEdit) {
              this.edit(value);
            } else {
              this.add(value);
            }
          }
        })
      },
      add(value) {
        post(`${BASE_URL}/uip/smRole/addRole`, value).then(res => {
          this.isSaveLoading = false;
          if (res.resCode === 1) {
            this.$message.success('新增成功');
            this.getList();
            setTimeout(() => {
              this.isModalVisible = false;
            }, 1500);
          }
        })
      },
      edit(value) {
        const params = Object.assign({}, value, {id: this.selected.id});
        put(`${BASE_URL}/uip/smRole/updateById`,params).then(res=>{
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
    }
  }
</script>

