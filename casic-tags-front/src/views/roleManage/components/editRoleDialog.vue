<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="userForm" label-position="right" :rules="rules" label-width="100px" :model="formRole">
      <!-- <el-form-item label="系统名称：" prop="sysType" placeholder="请选择系统名称">
        <el-select v-model="formRole.sysType" style="width: 100%">
          <el-option value="1" label="法制邮局" />
          <el-option value="2" label="通讯底板" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="角色组名：" prop="cname">
        <el-input v-model="formRole.cname" placeholder="请输入角色组名" />
      </el-form-item>
      <el-form-item label="备注：" prop="cdetail">
        <el-input v-model="formRole.cdetail" :rows="5" type="textarea" placeholder="角色描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'EditUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '新增角色组'
    }
  },
  data() {
    return {
      formRole: {},
      rules: {
        cname: [{ required: true, message2: '角色组名', trigger: 'blur', validator: this.validateStringAndChinese }]
        // regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = { ...this.data }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formRole))
    },
    validateStringAndChinese(rule, value, callback) {
      const reg = /^[\u4E00-\u9FA5A-Za-z_]{2,16}$/
      if (!value) {
        callback(new Error('请输入' + rule.message2))
      } else {
        if (!reg.test(value.trim())) {
          callback(new Error(rule.message2 + '应由2-16位以内的中文和字母组成！'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>
