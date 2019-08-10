<template>
  <div class="card-container">
    <a-card title="考核评分类型管理" :bordered="false" style="min-height: 100%">
      <div @click="handleTableClick">
        <a-table v-if="showTable"
                 :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="false"
                 defaultExpandAllRows>
        <span slot="action" slot-scope="item">
          <span data-method="add" :data-id="item.id" class="table-operation">增加子项目</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
          <template v-if="item.children.length===0">
            <a-divider type="vertical"/>
            <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
              <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
            </a-popconfirm>
          </template>
        </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style scoped>

</style>
