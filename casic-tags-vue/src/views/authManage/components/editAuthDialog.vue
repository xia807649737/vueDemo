<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="350px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <div style="height:50vh;">
      <el-tree
        ref="permissionsTree"
        style="overflow: auto;height:100%;"
        :data="permissions"
        show-checkbox
        node-key="cid"
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        :check-on-click-node="true"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPermissions, getRolePermissions } from '@/api/authManage'
export default {
  name: 'EditUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    current: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '新增角色组'
    },
    sysType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      formRole: {},
      rules: {
        // name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        // regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      },
      permissions: [],
      defaultProps: {
        children: 'children',
        label: 'cmenuName'
      },
      checkedKeys: []

    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = { ...this.current }
        // 获取所有权限列表
        this.getPermissions()
        // 获取当前角色所拥有的权限列表
        this.getRolePermissions()
      }
    }
  },
  methods: {
    handleSubmit() {
      const permissionIds = this.$refs.permissionsTree.getCheckedNodes().map(item => item.cid)
      const data = {
        sysType: this.formRole.sysType,
        permissionIds
      }
      this.$emit('ok', data)
    },
    async getPermissions() {
      const params = {
        sysType: this.sysType || '0'
      }
      const res = await getPermissions(params)
      if (res?.result) {
        this.permissions = res?.result
      }
    },
    async getRolePermissions() {
      this.checkedKeys = []
      const params = {
        sysType: this.sysType || '0'
      }
      const res = await getRolePermissions(this.formRole.cid, params)
      if (res.result) {
        this.checkedKeys = res.result.map(item => item.cid)
      } else {
        this.checkedKeys = []
      }
    }
  }
}
</script>
