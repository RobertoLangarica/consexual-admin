<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="fas fa-bars"
        />

        <q-toolbar-title>
          Consexual
        </q-toolbar-title>

        <div>Admin v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Secciones</q-item-label>
        <q-item clickable to="activities">
          <q-item-section avatar>
            <q-icon name="fas fa-code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Actividades</q-item-label>
            <q-item-label caption>configuración de actividades</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="hairs">
          <q-item-section avatar>
            <q-icon name="fas fa-hat-cowboy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cabellos</q-item-label>
            <q-item-label caption>Diferentes cabellos para los avatares</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="faces">
          <q-item-section avatar>
            <q-icon name="fas fa-hat-cowboy" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Caras</q-item-label>
            <q-item-label caption>Diferentes caras para los avatares</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="main-container">
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'InternalLayout',
  setup () {
    const version = computed(() => require('../../package.json').version)
    const leftDrawerOpen = ref(false)
    return { leftDrawerOpen, version }
  }
})
</script>

<style lang="scss" scoped>
  .main-container{
    height: 100vh;
    width: 100%;
    padding-top: 50px;
  }
</style>
