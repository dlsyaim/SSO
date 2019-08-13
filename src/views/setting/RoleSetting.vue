<template>
  <div class="card-container">
    <a-card title="角色设置" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>角色名称：</span>
          <a-input class="default-select-width" style="margin-right: 40px" v-model="roleName" placeholder="请输入角色名称"></a-input>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="roleName=''">重置</a-button>
        </div>
        <a-button type="primary" @click="showAddModal"><a-icon type="plus" style="font-size: 16px"/>新增角色</a-button>
      </div>
      <!--<div @click="handleTableClick">-->
        <!--<a-table v-if="showTable"-->
                 <!--:columns="columns"-->
                 <!--rowKey="id"-->
                 <!--:dataSource="list"-->
                 <!--:pagination="false"-->
                 <!--defaultExpandAllRows>-->
        <!--<span slot="action" slot-scope="item">-->
          <!--<span data-method="add" :data-id="item.id" class="table-operation">增加子项目</span>-->
          <!--<a-divider type="vertical"/>-->
          <!--<span data-method="modify" :data-id="item.id" class="table-operation">修改</span>-->
          <!--<template v-if="item.children.length===0">-->
            <!--<a-divider type="vertical"/>-->
            <!--<a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">-->
              <!--<span data-method="delete" :data-id="item.id" class="table-operation">删除</span>-->
            <!--</a-popconfirm>-->
          <!--</template>-->
        <!--</span>-->
        <!--</a-table>-->
      <!--</div>-->
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleName:''
      }
    },
    methods:{
      getList(){

      },
      showAddModal(){

      }
    }
  }
</script>

