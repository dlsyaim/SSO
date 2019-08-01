<template>
  <div class="card-container">
    <a-card title="新增" :bordered="false" style="min-height: 100%">
      <a-form :form="form">
        <a-row>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="河长姓名">
              <a-input placeholder="请输入河长姓名"
                       v-decorator="['name',{rules: [{ required: true, message: '请输入河长姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="用户姓名">
              <a-input placeholder="请输入用户姓名"
                       v-decorator="['userName',{rules: [{ required: true, message: '请输入用户姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="所属区域">
              <a-input placeholder="请选择所属区域"
                       v-decorator="['regionName',{rules: [{ required: true, message: '请选择所属区域!' }]}]" readOnly @click="visible=true" style="cursor: pointer"></a-input>
              <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="联系电话">
              <a-input placeholder="请输入联系电话"
                       v-decorator="['cellphone',{rules: [{ required: true, message: '请输入联系电话!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="河长职务">
              <a-select placeholder="请选择河长职务" v-decorator="['position']">
                <a-select-option v-for="item in riverChiefType" :value="item.id" :key="item.id">{{item.typeName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="角色">
              <a-select placeholder="请选择角色"  mode="multiple" v-decorator="['role']">
                <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="河长级别">
              <a-select placeholder="请选择河长级别" v-decorator="['grade']">
                <a-select-option v-for="item in gradeList" :value="item.id" :key="item.id">{{item.typeName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="开通账号">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['status', { valuePropName: 'checked' ,initialValue:false}]" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="是否考核">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['isAssess', { valuePropName: 'checked' ,initialValue:false}]" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="责任河段">
              <a-input placeholder="请选择责任河段" v-decorator="['cellphone']" readOnly style="cursor: pointer" @click="showWaterBodyTreeModal(1)" @getWaterBody="getWaterBody"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="责任湖泊">
              <a-input placeholder="请选择责任湖泊" v-decorator="['cellphone']" readOnly style="cursor: pointer"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="责任水库">
              <a-input placeholder="请选择责任水库" v-decorator="['cellphone']" readOnly style="cursor: pointer"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="责任坑塘">
              <a-input placeholder="请选择责任坑塘" v-decorator="['cellphone']" readOnly style="cursor: pointer"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <WaterBodyTreeModal :visible="waterBodyTreeModalVisible" :water-type="waterType" :region-code="regionCode"></WaterBodyTreeModal>
        <a-row>
          <a-col span="8">
            <a-form-item :wrapper-col="{span:formLayout.wrapperCol.span,offset:formLayout.labelCol.span}">
               <a-button type="primary">保存</a-button>
              <a-button style="margin-left: 20px" @click="$router.go(-1)">返回</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <!--<a-modal-->
      <!--title="Title"-->
      <!--:visible="isModalVisible"-->
      <!--@ok="handleOk"-->
      <!--:confirmLoading="confirmLoading"-->
    <!--&gt;-->

    <!--</a-modal>-->
  </div>
</template>

<script>
  import RegionTreeModal from '../../../components/RegionTreeModal'
  import {get} from "../../../util/axios";
  import {
    GET_RIVER_CHIEF_DETAIL,
    GET_RIVER_CHIEF_GRADE,
    GET_RIVER_CHIEF_ROLE_LIST,
    GET_RIVER_CHIEF_TYPE
  } from "../../../api/information";
  import ARow from "ant-design-vue/es/grid/Row";
  import WaterBodyTreeModal from "../../../components/WaterBodyTreeModal";
  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
  };
  export default {
    components:{WaterBodyTreeModal, ARow, RegionTreeModal},
    data() {
      return {
        isEdit:false,
        form:null,
        visible:false,
        formLayout,
        riverChiefType:[],
        roleList:[],
        gradeList:[],
        detail:null,
        waterBodyTreeModalVisible:false,
        waterType:null,
        regionCode:null
      }
    },
    beforeMount(){
      const id=this.$route.query.id;
      if(id){
        this.isEdit=true;
        this.getDetail(id);
      }else {
        this.isEdit=false;
      }
      this.form=this.$form.createForm(this);
    },
    mounted(){
      this.getRiverChiefType();
      this.getRoleList();
      this.getRiverChiefGrade();
    },
    methods:{
      getDetail(id){
        get(GET_RIVER_CHIEF_DETAIL,{id:id}).then(res=>{
          if(res.resCode===1){
            this.detail=res.data;
          }
        })
      },
      getRiverChiefType(){
        get(GET_RIVER_CHIEF_TYPE).then(res=>{
          if(res.resCode===1){
            this.riverChiefType=res.data;
          }
        })
      },
      getRoleList(){
        get(GET_RIVER_CHIEF_ROLE_LIST).then(res=>{
          if(res.resCode===1){
            this.roleList=res.data;
          }
        })
      },
      getRiverChiefGrade(){
        const params= {
          type: '116'
        };
        get(GET_RIVER_CHIEF_GRADE,params).then(res=>{
          if(res.resCode===1){
            this.gradeList=res.data;
          }
        })
      },
      getRegion(e){
        this.form.setFieldsValue({
          regionName:e.name
        });
        this.regionCode=e.id;
      },
      showWaterBodyTreeModal(waterType){

      },
      getWaterBody(e){

      }
    }
  }
</script>

<style scoped>

</style>
