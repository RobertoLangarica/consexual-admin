<template>
  <q-img class="img" v-if="uri" :src="uri" @load="onLoaded"/>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, ref } from 'vue'
import firebase from '@/firebase'

export default defineComponent({
  props: {
    src: { type: String, required: true }
  },
  emits: ['ready'],
  setup (props, { emit }) {
    const ready = ref(false)
    const uri = ref('')
    const onLoaded = () => {
      nextTick(() => {
        ready.value = true
        emit('ready')
      })
    }

    onBeforeMount(() => {
      firebase.storage().child(props.src).getDownloadURL()
        .then(value => { uri.value = value })
    })

    return { ready, uri, onLoaded }
  }
})
</script>

<style scoped>
.img-container{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100%;
}
</style>
