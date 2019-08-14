<template>
  <div class="card-container">
    <a-card title="水质评分细则" :bordered="false" style="min-height: 100%">
      <a-button @click="$router.push('/setting/scoring-rules')" slot="extra">返回</a-button>
      <div style="display: flex;justify-content: space-between">
        <div style="display: flex;align-items: center;">
          <span>参数类型：</span>
          <a-select class="default-select-width" style="margin-right: 40px" v-model="paramType" placeholder="请选择参数类型">
            <a-select-option v-for="(value,key) in paramTypeEnum" :value="key" :key="key">{{value}}</a-select-option>
          </a-select>
          <a-button type="primary" @click="getList">查询</a-button>
          <a-button @click="resetSearchCondition" style="margin-left: 20px">重置</a-button>
        </div>
        <a-button type="primary" @click="showAddModal">
          <a-icon type="plus" style="font-size: 16px"/>
          新增
        </a-button>
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
      width="700px"
      :confirmLoading="isSaveLoading"
      @cancel="isModalVisible=false"
    >
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="参数类型">
              <a-select v-decorator="['paramType']" placeholder="请选择参数类型">
                <a-select-option v-for="(value,key) in paramTypeEnum" :value="key" :key="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="最大值">
              <a-input v-decorator="['maxValue']" placeholder="请输入最大值"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="最小值">
              <a-input v-decorator="['minValue']" placeholder="请输入最小值"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="扣分数">
              <a-input v-decorator="['scoreCoefficient']" placeholder="请输入扣分数"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="排序">
              <a-input v-decorator="['sortOrder']" placeholder="请输入排序"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

  import {BASE_URL, tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get, post, put} from "../../../util/axios";
  import ARow from "ant-design-vue/es/grid/Row";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '评分规则', dataIndex: 'assessRule'},
    {title: '参数类型', dataIndex: 'paramTypeName'},
    {title: '最大值', dataIndex: 'maxValue'},
    {title: '最小值', dataIndex: 'minValue'},
    {title: '扣分数', dataIndex: 'deductValue'},
    {title: '排序', dataIndex: 'sortOrder'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 160}
  ];

  const formLayout={
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {ARow},
    data() {
      return {
        id: '',
        paramType: undefined,
        waterQualityType: undefined,
        paramTypeEnum: {
          tp: '总磷',
          nh4n: '氨氮',
          do: '溶解氧',
          codmn:'高锰酸盐指数'
        },
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        selected:{},
        isEdit:false,
        isModalVisible:false,
        form:null,
        formLayout,
        isSaveLoading:false
      }
    },
    beforeMount() {
      this.id = this.$route.query.id;
    },
    mounted() {
      this.getList();
      this.form=this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          pageNumber: this.pagination.current,
          pageSize: this.pagination.pageSize,
          paramType: this.paramType,
          ruleId: this.id
        };
        get(`${BASE_URL}/statistic/v1/waterQuality/listWaterQuality`, params).then(res => {
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
          item.paramTypeName=this.paramTypeEnum[item.paramType];
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.paramType = undefined;
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='modify'){
            this.isEdit=true;
            this.isModalVisible=true;
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                paramType: this.selected.paramType,
                maxValue: this.selected.maxValue,
                minValue: this.selected.minValue,
                scoreCoefficient: this.selected.scoreCoefficient,
                sortOrder:this.selected.sortOrder
              });
            });
          }else if(method==='delete'){

          }
        }
      },
      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/statistic/v1/waterAssess/deleteWaterAssess?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.getList();
            this.$message.success('删除成功');
          }
        })
      },
      showAddModal() {
        this.isModalVisible=true;
        this.form.resetFields();
      },
      handleOk(){
        this.form.validateFields((err,value)=>{
          if(!err){
            this.isSaveLoading=true;
            if(this.isEdit){
              this.edit(value);
            }else{
              this.add(value);
            }
          }
        })
      },
      add(value){
        const params=Object.assign({},value,{ruleId:this.id});
        post(`${BASE_URL}/statistic/v1/waterQuality/addWaterQuality`,params).then(res=>{
          this.isSaveLoading=false;
          if(res.resCode===1){
            this.$message.success('新增成功');
            this.getList();
            setTimeout(()=>{
              this.isModalVisible=false;
            },1500);
          }
        })
      },
      edit(value){
        const params=Object.assign({},value,{ruleId:this.id,id:this.selected.id});
        put(`${BASE_URL}/statistic/v1/waterQuality/updateWaterQuality`,params).then(res=>{
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

<style scoped>

</style>
