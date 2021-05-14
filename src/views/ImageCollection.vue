<template>
    <main class="column full-height q-pa-md">
        <div class="row justify-between items-center">
            <h3 class="q-ma-none">{{title}}</h3>
            <div>
                <q-btn round color="warning" icon="fas fa-plus" size="md" @click="showUpload = true"/>
            </div>
        </div>
        <q-card v-if="!items.length" class="full-width text-h4 text-grey text-center q-ma-xl q-pa-lg">
            Nada para mostrar
        </q-card>
        <div class="col row" style="overflow-y: auto;">
          <q-card v-for="item in items" :key="item.id" class="item q-ma-md">
            <q-card-section class="row justify-between items-center no-wrap">
                <strong class="col-8">{{item.name}}</strong>
                <div class="action"><q-btn icon="fas fa-trash" round color="negative" size="sm" @click="remove(item)"/></div>
            </q-card-section>
            <q-card-section>
            <remote-image class="full-height full-width" :src="item.path"/>
            </q-card-section>
          </q-card>
        </div>

        <q-dialog v-model="showUpload" persistent>
          <uploader :folder="collection" @close="showUpload=false" @upload-completed="showUpload=false"/>
        </q-dialog>
        <q-inner-loading :showing="loading" color="primary"/>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useCollection } from '@/store'
import Uploader from '@/components/Uploader.vue'
import RemoteImage from '@/components/RemoteImage.vue'
import { Notify, useQuasar } from 'quasar'

export default defineComponent({
  components: { Uploader, RemoteImage },
  props: {
    title: { type: String, required: false, default: '' },
    collection: { type: String, required: true }
  },
  setup (props) {
    const showUpload = ref(false)
    const { [props.collection]: items, remove: removeItem } = useCollection(props.collection)
    const $q = useQuasar()
    const loading = ref(false)

    const remove = (item) => {
      $q.dialog({ title: 'Borrando!', message: 'Confirma que quieres borrar este elemento', color: 'negative', ok: 'Borrar', cancel: true })
        .onOk(() => {
          loading.value = true
          removeItem(item.id)
            .catch(e => {
              Notify.create({ message: 'Error!', caption: e.toString(), color: 'negative' })
              console.log(e)
            })
            .finally(() => { loading.value = false })
        })
    }

    return { showUpload, items, loading, remove }
  }
})
</script>

<style lang="scss" scoped>
  .item{
    min-width: 156px;
    height: 256px;
  }

  .action{
    visibility: hidden;
  }

  .item:hover{
    background-color: dimgrey;
    color: white;
      .action{
        visibility: visible;
      }
  }
</style>
