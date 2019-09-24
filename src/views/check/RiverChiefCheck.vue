<template>
  <div class="card-container">
    <a-card title="河长制考核" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>月份：</span>
        <a-month-picker v-model="month" placeholder="请选择月份" style="margin-right: 40px" />
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.index"
                 :dataSource="list"
                 :pagination="false"
                 :loading="loading">
        <span slot="action" slot-scope="item">
          <span data-method="modify" :data-id="item.id" class="table-operation">分值修正</span>
        </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      title="修正分值"
      v-model="isModalVisible"
      :confirmLoading="isSaveLoading"
      @ok="modify">
      <a-form :form="form">
        <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="月度考核总成绩">
          <a-input placeholder="请输入月度考核总成绩"
                   v-decorator="['score',{rules: [{ required: true, message: '请输入名称!' }]}]"></a-input>
        </a-form-item>
        <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="备注">
          <a-input placeholder="请输入备注"
                   v-decorator="['remark']"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment';
  import {get, post} from "../../util/axios";
  import {GET_ASSESSMENT_RATE, GET_ASSESSMENT_STATISTICS_LIST, UPDATE_ASSEMENT_SCORE} from "../../api/statistic";

  const columns=[
    {title:'排名',dataIndex:'index'},
    {title:'街道',dataIndex:'regionName'},
    {title:'区域地表水环境质量',dataIndex:'surfaceWaterScore'},
    {title:'各类扣分问题',dataIndex:'eventScore'},
    {title:'河长履职',dataIndex:'patrolScore'},
    {title:'社会监督评价',dataIndex:'supervisionScore'},
    {title:'月度考核总成绩',dataIndex:'resultScore'},
    {title:'备注',dataIndex:'remark'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}}
  ];

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    data() {
      return {
        month:moment().subtract(1,'months'),
        list:[],
        loading:true,
        columns,
        selected:{},
        form:null,
        formLayout,
        isModalVisible:false,
        isSaveLoading:false
      }
    },
    mounted(){
      this.getRate();
      this.form=this.$form.createForm(this);
    },
    methods:{
      getList(){
        this.loading=true;
        const month=this.month;
        const params={
          date:month?moment(month).format('YYYY-MM'):moment().subtract(1,'months').format('YYYY-MM')
        };
        get(GET_ASSESSMENT_STATISTICS_LIST,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.handleData(res.data);
          }
        })
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=index+1;
        });
        this.list=list;
      },
      getRate(){
        get(GET_ASSESSMENT_RATE,{id:'6ef547e6697611e9bf70f01fafcf3a37'}).then(res=>{
          this.getList();
          if(res.resCode===1){
            this.columns=[
              {title:'排名',dataIndex:'index'},
              {title:'街道',dataIndex:'regionName'},
              {title:`区域地表水环境质量 （${res.data.surfaceWater*100}%）`,dataIndex:'surfaceWaterScore'},
              {title:`各类扣分问题 （${res.data.variousProblem*100}%）`,dataIndex:'eventScore'},
              {title:`河长履职 （${res.data.chairmanDuty*100}%）`,dataIndex:'patrolScore'},
              {title:`社会监督评价 （${res.data.socialSupervise*100}%）`,dataIndex:'supervisionScore'},
              {title:'月度考核总成绩',dataIndex:'resultScore'},
              {title:'备注',dataIndex:'remark'},
              {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}}
            ];
          }
        })
      },
      resetSearchCondition(){
        this.month=moment().subtract(1,'months');
      },
      handleTableClick(e){
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='modify'){
            this.showModifyModal();
          }
        }
      },
      showModifyModal(){
        this.isModalVisible=true;
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            score: this.selected.resultScore,
            remark:this.selected.remark
          });
        })
      },
      modify(){
        this.form.validateFields((err, values) => {
          if (!err) {
            this.isSaveLoading = true;
            const params=Object.assign({},values,{id:this.selected.id});
            post(UPDATE_ASSEMENT_SCORE,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('修改成功');
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

<style scoped>

</style>
