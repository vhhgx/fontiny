<template>
  <div class="vhhg-navbar">
    <vs-navbar
      v-model="active"
      target-scroll="#padding-scroll-content"
      padding-scroll
      not-line
      center-collapsed>
      <template #left>
        <span class="text-xl font-black">Fontiny</span>
      </template>

      <template #right>
        <vs-navbar-item
          v-for="nav in navs"
          :id="nav.id"
          :active="active == `${nav.url}`"
          @click="route(nav.url)">
          {{ nav.name }}
        </vs-navbar-item>
      </template>
    </vs-navbar>
  </div>
</template>

<script setup>
const router = useRouter()

const active = computed(() => {
  let route = useRoute()
  return route.path
})

const navs = reactive([
  { id: 'home', name: '首页', url: '/' },
  { id: 'logs', name: '日志', url: '/' },
  { id: 'docs', name: '使用文档', url: '/' },
])

const route = (url) => {
  router.push({ path: url })
}
</script>

<style lang="sass">
.vhhg-navbar
  .vs-navbar-content
    .vs-navbar
      padding: 0 60px
</style>
