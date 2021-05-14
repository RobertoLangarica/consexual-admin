<template>
    <main class="column full-height q-pa-md">
        <div class="row justify-between items-center">
            <h3 class="q-ma-none">Actividades</h3>
            <div>
                <q-btn round color="warning" icon="fas fa-plus" size="sm" @click="create"/>
            </div>
        </div>
        <div class="col" style="overflow-y: auto;">
            <q-card class="q-ma-md row q-col-gutter-x-sm items-center" v-for="(item, index) in activities" :key="item.id">
                <div>
                    <q-btn class="grab" size="sm" icon="fas fa-grip-vertical" color="grey-5" flat round />
                </div>
                <q-card-section class="col row">
                    <span class="col-12 text-h6">{{item.id}}</span>
                    <span class="col-12 text-grey">{{item.type}}</span>
                </q-card-section>
                <q-card-section class="row q-col-gutter-x-md">
                    <div><q-btn icon="fas fa-edit" size="sm" color="primary" flat round @click="edit(item)"/></div>
                    <div><q-btn icon="fas fa-trash" size="sm" color="negative" flat round @click="remove(item, index)"/></div>
                </q-card-section>
            </q-card>
        </div>
        <div>
            <q-btn class="full-width" label="Guardar cambios" color="teal"/>
        </div>

        <activity-dialog v-model="editing" :activity="activity" full-height full-width/>
        <q-inner-loading :showing="loading" color="primary"/>
    </main>
</template>

<script lang="ts">
import { useActivities } from '@/store'
import ActivityDialog from '@/components/ActivityDialog.vue'

import { defineComponent, ref } from 'vue'
import { Notify, useQuasar } from 'quasar'

export default defineComponent({
  components: { ActivityDialog },
  setup () {
    const { sorted: activities, edit: editActivity, remove: removeActivity } = useActivities()
    const editing = ref(false)
    const activity = ref(undefined)
    const $q = useQuasar()
    const loading = ref(false)

    const create = () => {
      activity.value = undefined
      editing.value = true
    }
    const edit = (item) => {
      activity.value = item
      editing.value = true
    }
    const remove = (item, index) => {
      $q.dialog({ title: 'Borrando!', message: 'Confirma que quieres borrar la actividad', color: 'negative', ok: 'Borrar', cancel: true })
        .onOk(() => {
          loading.value = true
          const prev = activities.value[index - 1]

          removeActivity(item.id)
            .then(() => {
              if (prev) {
                prev.next = item.next
                return editActivity(prev)
              }
            })
            .catch(e => {
              Notify.create({ message: 'Error!', caption: e.toString(), color: 'negative' })
              console.log(e)
            })
            .finally(() => { loading.value = false })
        })
    }

    return { activities, editing, activity, edit, create, remove, loading }
  }
})
</script>

<style lang="scss" scoped>
    .grab{
        cursor: grab;
    }
</style>
