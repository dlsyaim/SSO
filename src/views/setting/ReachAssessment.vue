<template>
  <div class="card-container">
    <a-card title="河段排名" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>区县：</span>
        <a-select class="default-select-width" placeholder="请选择区县" v-model="region" style="margin-right: 3%">
          <a-select-option v-for="item in regionList" :key="item.id" :value="item.regionCode">{{item.regionName}}
          </a-select-option>
        </a-select>
        <span>是否含污水处理厂：</span>
        <a-radio-group v-model="isSewageFactory" style="margin-right: 3%">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
        <span>水质监测补偿：</span>
        <a-radio-group v-model="isCompensation" style="margin-right: 3%">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
        <span>水质评分规则：</span>
        <a-select class="default-select-width" placeholder="请选择水质评分规则" v-model="ruleId" style="margin-right: 3%">
          <a-select-option v-for="item in ruleList" :key="item.id" :value="item.ruleId">{{item.ruleName}}
          </a-select-option>
        </a-select>
        <span>是否水质考核：</span>
        <a-radio-group v-model="isWaterQualityAssess" style="margin-right: 3%">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
      </div>
      <div style="margin-top: 18px" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination">
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
      width="800px"
      :confirmLoading="isSaveLoading"
      @cancel="isModalVisible=false"
    >
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="区县">
              <a-input :value="selected.regionName" disabled></a-input>
              <a-input v-decorator="['regionCode']" style="display: none"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="河道">
              <a-input :value="selected.riverName" disabled></a-input>
              <a-input v-decorator="['riverCode']" style="display: none"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="河段">
              <a-input :value="selected.reachName" disabled></a-input>
              <a-input v-decorator="['reachCode']" style="display: none"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="目标水质类别">
              <a-select placeholder="请选择目标水质类别" v-decorator="['targetWaterQuality', {rules: [{ required: true, message: '请选择目标水质类别!' }]}]">
                <a-select-option v-for="(value,name) in waterQualityEnum" :key="name" :value="name">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="年度目标水质">
              <a-select placeholder="请选择年度目标水质" v-decorator="['yearTargetWaterQuality', {rules: [{ required: true, message: '请选择年度目标水质!' }]}]">
                <a-select-option v-for="(value,name) in waterQualityEnum" :key="name" :value="name">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="含污水处理厂">
              <a-radio-group v-decorator="['isSewageFactory', {rules: [{ required: true, message: '请选择是否含污水处理厂!' }]}]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="水质监测补偿">
              <a-radio-group v-decorator="['isCompensation', {rules: [{ required: true, message: '请选择水质监测补偿!' }]}]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="是否水质考核">
              <a-radio-group v-decorator="['isWaterQualityAssess', {rules: [{ required: true, message: '请选择是否水质考核!' }]}]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="入境断面">
              <a-select placeholder="请选择入境断面" v-decorator="['inputSectionCode', {rules: [{ required: true, message: '请选择入境断面!' }]}]">
                <a-select-option v-for="item in sectionList" :key="item.id" :value="item.sectionCode">{{item.sectionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="出境断面">
              <a-select placeholder="请选择出境断面" v-decorator="['outputSectionCode', {rules: [{ required: true, message: '请选择出境断面!' }]}]">
                <a-select-option v-for="item in sectionList" :key="item.id" :value="item.sectionCode">{{item.sectionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="水质评分规则">
              <a-select placeholder="请选水质评分规则" v-decorator="['scoringRuleId', {rules: [{ required: true, message: '请选水质评分规则!' }]}]">
                <a-select-option v-for="item in ruleList" :key="item.id" :value="item.ruleId">{{item.ruleName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {get, put} from "../../util/axios";
  import {BASE_URL, tablePaginationConfig} from "../../config/config";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '区县', dataIndex: 'regionName'},
    {title: '河道', dataIndex: 'riverName'},
    {title: '河段', dataIndex: 'reachName'},
    {title: '入境断面', dataIndex: 'inputSection'},
    {title: '出境断面', dataIndex: 'outputSection'},
    {title: '目标水质类别', dataIndex: 'targetWaterQualityName'},
    {title: '年度水质目标', dataIndex: 'yearTargetWaterQualityName'},
    {title: '是否含污水处理厂', dataIndex: 'isSewageFactoryName'},
    {title: '水质检测补偿', dataIndex: 'isCompensationName'},
    {title: '水质评分规则', dataIndex: 'scoringRules'},
    {title: '水质考核', dataIndex: 'isWaterQualityAssessName'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 120}
  ];

  const formLayout={labelCol: {span: 7},wrapperCol: {span: 15}};

  export default {
    components: {ACol, ARow},
    data() {
      return {
        regionList: [],
        region: undefined,
        isSewageFactory: undefined,
        isCompensation: undefined,
        ruleList: [],
        ruleId: undefined,
        isWaterQualityAssess: undefined,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        waterQualityEnum: {
          1: 'Ⅱ',
          2: 'Ⅲ',
          3: 'Ⅳ',
          4: 'Ⅴ',
          5: '一级A',
          6: '一级B'
        },
        sectionList: [],
        form: null,
        isModalVisible: false,
        isSaveLoading: false,
        formLayout,
        selected:{}
      }
    },
    mounted() {
      this.getList();
      this.getRegionList();
      this.getRuleList();
      this.getSectionList();
      this.form=this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          pageNumber: this.pagination.current,
          pageSize: this.pagination.pageSize,
          region: this.region,
          isSewage: this.isSewage,
          isCompensation: this.isCompensation,
          ruleId: this.ruleId,
          isWaterQualityAssess: this.isWaterQualityAssess
        };
        get(`${BASE_URL}/statistic/v1/reachAssess/listReachAssess`, params).then(res => {
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
          item.targetWaterQualityName = this.waterQualityEnum[item.targetWaterQuality];
          item.yearTargetWaterQualityName = this.waterQualityEnum[item.yearTargetWaterQuality];
          item.isSewageFactoryName = item.isSewageFactory === 0 ? '否' : '是';
          item.isCompensationName = item.isCompensation === 0 ? '否' : '是';
          item.isWaterQualityAssessName = item.isWaterQualityAssess === 0 ? '不考核' : '考核';
        });
        this.list = list;
      },
      getRegionList() {
        get(`${BASE_URL}/statistic/v1/reachAssess/regionList`).then(res => {
          if (res.resCode === 1) {
            this.regionList = res.data;
          }
        })
      },
      getRuleList() {
        get(`${BASE_URL}/statistic/v1/reachAssess/waterQualityRuleList`).then(res => {
          if (res.resCode === 1) {
            this.ruleList = res.data;
          }
        })
      },
      getSectionList() {
        get(`${BASE_URL}/statistic/v1/reachAssess/listSections`).then(res => {
          if (res.resCode === 1) {
            this.sectionList = res.data;
          }
        });
      },
      resetSearchCondition() {
        this.region = undefined;
        this.isSewageFactory = undefined;
        this.isCompensation = undefined;
        this.ruleId = undefined;
        this.isWaterQualityAssess = undefined;
      },
      handleTableClick(e) {
        const id=e.target.dataset.id;
        const method=e.target.dataset.method;
        if(id&&method){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='modify'){
            this.isModalVisible=true;
            this.$nextTick(()=>{
              this.form.setFieldsValue({
                reachCode:this.selected.reachCode,
                regionCode:this.selected.regionCode,
                riverCode:this.selected.riverCode,
                riverType:this.selected.riverType,
                isWaterQualityAssess:this.selected.isWaterQualityAssess,
                isCompensation:this.selected.isCompensation,
                isSewageFactory:this.selected.isSewageFactory,
                targetWaterQuality:this.selected.targetWaterQuality,
                yearTargetWaterQuality:this.selected.yearTargetWaterQuality,
                inputSectionCode:this.selected.inputSectionCode,
                outputSectionCode:this.selected.outputSectionCode,
                scoringRuleId:this.selected.scoringRuleId,
              })
            });
          }
        }
      },
      handleOk(){
        this.form.validateFields((err,value)=>{
          if(!err){
            const params=Object.assign({},value,{id:this.selected.id});
            this.isSaveLoading=true;
            put(`${BASE_URL}/statistic/v1/reachAssess/updateReachAssess`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('修改成功');
                this.getList();
                setTimeout(()=>{
                  this.isModalVisible=false;
                },1500)
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
