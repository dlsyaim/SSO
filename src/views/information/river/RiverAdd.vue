<template>
  <div class="card-container">
    <a-card title="新增河流" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%;" :style="{display:isMapMax?'none':'block'}">
          <a-form :form="form">
            <a-row>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流名称">
                  <a-input placeholder="请输入河流名称"
                           v-decorator="['riverName',{rules:[{required:true,message:'请输入河流名称'},riverNameAsyncValidator],validateFirst:true,validateTrigger:'blur'}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流编码">
                  <a-input placeholder="请输入河流编码" v-decorator="['riverCode']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="行政区域">
                  <a-input style="cursor: pointer" @click="isRegionTreeModalVisible=true" :value="region.name" readOnly
                           placeholder="请选择行政区域"></a-input>
                  <input style="display: none"
                         v-decorator="['regionCode',{rules:[{required:true,message:'请选择行政区域'}]}]"/>
                  <RegionTreeModal v-model="isRegionTreeModalVisible" @getRegion="getRegion"></RegionTreeModal>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流类型">
                  <a-select v-decorator="['riverType']" placeholder="请选择河流类型">
                    <a-select-option v-for="item in riverTypeList" :key="item.id" :value="item.id">{{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流功能">
                  <a-select v-decorator="['feature']" placeholder="请选择河流功能">
                    <a-select-option v-for="item in riverFunctionList" :key="item.id" :value="item.id">
                      {{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流长度">
                  <a-input placeholder="河流长度可由绘制得出" addonAfter="km"
                           v-decorator="['length',{rules:[{required:true,message:'请输入河流长度'}]}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流经度">
                  <a-input placeholder="河流经度可由绘制得出" v-decorator="['midPointLongitude']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="河流纬度">
                  <a-input placeholder="河流纬度可由绘制得出" v-decorator="['midPointLatitude']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域面积">
                  <a-input placeholder="请输入流域面积" addonAfter="km²" v-decorator="['area']"></a-input>
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
                        :action="BASE_URL+'/analysis/v1/saAbarbeitung/upload'"
                        :remove="handlePictureRemove">
                <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                  <a-button>
                    <a-icon type="upload"/>
                    图片上传
                  </a-button>
                </div>
              </a-upload>
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

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  const riverNameAsyncValidator = {
    validator: (rules, value, callback) => {
      get(`${BASE_URL}/watersource/v1/river/isRepeat?name=${value}`).then(res => {
        if (res.resCode !== 1) {
          callback(new Error());
        }
      })
    }, message: '用户名已存在'
  };

  export default {
    components: {CheckableRegionTreeModal, RichTextEditor, WaterSystemTreeModal, RegionTreeModal, ACol, ARow},
    data() {
      return {
        isMapMax: false,
        form: null,
        formLayout,
        riverTypeList: [],
        riverFunctionList: [],
        riverNameAsyncValidator,
        isRegionTreeModalVisible: false,
        region: {},
        isWaterSystemModalVisible: false,
        waterSystem: {},
        editorContent: '',
        BASE_URL,
        fileList: [],
        pictureList: [],
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
      this.form = this.$form.createForm(this);
      this.getRiverTypeList();
      this.getRiverFunctionList();
      this.initMap();
    },
    methods: {
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
      },
      getRiverTypeList() {
        get(`${BASE_URL}/watersource/v1/river/riverType`, {type: '104'}).then(res => {
          if (res.resCode === 1) {
            this.riverTypeList = res.data;
          }
        })
      },
      getRiverFunctionList() {
        get(`${BASE_URL}/watersource/v1/river/riverFeature`).then(res => {
          if (res.resCode === 1) {
            this.riverFunctionList = res.data;
          }
        })
      },
      save() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const data = new FormData();
            for (let key in value) {
              let value=value[key];
              if(!value&&value!==0){
                value='';
              }
              data.append(key,value);
            }
            console.log(data);
            // data.append('overView', this.editorContent);
            // const file=this.fileList.filter(item=>!!item.responseUrl).map(item=>item.responseUrl);
            // data.append('jsonFiles',JSON.stringify(file));
            // const picture=this.pictureList.filter(item=>!!item.responseUrl).map(item=>item.responseUrl);
            // data.append('jsonImages',JSON.stringify(picture));
            // post(`${BASE_URL}/watersource/v1/river/add`,null,data).then(res=>{
            //   this.isSaveLoading=false;
            //   if(res.resCode===1){
            //     this.$message.success('新增成功');
            //     setTimeout(()=>{
            //       this.$router.replace('/information/river');
            //     },1500);
            //   }
            // })
          }
        })
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
            midPointLongitude: '',
            midPointLatitude: '',
            length: ''
          });
        }
      },
      drawEnd(e) {
        this.form.setFieldsValue({
          midPointLongitude: e.currentLnglats[0].lng,
          midPointLatitude: e.currentLnglats[0].lat,
          length: e.currentDistance
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
