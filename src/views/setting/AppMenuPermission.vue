<template>
  <div class="card-container">
    <a-card title="app端功能权限" :bordered="false" style="min-height: 100%">
      <div style="display: flex;justify-content: space-between;align-items:stretch">
        <a-card style="width: 31%" :bodyStyle="{padding:'18px'}">
          <div style="height: 40px;display: flex;align-items: center;background-color: #f2f2f2;padding-left: 20px;font-size: 15px;color: rgba(0,0,0,.85)">角色</div>
          <a-spin :spinning="loading1">
            <ul id="tree1" class="ztree" style="margin-top: 20px;height: 560px;overflow-y: auto"></ul>
          </a-spin>
        </a-card>
        <a-card style="width: 31%" :bodyStyle="{padding:'18px'}">
          <div style="height: 40px;display: flex;align-items: center;background-color: #f2f2f2;padding-left: 20px;font-size: 15px;color: rgba(0,0,0,.85)">正在操作的角色：{{selectedRole?selectedRole.name:'无'}}</div>
          <a-spin :spinning="loading2">
            <ul id="tree2" class="ztree" style="margin-top: 20px;height: 560px;overflow-y: auto"></ul>
          </a-spin>
          <a-button type="primary" v-if="selectedRole" :loading="isSaveLoading" style="margin-top: 10px" @click="setPermission">授权</a-button>
        </a-card>
        <a-card style="width: 31%" :bodyStyle="{padding:'18px'}">
          <div style="height: 40px;display: flex;align-items: center;background-color: #f2f2f2;padding-left: 20px;font-size: 15px;color: rgba(0,0,0,.85)">当前角色拥有的菜单如下：</div>
          <a-spin :spinning="loading3">
            <ul id="tree3" class="ztree" style="margin-top: 20px;height: 560px;overflow-y: auto"></ul>
          </a-spin>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {get, post} from "../../util/axios";
  import {BASE_URL} from "../../config/config";

  export default {
    data() {
      return {
        functionType:5,
        selectedRole:null,
        loading1:true,
        loading2:false,
        loading3:false,
        tree1Setting: {
          enable: true,
          callback: {
            onClick: this.zTreeOnClick
          }
        },
        tree2Setting:{
          check: {
            enable: true,
            chkStyle: "checkbox"
          }
        },
        isSaveLoading:false
      }
    },
    mounted(){
      this.getRoleList();
    },
    methods:{
      getRoleList(){
        get(`${BASE_URL}/uip/smRole/queryRoleList?pageNumber=-1&pageSize=-1`).then(res=>{
          if(res.resCode===1){
            $.fn.zTree.init($('#tree1'),this.tree1Setting,res.data.records);
            this.loading1=false;
          }
        })
      },
      zTreeOnClick(event, treeId, treeNode){
        this.loading2=true;
        this.loading3=true;
        this.selectedRole=treeNode;
        get(`${BASE_URL}/uip/smAuthority/queryAuthorityMenuTree?roleId=${treeNode.id}&functionType=${this.functionType}`).then(res=>{
          if(res.resCode===1){
            $.fn.zTree.init($('#tree2'),this.tree2Setting,res.data);
            this.loading2=false;
          }
        });
        get(`${BASE_URL}/uip/smAuthority/queryAuthorityMenuTreeDetail?roleId=${treeNode.id}&functionType=${this.functionType}`).then(res=>{
          if(res.resCode===1){
            $.fn.zTree.init($('#tree3'),{},res.data);
            this.loading3=false;
          }
        })
      },
      setPermission(){
        const checkedNodes=$.fn.zTree.getZTreeObj("tree2").getCheckedNodes(true);
        const params={
          powers:checkedNodes.map(item=>item.id),
          roleId:this.selectedRole.id,
          functionType:this.functionType
        };
        this.isSaveLoading=true;
        post(`${BASE_URL}/uip/smAuthority/authorizedMenu`,params).then(res=>{
          this.isSaveLoading=false;
          if(res.resCode===1){
            this.$message.success('授权成功');
            console.log(checkedNodes);
            checkedNodes.map(item=>{
              if(item.children.length!==0){
                item.isParent=true;
              }else {
                item.isParent=false
              }
              item.children=[];
              return item;
            });
            $.fn.zTree.init($('#tree3'),{},checkedNodes);
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
