<template>
  <div class="card-container">
    <a-card title="河（湖）长人数统计" :bordered="false" style="min-height: 100%">
      <!--<div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 18px">-->
        <!--<div style="display: flex;align-items: center">-->

          <!--<a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>-->
          <!--<a-button @click="resetSearchCondition">重置</a-button>-->
        <!--</div>-->
      <!--</div>-->
      <div @click="handleTableClick" style="margin-top: 18px">
        <a-table :columns="columns"
                 rowKey="index"
                 :dataSource="list"
                 :pagination="false"
                 :loading="loading"
        >
          <!--区级河长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="1" slot="rivermanQNum" slot-scope="item">{{item.rivermanQNum}}</span>
          <!--湖长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="2" slot="lakemanQNum" slot-scope="item">{{item.lakemanQNum}}</span>
          <!--河长兼任湖长（包含总、副湖长）的人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="3" slot="riverLakeQNum" slot-scope="item">{{item.riverLakeQNum}}</span>
          <!--总计人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="4" slot="sumQ" slot-scope="item">{{item.sumQ}}</span>
          <!--街级河长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="5" slot="rivermanZNum" slot-scope="item">{{item.sumQ}}</span>
          <!--湖长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="6" slot="lakemanZNum" slot-scope="item">{{item.lakemanZNum}}</span>
          <!--河长兼任湖长（包含总、副湖长）的人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="7" slot="riverLakeZNum" slot-scope="item">{{item.riverLakeZNum}}</span>
          <!--总计人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="8" slot="sumZ" slot-scope="item">{{item.sumZ}}</span>
          <!--村级河长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="9" slot="rivermanCNum" slot-scope="item">{{item.rivermanCNum}}</span>
          <!--湖长总数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="10" slot="lakemanCNum" slot-scope="item">{{item.lakemanCNum}}</span>
          <!--河长兼任湖长（包含总、副湖长）的人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="11" slot="riverLakeCNum" slot-scope="item">{{item.riverLakeCNum}}</span>
          <!--总计人数-->
          <span class="table-operation" style="padding: 0 10px" :data-id="item.regionId" data-index="12" slot="sumC" slot-scope="item">{{item.sumC}}</span>
        </a-table>
      </div>
    </a-card>
    <a-modal :visible="isModalVisible" title="详情" width="700px" :footer="null"  @cancel="handleCancel">
      <a-table :columns="modalTableColumns"
               rowKey="id"
               size="small"
               @change="handleModalTableChange"
               :dataSource="modalTableData"
               :loading="isModalTableLoading">
      </a-table>
    </a-modal>
  </div>
</template>

<script>

  import {get} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";

  const columns=[
    {title:'序号',dataIndex:'index',width:56},
    {title:'区名',dataIndex:'regionName'},
    {title: '区级河长总数',scopedSlots: {customRender: 'rivermanQNum'}, align: 'center'},
    {title: '湖长总数',scopedSlots: {customRender: 'lakemanQNum'}, align: 'center'},
    {title: '河长兼任湖长（包含总、副湖长）的人数',scopedSlots: {customRender: 'riverLakeQNum'}, align: 'center'},
    {title: '总计人数',scopedSlots: {customRender: 'sumQ'}, align: 'center'},
    {title: '街级河长总数',scopedSlots: {customRender: 'rivermanZNum'}, align: 'center'},
    {title: '湖长总数',scopedSlots: {customRender: 'lakemanZNum'}, align: 'center'},
    {title: '河长兼任湖长（包含总、副湖长）的人数',scopedSlots: {customRender: 'riverLakeZNum'}, align: 'center'},
    {title: '总计人数',scopedSlots: {customRender: 'sumZ'}, align: 'center'},
    {title: '村级河长总数',scopedSlots: {customRender: 'rivermanCNum'}, align: 'center'},
    {title: '湖长总数',scopedSlots: {customRender: 'lakemanCNum'}, align: 'center'},
    {title: '河长兼任湖长（包含总、副湖长）的人数',scopedSlots: {customRender: 'riverLakeCNum'}, align: 'center'},
    {title: '总计人数',scopedSlots: {customRender: 'sumC'}, align: 'center'},
  ];

  const modalTableColumns=[
    {title:'序号',dataIndex:'index'},
    {title:'河长姓名',dataIndex:'userName'},
    {title:'区域',dataIndex:'regionName'},
    {title:'类型',dataIndex:'type'},
    {title:'职位',dataIndex:'position'},
    {title:'联系电话',dataIndex:'telphone'},
  ];

  export default {
    data() {
      return {
        list:[],
        loading:true,
        columns,
        isModalVisible:false,
        modalTableData:[],
        isModalTableLoading:false,
        modalTableColumns,
        pagination:{
          current: 1,
          pageSize: 10,
          total:0,
          showTotal:total => `共 ${total} 条`
        },
        regionId:'',
        type:''
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){
        this.loading=true;
        get(`${BASE_URL}/analysis/v1/ProblemAnalysisController/selectUserRole`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.handleData(res.data)
          }
        })
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=index+1;
        });
        this.list=list;
      },
      resetSearchCondition(){

      },
      handleTableClick(e){
        const regionId=e.target.dataset.id;
        const index=e.target.dataset.index;
        if(regionId&&index){
           this.regionId=regionId;
           this.type=index;
           this.isModalVisible=true;
           this.getModalTableList();
        }
      },
      getModalTableList(){
        const params={
          regionId:this.regionId,
          type:this.type,
          pageSize:this.pagination.pageSize,
          pageNumber:this.pagination.current
        };
        this.isModalTableLoading=true;
        get(`${BASE_URL}/analysis/v1/ProblemAnalysisController/selectUserRoleDetail`,params).then(res=>{
          this.isModalTableLoading=false;
          if(res.resCode===1){
            const list=res.data.list;
            list.forEach((item,index)=>{
              item.index=(this.pagination.current-1)*this.pagination.pageSize+index+1;
            });
            this.modalTableData=list;
            this.pagination.total=res.data.total;
          }
        });
      },
      handleModalTableChange(e){
        this.pagination=e;
        this.getModalTableList();
      },
      handleCancel(){
        this.pagination.total=0;
        this.pagination.current=1;
        this.isModalVisible=false;
      }
    }
  }
</script>

<style scoped>

</style>
