<template>
  <div class="card-container">
    <a-card title="编辑水系" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%;" :style="{display:isMapMax?'none':'block'}">
          <a-form :form="form">
            <a-row>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="水系名称">
                  <a-input placeholder="请输入水系名称"
                           v-decorator="['waterName',{rules:[{required:true,message:'请输入水系名称'}]}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="水系编码">
                  <a-input placeholder="请输入水系编码"
                           v-decorator="['waterCode']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="所属流域">
                  <a-select placeholder="请选择所属流域" v-decorator="['basinCode',{rules:[{required:true,message:'请选择所属流域'}]}]">
                    <a-select-option v-for="item in belongDrainageList" :key="item.id" :value="item.id" :title="item.basinName">{{item.basinName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="24">
                <a-form-item v-bind="{labelCol: {span: 2},wrapperCol: {span: 21}}" label="概述内容">
                  <RichTextEditor tag-id="desc" :initialContent="editorContent" @getEditorContent="editorContent=$event"></RichTextEditor>
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
    components: {ATextarea, RichTextEditor, ACol, ARow},
    data() {
      return {
        id:'',
        detail:{},
        isMapMax: false,
        form: null,
        formLayout,
        belongDrainageList: [],
        editorContent: '',
        BASE_URL,
        fileList: [],
        pictureList: [],
        isSaveLoading: false,
        drawLineTool: null,
        map: null,
        currentTravel: '',//当前绘制轨迹
        isCurrentTravelVisible: false
      }
    },
    mounted() {
      this.id=this.$route.query.id;
      this.getDetail();
      this.form = this.$form.createForm(this);
      this.getBelongDrainageList();
      this.initMap();
    },
    methods: {
      getDetail(){
        get(`${BASE_URL}/watersource/v1/waterSystem/detail?id=${this.id}`).then(res=>{
          if(res.resCode===1){
            const data=res.data;
            this.detail=Object.seal(data);
            this.editorContent=data.overView;
            console.log(data);
            this.form.setFieldsValue({
              waterName:data.waterName,
              waterCode:data.waterCode,
              basinCode:data.basinCode,
              remark:data.remark
            });
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
          }
        })
      },
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 11);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
      },
      getBelongDrainageList(){
        get(`${BASE_URL}/watersource/v1/drainageBasin/findByBasinName`).then(res=>{
          if(res.resCode===1){
            this.belongDrainageList=res.data.list;
          }
        })
      },
      save() {
        this.form.validateFields('');
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
            data.append('id',this.id);
            if(this.currentTravel){
              const linePoint=this.currentTravel.currentLnglats.map(item=>[item.lng+' '+item.lat]).join(',');
              data.append('linePoints',linePoint);
              data.append('spatialData',`MULTIPOLYGON(((${linePoint})))`);
            }else {
              data.append('linePoints',this.detail.linePoints);
              data.append('spatialData',this.detail.spatialData);
            }
            const file=this.fileList.filter(item=>!!item.responseUrl).map(item=>item.responseUrl);
            if(file.length!==0){
              data.append('jsonFiles',JSON.stringify(file));
            }
            const picture=this.pictureList.filter(item=>!!item.responseUrl).map(item=>item.responseUrl);
            if(picture.length!==0){
              data.append('jsonImages',JSON.stringify(picture));
            }
            post(`${BASE_URL}/watersource/v1/waterSystem/update`,null,data).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('修改成功');
                setTimeout(()=>{
                  this.$router.replace('/information/river-system');
                },1500);
              }
            })
          }
        })
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
        }
      },
      drawEnd(e) {
        const centerPoint=calculateCenterPoint(e.currentLnglats);
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
