<template>
  <div class="flex flex-col gap-6">
    <div v-for="group in formList">

      <div name="group" class="text-gray-500 pb-3 font-black flex justify-between">
        <div class="flex">
          <BaseIcons :icon="group.groupIcon"></BaseIcons>
          <span class="">{{ group.groupName }}</span>
        </div>
        <!-- <div name="插槽相关" class="font-normal">
          <slot name="options"></slot>
        </div> -->
      </div>


      <div name="optsItem" class="flex flex-col gap-2">
        <div v-for="item in group.items" name="opts-layer">
          <div class="flex justify-between w-full">
            <div v-if="!item.isFull" class="flex">
              <div class="text-base text-zinc-700 mr-2">{{ item.title }}</div>
              <div v-if="item.tip">
                <vs-tooltip>
                  <BaseIcons icon="warning" color="text-gray-500"></BaseIcons>
                  <template #tooltip>
                    <slot name="tip">{{ item.tip }}</slot>
                  </template>
                </vs-tooltip>
              </div>
            </div>

            <div v-if="item.type === 'switch'">
              <vs-switch v-model="item.options.bind">
                <template #off>{{ (item.options.status && item.options.status.off) || '关闭' }}</template>
                <template #on>{{ (item.options.status && item.options.status.on) || '开启' }}</template>
              </vs-switch>
            </div>

            <div v-if="item.type === 'select'" class="w-full vhhg-select">
              <vs-select filter multiple v-model="val" class="w-full">
                <vs-option v-for="(opt, index) in item.options.opts" :label="opt.label" :value="index">
                  {{ opt.label }}
                </vs-option>
              </vs-select>
            </div>

            <div v-if="item.type === 'input' && showInput(item)" class="w-full">
              <input type="text" class="flex vh-input rounded-xl" v-model="item.options.bind"
                :placeholder="item.options.holder">
            </div>

            <div v-if="item.type === 'slider'" class="w-full">
              <el-slider v-model="item.options.bind" :min="36" :max="120" style="--el-color-primary: rgb(25, 91, 255)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  formList: Array
})

const showInput = (item) => {
  let opt = item.options
  return opt.linked ? opt.linked === true && opt.linkedState === true : true
}

const val = ref('')
</script>

<style lang="sass">
.vhhg-select
  .vs-select-content
    max-width: 100%

.vh-input
  @apply rounded-xl resize-none
  flex: 1
  width: 100%
  background: rgba(var(--vs-gray-2),1)
  border: 2px solid transparent
  color: rgba(var(--vs-text),1)
  padding: 7px 13px 7px 10px
</style>