<template>
  <div class="card-container">
    <a-card title="编辑" :bordered="false" style="min-height: 100%">
      <a-form :form="form">
        <a-row>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="河长姓名">
              <a-input placeholder="请输入河长姓名"
                       v-decorator="['name',{rules: [{ required: true, message: '请输入河长姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户姓名">
              <a-input placeholder="请输入用户姓名"
                       v-decorator="['userName',{rules: [{ required: true, message: '请输入用户姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="所属区域">
              <a-input :value="regionName" placeholder="请选择所属区域" readOnly @click="visible=true" style="cursor: pointer"></a-input>
              <a-input style="display: none" v-decorator="['regionCode',{rules: [{ required: true, message: '请选择所属区域!' }]}]"></a-input>
              <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="联系电话">
              <a-input placeholder="请输入联系电话"
                       v-decorator="['cellphone',{rules: [{ required: true, message: '请输入联系电话!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="河长职务">
              <a-input placeholder="请输入河长职务" v-decorator="['position']"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="河长类型">
              <a-select placeholder="请选择河长类型" v-decorator="['chairmanRole']">
                <a-select-option v-for="item in riverChiefType" :value="item.typeName" :key="item.id">{{item.typeName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="角色">
              <a-select placeholder="请选择角色"  mode="multiple" v-decorator="['role']">
                <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="河长级别">
              <a-select placeholder="请选择河长级别" v-decorator="['grade']">
                <a-select-option v-for="item in gradeList" :value="item.id" :key="item.id">{{item.typeName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="开通账号">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['status', { valuePropName: 'checked' ,initialValue:false}]" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="是否考核">
              <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['isAssess', { valuePropName: 'checked' ,initialValue:false}]" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="责任河段">
              <a-input placeholder="请选择责任河段" :value="reachName"  readOnly style="cursor: pointer" @click="showWaterBodyTreeModal(0)"></a-input>
              <a-input v-decorator="['reachIds']" style="display: none"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol" label="责任湖泊">
              <a-input placeholder="请选择责任湖泊" :value="lakeName"  readOnly style="cursor: pointer" @click="showWaterBodyTreeModal(1)"></a-input>
              <a-input v-decorator="['lakesIds']" style="display: none"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="责任水库">
              <a-input placeholder="请选择责任水库" :value="reservoirName" readOnly style="cursor: pointer" @click="showWaterBodyTreeModal(2)"></a-input>
              <a-input style="display: none" v-decorator="['reservoirIds']"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="责任坑塘">
              <a-input placeholder="请选择责任坑塘" :value="pondName"  readOnly style="cursor: pointer" @click="showWaterBodyTreeModal(3)"></a-input>
              <a-input style="display: none"  v-decorator="['pondIds']"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <WaterBodyTreeModal :visible="waterBodyTreeModalVisible" :water-type="waterType" @getWaterBody="getWaterBody"></WaterBodyTreeModal>
        <a-row>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="备注信息">
              <a-textarea rows="3" placeholder="请输入备注信息"  v-decorator="['description']"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="8">
            <a-form-item :wrapper-col="{span:formLayout.wrapperCol.span,offset:formLayout.labelCol.span}">
              <a-button type="primary" :loading="isSaveLoading" @click="submit">保存</a-button>
              <a-button style="margin-left: 20px" @click="$router.go(-1)">返回</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import RegionTreeModal from '../../../components/RegionTreeModal'
  import {get, post} from "../../../util/axios";
  import {
    GET_RIVER_CHIEF_DETAIL,
    GET_RIVER_CHIEF_GRADE,
    GET_RIVER_CHIEF_ROLE_LIST,
    GET_RIVER_CHIEF_TYPE
  } from "../../../api/information";
  import ARow from "ant-design-vue/es/grid/Row";
  import WaterBodyTreeModal from "../../../components/WaterBodyTreeModal";
  import ACol from "ant-design-vue/es/grid/Col";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {BASE_URL} from "../../../config/config";
  const formLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 15}
  };
  export default {
    components:{ATextarea, ACol, WaterBodyTreeModal, ARow, RegionTreeModal},
    data() {
      return {
        id:'',
        form:null,
        visible:false,
        formLayout,
        riverChiefType:[],
        roleList:[],
        gradeList:[],
        detail:null,
        waterBodyTreeModalVisible:false,
        waterType:null,
        regionName:null,
        reach:[],
        lake:[],
        reservoir:[],
        pond:[],
        isSaveLoading:false
      }
    },
    computed:{
      reachName(){
        console.log(this.reach);
        return this.reach.map(item=>item.name).join(',');
      },
      lakeName(){
        return this.lake.map(item=>item.name).join(',');
      },
      reservoirName(){
        return this.reservoir.map(item=>item.name).join(',');
      },
      pondName(){
        return this.pond.map(item=>item.name).join(',');
      }
    },
    beforeMount(){
      this.id=this.$route.query.id;
    },
    mounted(){
      this.getRiverChiefType();
      this.getRoleList();
      this.getRiverChiefGrade();
      this.form=this.$form.createForm(this);
      this.getDetail(this.id);
    },
    methods:{
      getDetail(id){
        get(GET_RIVER_CHIEF_DETAIL,{id:id}).then(res=>{
          if(res.resCode===1){
            const value=res.data;
            this.form.setFieldsValue({
              name: value.name,
              userName:value.userName,
              position: value.position,
              cellphone:value.cellphone,
              description: value.description,
              regionCode: value.regionCode,
              status: value.status,
              chairmanRole: value.chairmanRole,
              isAssess: value.isAssess,
              docId: value.docId,
              reachIds: value.reachIds,
              lakesIds: value.lakesIds,
              pondIds: value.pondIds,
              reservoirIds:value.reservoirIds ,
              role: value.roles.map(item=>item.id)
            });
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
          type: '116'//TODO
        };
        get(GET_RIVER_CHIEF_GRADE,params).then(res=>{
          if(res.resCode===1){
            this.gradeList=res.data;
          }
        })
      },
      getRegion(e){
        this.form.setFieldsValue({
          regionCode:e.id
        });
        this.regionName=e.name;
      },
      showWaterBodyTreeModal(waterType){
        this.waterType=waterType;
        this.waterBodyTreeModalVisible=true;
      },
      getWaterBody(e){
        this.waterBodyTreeModalVisible=false;
        if(this.waterType===0){
          this.reach=e;
          this.form.setFieldsValue({
            reachIds:e
          });
        }else if(this.waterType===1){
          this.lake=e;
          this.form.setFieldsValue({
            lakesIds:e
          });
        }else if(this.waterType===2){
          this.reservoir=e;
          this.form.setFieldsValue({
            reservoirIds:e
          });
        }else if(this.waterType===3){
          this.pond=e;
          this.form.setFieldsValue({
            pondIds:e
          });
        }
      },
      submit(){
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading=true;
            const data=new FormData();
            for (let key in value){
              if(value[key]){
                if(typeof value[key]==='string'){
                  data.append(key,value[key]);
                }else {
                  data.append(key,JSON.stringify(value[key]));
                }
              }else {
                data.append(key,'');
              }
            }
            data.set('status',(value.status?1:2).toString());
            data.set('isAssess',(value.isAssess?1:2).toString());
            post(`${BASE_URL}/watersource/v1/reachChairMan/addUser`,null,data).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('新增成功');
                setTimeout(()=>{
                  this.$router.replace('/information/river-chief-directory');
                },1500);
              }
            })
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
