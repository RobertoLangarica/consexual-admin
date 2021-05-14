<template>
    <q-card>
        <q-card-section class="text-white bg-primary row justify-between items-center">
            <span class="text-h5">{{title}}</span>
            <div><q-btn round flat size="sm" icon="fas fa-times" @click="$emit('close')" :disable="loading"/></div>
        </q-card-section>
        <q-card-section class="q-pa-md">
            <q-uploader
                class="placeholder full-width"
                label="Selecciona un archivo"
                accept="image/*"
                flat
                hide-upload-btn
                text-color="primary"
                color="white"
                :error="true"
                :disable="loading"
                @added="(files)=>onSelected(files[0])"
                @removed="(files)=>onRemoved(files[0])"
                :loading="loading"
                />
        </q-card-section>
        <q-card-section>
            <q-btn class="full-width" color="primary" label="Aceptar" :disable="!allowUpload" :loading="loading" @click="upload"/>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import firebase from '@/firebase'

export default defineComponent({
  name: 'Uploader',
  props: {
    title: { type: String, required: false, default: 'Subir Archivo' },
    folder: { type: String, required: false, default: '' }
  },
  emits: ['upload-start', 'upload-completed', 'close'],
  setup (props, { emit }) {
    const selectedFile = ref<File|null>(null)
    const loading = ref(false)
    const allowUpload = computed(() => !!selectedFile.value)
    const onSelected = (file) => {
      selectedFile.value = file
    }
    const onRemoved = (file) => {
      selectedFile.value = null
    }

    const upload = () => {
      loading.value = true
      emit('upload-start')
      firebase.uploader(props.folder).upload(selectedFile.value as File)
        .then(() => emit('upload-completed'))
        .catch(e => { console.error(e) })
        .finally(() => { loading.value = false })
    }

    return { selectedFile, allowUpload, onSelected, onRemoved, loading, upload }
  }
})
</script>

<style lang="scss" scoped>
    .placeholder{
        min-width: 156px;
        min-height: 156px;
        background-color: #ddd;
    }
</style>
