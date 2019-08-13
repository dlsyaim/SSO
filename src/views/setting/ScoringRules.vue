<template>
  <div class="card-container">
    <a-card title="水质评分规则" :bordered="false" style="min-height: 100%">
      <div style="display: flex;justify-content: flex-end">
        <a-button type="primary" @click="showAddModal"><a-icon type="plus" style="font-size: 16px"/>新增</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
        <span slot="action" slot-scope="item">
          <span data-method="f" :data-id="item.id" class="table-operation">F值明细</span>
           <a-divider type="vertical"/>
          <span data-method="k" :data-id="item.id" class="table-operation">K值明细</span>
           <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
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
        <a-form-item v-bind="formLayout" label="规则名称">
          <a-input placeholder="请输入规则名称" v-decorator="['ruleName', {rules: [{ required: true, message: '请输入规则名称!' }]}]"></a-input>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="排序">
          <a-input-number placeholder="请输入排序" style="width: 100%" v-decorator="['sortOrder', {rules: [{ required: true, message: '请输入排序!' }]}]"></a-input-number>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="备注">
          <a-textarea placeholder="请输入备注" rows="3" v-decorator="['remark']"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {get, post, put} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'名称',dataIndex:'ruleName'},
    {title:'创建人',dataIndex:'creatorName'},
    {title:'创建时间',dataIndex:'createTime'},
    {title:'排序',dataIndex:'sortOrder'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 240}
  ];

  const formLayout={labelCol: {span: 5},wrapperCol: {span: 16}};

  export default {
    components: {ATextarea},
    data() {
      return {
        list:[],
        loading:true,
        pagination:tablePaginationConfig,
        columns,
        isEdit:false,
        isSaveLoading:false,
        isModalVisible:false,
        form:null,
        formLayout,
        selected:{}
      }
    },
    mounted(){
      this.getList();
      this.form=this.$form.createForm(this);
    },
    methods:{
      getList(){
        this.loading=true;
        const params={
          pageNumber:this.pagination.current,
          pageSize:this.pagination.pageSize
        };
        get(`${BASE_URL}/statistic/v1/waterQualityRule/listWaterRule`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.handleData(res.data.list);
            this.pagination.total=res.data.total;
          }
        });
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=(this.pagination.current-1)*this.pagination.pageSize+index+1;
        });
        this.list=list;
      },
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      },
      handleTableClick(e){
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          if(method==='k'){

          }else if(method==='f'){

          }else if(method==='modify'){
            const selected=this.list.find(item=>item.id===id);
            this.selected=selected;
            this.isEdit=true;
            this.isModalVisible=true;
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                ruleName:selected.ruleName,
                sortOrder:selected.sortOrder,
                remark:selected.remark
              });
            })
          }
        }
      },
      showAddModal(){
        this.isEdit=false;
        this.isModalVisible=true;
        this.form.resetFields();
      },
      handleOk(){
        this.form.validateFields((err,value)=>{
          if(!err){
            this.isSaveLoading=true;
            if(this.isEdit){
              this.edit(value);
            }else {
              this.add(value);
            }
          }
        })
      },
      add(value){
        post(`${BASE_URL}/statistic/v1/waterQualityRule/addWaterRule`,value).then(res=>{
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
        const params=Object.assign({},value,{id:this.selected.id});
        put(`${BASE_URL}/statistic/v1/waterQualityRule/updateWaterRule`,params).then(res=>{
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
