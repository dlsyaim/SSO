<template>
  <div class="card-container">
    <a-card title="新增流域" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <div style="display: flex;justify-content: space-between;">
        <div style="width: 70%;" :style="{display:isMapMax?'none':'block'}">
          <a-form :form="form">
            <a-row>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域名称">
                  <a-input placeholder="请输入流域名称"
                           v-decorator="['basinName',{rules:[{required:true,message:'请输入流域名称'},basinNameAsyncValidator],validateFirst:true,validateTrigger:'blur'}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域代码">
                  <a-input placeholder="请输入流域代码" v-decorator="['basinCode']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域面积">
                  <a-input placeholder="流域面积可由绘制得出" addonAfter="km²" v-decorator="['acreage']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域经度">
                  <a-input placeholder="流域经度可由绘制得出" v-decorator="['longitude']"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item v-bind="formLayout" label="流域纬度">
                  <a-input placeholder="流域纬度可由绘制得出" v-decorator="['latitude']"></a-input>
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
  import RichTextEditor from "../../../components/RichTextEditor";
  import calculateCenterPoint from "../../../util/calculateCenterPoiont";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  const basinNameAsyncValidator = {
    validator: (rules, value, callback) => {
      get(`${BASE_URL}/watersource/v1/drainageBasin/isRepeat?name=${value}`).then(res => {
        if (res.resCode !== 1) {
          callback(new Error());
        } else {
          callback();
        }
      })
    }, message: '流域名称已存在'
  };

  export default {
    components: {RichTextEditor,ACol, ARow},
    data() {
      return {
        isMapMax: false,
        form: null,
        formLayout,
        basinNameAsyncValidator,
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
      this.form = this.$form.createForm(this);
      this.initMap();
    },
    methods: {
      initMap() {
        this.map = new T.Map('map');
        this.map.centerAndZoom(new T.LngLat(117.113299075426, 39.02788956452), 9);
        const scaleControl = new T.Control.Zoom();
        this.map.addControl(scaleControl);
      },
      save() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const data = new FormData();
            for (let key in value) {
              let v = value[key];
              if (!v && v !== 0) {
                v = '';
              }
              data.append(key, v);
            }
            if (this.currentTravel) {
              const linePoint = this.currentTravel.currentLnglats.map(item => [item.lng + ' ' + item.lat]).join(',');
              data.append('linePoints', linePoint);
              data.append('spatialData', `MULTIPOLYGON(((${linePoint})))`);
            }
            data.append('overView', this.editorContent);
            const file = this.fileList.filter(item => !!item.responseUrl).map(item => item.responseUrl);
            data.append('jsonFiles', JSON.stringify(file));
            const picture = this.pictureList.filter(item => !!item.responseUrl).map(item => item.responseUrl);
            data.append('jsonImages', JSON.stringify(picture));
            post(`${BASE_URL}/watersource/v1/drainageBasin/add`, null, data).then(res => {
              this.isSaveLoading = false;
              if (res.resCode === 1) {
                this.$message.success('新增成功');
                setTimeout(() => {
                  this.$router.replace('/information/basin');
                }, 1500);
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
          this.form.setFieldsValue({
            longitude: '',
            latitude: '',
            acreage: ''
          });
        }
      },
      drawEnd(e) {
        const centerPoint = calculateCenterPoint(e.currentLnglats);
        this.form.setFieldsValue({
          longitude: centerPoint[0],
          latitude: centerPoint[1],
          acreage: Math.round(e.currentArea / 1000000)
        });
        this.currentTravel = e;
      },
      changeMapSize() {
        this.isMapMax = !this.isMapMax;
        setTimeout(() => {
          this.map.checkResize();
        }, 10);
      }
      ,
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
      }
      ,
      handleFileRemove(file) {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      }
      ,
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
      }
      ,
      handlePictureRemove(file) {
        this.pictureList = this.pictureList.filter(item => item.uid !== file.uid);
      }
    }
  }
</script>

<style scoped>

</style>
