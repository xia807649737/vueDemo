<template>
  <ElSwitch
    :class="prefixCls"
    v-model="isDark"
    inline-prompt
    :border-color="blackColor"
    :inactive-color="blackColor"
    :active-color="blackColor"
    :active-icon="Sun"
    :inactive-icon="CrescentMoon"
    @change="themeChange"
  />
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { useAppStore } from '@/store/modules/app'
	import { ElSwitch } from 'element-plus'
	import { useIcon } from '@/hooks/web/useIcon'
	import { useDesign } from '@/hooks/web/useDesign'

	const { getPrefixCls } = useDesign()

	const prefixCls = getPrefixCls('theme-switch')

	const Sun = useIcon({ icon: 'emojione-monotone:sun', color: '#fde047' })

	const CrescentMoon = useIcon({ icon: 'emojione-monotone:crescent-moon', color: '#fde047' })

	const appStore = useAppStore()

	// 初始化获取是否是暗黑主题
	const isDark = ref(appStore.getIsDark)

	// 设置switch的背景颜色
	const blackColor = 'var(--el-color-black)'

	const themeChange = (val: string | number | boolean) => {
		appStore.setIsDark(val as boolean)
	}

</script>

<style>

</style>