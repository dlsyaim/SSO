<template>
  <div class="card-container">
    <a-card title="考核评分类型管理" :bordered="false" style="min-height: 100%">
      <div @click="handleTableClick">
        <a-table v-if="showTable"
          :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="false"
                 defaultExpandAllRows>
        <span slot="action" slot-scope="item">
          <span data-method="add" :data-id="item.id" class="table-operation">增加子项目</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
          <template v-if="item.children.length===0">
            <a-divider type="vertical"/>
            <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
              <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
            </a-popconfirm>
          </template>
        </span>
        </a-table>
      </div>
    </a-card>
    <!--<a-modal-->
      <!--title="修改"-->
      <!--:visible="isModalVisible"-->
      <!--@ok="handleOk"-->
      <!--:confirmLoading="isSaveLoading"-->
      <!--@cancel="isModalVisible=false"-->
    <!--&gt;-->
      <!--<a-form :form="form">-->
        <!--<a-form-item v-bind="{labelCol: {span: 8},wrapperCol: {span: 14}}" label="问题处理时限">-->
          <!--<a-input-number-->
            <!--v-decorator="['limitDay', {rules: [{ required: true, message: '请输入问题处理时限!' }]}]"></a-input-number>-->
          <!--<span style="margin-left: 4px">天</span>-->
        <!--</a-form-item>-->
      <!--</a-form>-->
    <!--</a-modal>-->
  </div>
</template>


<script>
  import {get} from "../../util/axios";
  import {BASE_URL} from "../../config/config";

  const columns=[
    {title:'评分类型', dataIndex:'gradetype',},
    {title:'权重',dataIndex:'weight'},
    {title:'总分',dataIndex:'totalpoints'},
    {title:'排序',dataIndex:'sort'}
  ];

  export default {
    data() {
      return {
        list:[],
        showTable:false,
        columns,
        num:null
      }
    },
    mounted(){
      this.getList();
      this.getNum();
    },
    methods:{
      getList(){
        get(`${BASE_URL}/assessment/v1/assessment/list`).then(res=>{
          if(res.resCode===1){
            this.list=res.data;
            this.showTable=true;
          }
        })
      },
      getNum(){
        const id=JSON.parse(sessionStorage.getItem('userDTO')).id;
        get(`${BASE_URL}/assessment/v1/assessment/userinfo1`).then(res=>{
          if(res.resCode===1){
            this.num=res.data;
            this.columns.push({title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 220});
          }
        })
      },
      handleTableClick(e){

      },
      deleteItem(){

      }
    }
  }
</script>

