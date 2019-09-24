<template>
  <div class="card-container">
    <a-card title="编辑河段" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%;" :style="{display:isMapMax?'none':'block'}">
          <a-form :form="form">
            <a-row>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段名称">
                  <a-input v-decorator="['reachName']" readOnly/>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="所属河流">
                  <a-input placeholder="请选择所属河流" :value="river.name" readOnly style="cursor: pointer" @click="isRiverTreeModalVisible=true"></a-input>
                  <input v-decorator="['pName',{rules:[{required:true,message:'请选择所属河流'}]}]" style="display: none"/>
                  <river-tree-modal v-model="isRiverTreeModalVisible" @getRiver="getRiver"></river-tree-modal>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="所属区域">
                  <a-input style="cursor: pointer" @click="isRegionTreeModalVisible=true" :value="region.name" readOnly
                           placeholder="请选择所属区域"></a-input>
                  <input style="display: none" v-decorator="['regionCode',{rules:[{required:true,message:'请选择所属区域'}]}]"/>
                  <region-tree-modal v-model="isRegionTreeModalVisible" @getRegion="getRegion"></region-tree-modal>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段别名">
                  <a-input v-decorator="['alias']" placeholder="请输入河段别名"/>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段级别">
                  <a-select v-decorator="['grade',{rules:[{required:true,message:'请选择河段级别'}]}]" placeholder="请选择河段级别">
                    <a-select-option v-for="item in reachGradeList" :key="item.id" :value="item.typeValue" >
                      {{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="水质等级">
                  <a-select v-decorator="['waterGrade']" placeholder="请选择水质等级">
                    <a-select-option v-for="item in waterLevelList" :key="item.id" :value="item.typeValue" >
                      {{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段岸别">
                  <a-select v-decorator="['shore',{rules:[{required:true,message:'请选择河段岸别'}]}]" placeholder="请选择河段岸别">
                    <a-select-option v-for="item in reachBankPartList" :key="item.id" :value="item.typeValue" >
                      {{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段长度">
                  <a-input placeholder="河段长度可由绘制得出" addonAfter="km"
                           v-decorator="['length',{rules:[{required:true,message:'请输入河流长度'}]}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河段宽度">
                  <a-input placeholder="请输入河段宽度" addonAfter="km" v-decorator="['width']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="所属水系">
                  <a-input style="cursor: pointer" @click="isWaterSystemModalVisible=true" :value="waterSystem.name"
                           readOnly placeholder="请选择所属水系"></a-input>
                  <input style="display: none" v-decorator="['waterCode',{rules:[{required:true,message:'请选择所属水系'}]}]"/>
                  <WaterSystemTreeModal v-model="isWaterSystemModalVisible"
                                        @getWaterSystem="getWaterSystem"></WaterSystemTreeModal>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="淤积情况">
                  <a-select v-decorator="['silty']" placeholder="请选择淤积情况">
                    <a-select-option v-for="item in depositList" :key="item.id" :value="item.typeValue" >
                      {{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="是否虚拟">
                  <a-radio-group v-decorator="['isVirtual',{rules:[{required:true,message:'请选择所属水系'}]}]">
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="是否位于山区">
                  <a-radio-group v-decorator="['whether']">
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流起点">
                  <a-input placeholder="请输入河流起点" v-decorator="['startPoint']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流终点">
                  <a-input placeholder="请输入河流终点" v-decorator="['endPoint']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="起点断面">
                  <a-input placeholder="请选择起点断面" v-decorator="['startSection']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="终点断面">
                  <a-input placeholder="请选择终点断面" v-decorator="['endSection']"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="16">
                <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="流经区域">
                  <a-input placeholder="请选择流经区域" :value="checkedRegionName" readOnly style="cursor: pointer"
                           @click="isCheckAbleRegionTreeModalVisible=true"></a-input>
                  <input style="display: none" v-decorator="['throughArea']"/>
                  <CheckableRegionTreeModal v-model="isCheckAbleRegionTreeModalVisible"
                                            @getCheckedRegion="getCheckedRegion"></CheckableRegionTreeModal>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="24">
                <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="备注信息">
                  <RichTextEditor tag-id="desc" @getEditorContent="editorContent=$event"></RichTextEditor>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="备注信息">
              <a-textarea rows="4" placeholder="请输入备注" v-decorator="['remark']"></a-textarea>
            </a-form-item>
            <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="附件">
              <a-upload @change="uploadFile"
                        name="files"
                        :fileList="fileList"
                        :action="BASE_URL+'/watersource/v1/attachment/upload'"
                        :remove="handleFileRemove">
                <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                  <a-button>
                    <a-icon type="upload"/>
                    文件上传
                  </a-button>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item v-bind="{wrapperCol: {span: 21,offset:2}}">
              <a-upload @change="uploadPicture"
                        name="files"
                        listType="picture"
                        :fileList="pictureList"
                        accept="image/*"
                        :action="BASE_URL+'/watersource/v1/attachment/upload'"
                        :remove="handlePictureRemove">
                <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                  <a-button>
                    <a-icon type="upload"/>
                    图片上传
                  </a-button>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="管理人员">
              <manager-form v-for="item in formList" :key="item.id" ref="manageForm" :form-id="item.id"
                            @deleteForm="deleteForm"></manager-form>
              <a-button type="dashed" style="width: 280px;" @click="addForm">
                <a-icon type="plus"/>
                添加
              </a-button>
            </a-form-item>
            <a-form-item v-bind="{wrapperCol: {span: 21,offset:2}}">
              <a-button :loading="isSaveLoading" type="primary" @click="save">保存</a-button>
              <a-button @click="$router.go(-1)" style="margin-left: 20px">返回</a-button>
            </a-form-item>

          </a-form>
        </div>
        <div style="width: 25%;border: 1px solid #cccccc;position: relative;z-index: 10;"
             :style="{height:isMapMax?'800px':'400px',width:isMapMax?'100%':'25%'}">
          <div id="map" style="height: 100%;width: 100%;"></div>
          <a-button-group style="position: absolute;right: 10px;top: 10px;z-index: 600">
            <a-button title="画面" @click="draw" style="padding: 0 8px">
              <a-icon type="highlight" style="font-size: 20px"/>
            </a-button>
            <a-button title="删除" @click="clear" style="padding: 0 8px">
              <a-icon type="delete" style="font-size: 20px"/>
            </a-button>
            <a-button title="显示" @click="isCurrentTravelVisible=true" style="padding: 0 8px">
              <a-icon type="fund" style="font-size: 20px"/>
            </a-button>
            <a-button title="缩放" @click="changeMapSize" style="padding: 0 8px" v-if="isMapMax">
              <a-icon type="fullscreen-exit" style="font-size: 20px"/>
            </a-button>
            <a-button title="最大化" @click="changeMapSize" style="padding: 0 8px" v-else>
              <a-icon type="fullscreen" style="font-size: 20px"/>
            </a-button>
          </a-button-group>
        </div>
      </div>
      <a-modal title="绘制轨迹"
               :visible="isCurrentTravelVisible"
               :footer="null"
               @cancel="isCurrentTravelVisible=false">
        <div style="height: 320px;overflow-y: auto;display: flex;align-items: center;justify-content: center">
          <div v-if="currentTravel" style="color: rgba(0,0,0,.85);font-size: 15px">
            <p v-for="item in currentTravel.currentLnglats" :key="item.lat">{{item.lng}} , {{item.lat}}</p>
          </div>
          <div v-else style="display: flex;align-items: center;flex-direction: column">
            <img src="../../../assets/no-data.svg"/>
            <span style="margin-top: 16px;color: rgba(0,0,0,.35)">暂无绘制轨迹</span>
          </div>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {BASE_URL} from "../../../config/config";
  import {get, post} from "../../../util/axios";
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import WaterSystemTreeModal from "../../../components/WaterSystemTreeModal";
  import RichTextEditor from "../../../components/RichTextEditor";
  import CheckableRegionTreeModal from "../../../components/CheckableRegionTreeModal";
  import RiverTreeModal from "../../../components/RiverTreeModal";
  import ManagerForm from "../../../components/ManagerForm";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {
      ManagerForm,
      RiverTreeModal,
      CheckableRegionTreeModal, RichTextEditor, WaterSystemTreeModal, RegionTreeModal, ACol, ARow},
    data() {
      return {
        id:'',
        detail:{},
        isMapMax: false,
        form: null,
        formLayout,
        isRiverTreeModalVisible:false,
        river:{},
        isRegionTreeModalVisible: false,
        region: {},
        reachGradeList:[],
        waterLevelList: [],
        reachBankPartList:[],
        depositList:[],
        isWaterSystemModalVisible: false,
        waterSystem: {},
        editorContent: '',
        BASE_URL,
        fileList: [],
        pictureList: [],
        formList:[],
        isSaveLoading: false,
        isCheckAbleRegionTreeModalVisible: false,
        checkedRegionName: '',
        drawLineTool: null,
        map: null,
        currentTravel: '',//当前绘制轨迹
        isCurrentTravelVisible: false
      }
    },
    mounted() {
      this.id=this.$route.query.id;
      this.form = this.$form.createForm(this);
      this.getReachGradeList();
      this.getWaterLevelList();
      this.getReachBankPartList();
      this.getDepositList();
      this.getDetail();
    },
    methods: {
      getDetail(){
        get(`${BASE_URL}/watersource/v1/reach/detail?id=${this.id}`).then(res=>{
          if(res.resCode===1){
            const data=res.data;
            this.detail=Object.seal(data);
            this.editorContent=data.overView;
            this.form.setFieldsValue({
              lakesName:data.lakesName,
              regionCode:data.regionCode,
              waterCode:data.waterCode,
              lakesType:data.lakesType,
              lakeshore:data.lakeshore,
              acreage:data.acreage,
              longitude:data.longitude,
              latitude:data.latitude,
              capacity:data.capacity,
              location:data.location,
              throughArea:data.throughArea,
              remark:data.remark
            });
            this.region.name=data.regionName;
            this.waterSystem.waterName=data.waterName;
            this.checkedRegionName=data.throughAreaName;
            if(data.chairmanList.length!==0){
              const formList=[];
              data.chairmanList.forEach((item,index)=>{
                let form={
                  initialValue:item,
                  id:index
                  // 这里使用时间戳可能会造成id重复
                  // id:(new Date()).getTime()
                };
                formList.push(form);
              });
              this.formList=formList;
            }
            const fileList=[];
            data.jsonFiles.forEach(item=>{
              let file={};
              file.name=item.name;
              file.uid=item.virtualPath;
              file.responseUrl=item;
              fileList.push(file);
            });
            this.fileList=fileList;
            const pictureList=[];
            data.jsonImages.forEach(item=>{
              let picture={};
              picture.name=item.name;
              picture.uid=item.virtualPath;
              picture.responseUrl=item;
              pictureList.push(picture);
            });
            this.pictureList=pictureList;
            this.initMap();
          }
        });
      },
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
        const pointString=this.detail.linePoints;
        const pointArray=[];
        if(pointString){
          const points = [];
          pointString.split(',').forEach(item=>{
            let arr=item.split(' ').map(item=>+item);
            pointArray.push(arr);
          });
          this.map.centerAndZoom(new T.LngLat(pointArray[0][0], pointArray[0][1]), 12);
          pointArray.forEach(item=>{
            points.push(new T.LngLat(item[0], item[1]));
          });
          const polygon = new T.Polygon(points);
          this.map.addOverLay(polygon);
        }
      },
      getReachGradeList(){
        get(`${BASE_URL}/watersource/v1/river/riverType`,{type: '116'}).then(res => {
          if (res.resCode === 1) {
            this.reachGradeList = res.data;
          }
        });
      },
      getWaterLevelList(){
        get(`${BASE_URL}/watersource/v1/river/riverType`,{type: '154'}).then(res => {
          if (res.resCode === 1) {
            this.waterLevelList = res.data;
          }
        });
      },
      getReachBankPartList(){
        get(`${BASE_URL}/watersource/v1/river/riverType`,{type: '110'}).then(res => {
          if (res.resCode === 1) {
            this.reachBankPartList = res.data;
          }
        });
      },
      getDepositList(){
        get(`${BASE_URL}/watersource/v1/river/riverType`,{type: '161'}).then(res => {
          if (res.resCode === 1) {
            this.depositList = res.data;
          }
        });
      },
      addForm() {
        const form = {
          id: (new Date()).getTime(),
          data: null
        };
        this.formList = [...this.formList, form];
      },
      deleteForm(e) {
        this.formList = this.formList.filter(item => item.id !== e);
      },
      save() {
        const chairmanList = [];
        let managerFormHasError = false;
        if (this.formList.length !== 0) {
          this.$refs.manageForm.forEach(item => {
              let chairman = item.submit();
              if (chairman !== null) {
                chairmanList.push(chairman);
              } else {
                // 一旦某个子表单验证出错，则后续验证主表单时不提交，但是还要验证，给与用户错误提示
                managerFormHasError = true;
              }
            }
          )
        }
        this.form.validateFields((err, value) => {
          if (!err&&!managerFormHasError) {
            this.isSaveLoading = true;
            const data = new FormData();
            for (let key in value) {
              let v=value[key];
              if(!v&&v!==0){
                v='';
              }
              data.append(key,v);
            }
            if(this.currentTravel){
              const linePoint=this.currentTravel.currentLnglats.map(item=>[item.lng+' '+item.lat]).join(',');
              data.append('linePoints',linePoint);
              data.append('spatialData',`MULTIPOLYGON(((${linePoint})))`);
            }
            data.append('overView', this.editorContent);
            const file = this.fileList.filter(item => !!item.responseUrl).map(item => item.responseUrl);
            data.append('jsonFiles', JSON.stringify(file));
            const picture = this.pictureList.filter(item => !!item.responseUrl).map(item => item.responseUrl);
            data.append('jsonImages', JSON.stringify(picture));
            data.append('chairmanList',JSON.stringify(chairmanList));
            post(`${BASE_URL}/watersource/v1/reach/add`,null,data).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('新增成功');
                setTimeout(()=>{
                  this.$router.replace('/information/reach');
                },1500);
              }
            })
          }
        })
      },
      getRiver(e){
        this.river=e;
        this.form.setFieldsValue({
          pName:e.id
        });
      },
      getRegion(e) {
        this.region = e;
        this.map.centerAndZoom(new T.LngLat(e.longitude, e.latitude), 10+parseInt(e.grade));
        this.form.setFieldsValue({
          regionCode: e.id
        });
      },
      getWaterSystem(e) {
        this.waterSystem = e;
        this.form.setFieldsValue({
          waterCode: e.name
        });
      },
      getCheckedRegion(e) {
        this.checkedRegionName = e.map(item => item.name).join(',');
        this.form.setFieldsValue({
          throughArea: e.map(item => item.id).join(',')
        });
      },
      draw() {
        if (this.drawLineTool) {
          this.drawLineTool.clear();
          this.drawLineTool.close()
        }
        this.drawLineTool = new T.PolylineTool(this.map);
        this.drawLineTool.open();
        this.drawLineTool.addEventListener('draw', this.drawEnd);
      },
      clear() {
        if (this.drawLineTool) {
          this.drawLineTool.clear();
          this.currentTravel = '';
          this.form.setFieldsValue({
            length: ''
          });
        }
      },
      drawEnd(e) {
        this.form.setFieldsValue({
          length: (e.currentDistance/1000).toFixed(2)
        });
        this.currentTravel = e;
      },
      changeMapSize() {
        this.isMapMax = !this.isMapMax;
        setTimeout(() => {
          this.map.checkResize();
        }, 10);
      },
      uploadFile({file, fileList}) {
        this.fileList = fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.fileList.forEach(item => {
            if (item.uid === file.uid) {
              item.responseUrl = file.response.data[0];
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handleFileRemove(file) {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      },
      uploadPicture({file, fileList}) {
        this.pictureList = fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.pictureList.forEach(item => {
            if (item.uid === file.uid) {
              item.responseUrl = file.response.data[0];
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handlePictureRemove(file) {
        this.pictureList = this.pictureList.filter(item => item.uid !== file.uid);
      }
    }
  }
</script>

<style scoped>

</style>
