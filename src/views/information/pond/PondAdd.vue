<template>
  <div class="card-container">
    <a-card title="新增坑塘" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%;" :style="{display:isMapMax?'none':'block'}">
          <a-form :form="form">
            <a-row>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="坑塘名称">
                  <a-input placeholder="请输入坑塘名称"
                           v-decorator="['pondName',{rules:[{required:true,message:'请输入坑塘名称'}]}]"></a-input>
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
                <a-form-item v-bind="formLayout" label="坑塘类型">
                  <a-select v-decorator="['pondType']" placeholder="请选择坑塘类型">
                    <a-select-option v-for="item in pondTypeList" :key="item.id" :value="item.typeValue">{{item.typeName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="坑塘面积">
                  <a-input placeholder="坑塘面积可由绘制得出" addonAfter="m²"
                           v-decorator="['acreage']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="坑塘经度">
                  <a-input placeholder="坑塘经度可由绘制得出" v-decorator="['longitude']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="坑塘纬度">
                  <a-input placeholder="坑塘纬度可由绘制得出" v-decorator="['latitude']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="位置描述">
                  <a-input placeholder="请输入位置描述" v-decorator="['location']"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="24">
                <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="概述内容">
                  <RichTextEditor tag-id="desc" @getEditorContent="editorContent=$event"></RichTextEditor>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="24">
                <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="备注信息">
                  <a-textarea rows="4" placeholder="请输入备注信息" v-decorator="['remark']"></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
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
  import calculateCenterPoint from "../../../util/calculateCenterPoiont";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {ATextarea, RichTextEditor, RegionTreeModal, ACol, ARow},
    data() {
      return {
        isMapMax: false,
        form: null,
        formLayout,
        pondTypeList: [],
        isRegionTreeModalVisible: false,
        region: {},
        editorContent: '',
        isSaveLoading: false,
        drawLineTool: null,
        map: null,
        currentTravel: '',//当前绘制轨迹
        isCurrentTravelVisible: false
      }
    },
    mounted() {
      this.form = this.$form.createForm(this);
      this.getPondTypeList();
      this.initMap();
    },
    methods: {
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
      },
      getPondTypeList() {
        get(`${BASE_URL}/watersource/v1/pond/pondType`).then(res => {
          if (res.resCode === 1) {
            this.pondTypeList = res.data;
          }
        })
      },
      save() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const data = new FormData();
            for (const key in value) {
              let v=value[key];
              if(!v){
                v='';
              }
              data.append(key,v);
            }
            if(this.currentTravel){
              const linePoint=this.currentTravel.currentLnglats.map(item=>[item.lng+' '+item.lat]).join(',');
              data.append('linePoints',linePoint);
              data.append('spatialData',`MULTIPOLYGON(((${linePoint})))`);
            }
            post(`${BASE_URL}/watersource/v1/pond/add`,null,data).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('新增成功');
                setTimeout(()=>{
                  this.$router.replace('/information/pond');
                },1500);
              }
            })
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
      draw() {
        if (this.drawLineTool) {
          this.drawLineTool.clear();
          this.drawLineTool.close()
        }
        this.drawLineTool = new T.PolygonTool(this.map);
        this.drawLineTool.open();
        this.drawLineTool.addEventListener('draw', this.drawEnd);
      },
      clear() {
        if (this.drawLineTool) {
          this.drawLineTool.clear();
          this.currentTravel = '';
          this.form.setFieldsValue({
            longitude: '',
            latitude: '',
            acreage: ''
          });
        }
      },
      drawEnd(e) {
        const centerPoint=calculateCenterPoint(e.currentLnglats);
        this.form.setFieldsValue({
          longitude: centerPoint[0],
          latitude: centerPoint[1],
          acreage: Math.round(e.currentArea/1000000)
        });
        this.currentTravel = e;
      },
      changeMapSize() {
        this.isMapMax = !this.isMapMax;
        setTimeout(() => {
          this.map.checkResize();
        }, 10);
      }
    }
  }
</script>

<style scoped>

</style>
