<template>
    <main class="column full-height q-pa-md">
        <div class="row justify-between items-center">
            <h3 class="q-ma-none">Actividades</h3>
            <div>
                <q-btn round color="warning" icon="fas fa-plus" size="sm" @click="create"/>
            </div>
        </div>
        <div class="col" style="overflow-y: auto;">
            <draggable v-model="sorted" @end="onDragEnd" item-key="id">
              <template #item="{element, index}">
                <q-card class="q-ma-md row q-col-gutter-x-sm items-center" >
                  <div>
                      <q-btn class="grab" size="sm" icon="fas fa-grip-vertical" color="grey-5" flat round />
                  </div>
                  <q-card-section class="col row">
                      <span class="col-12 text-h6">{{element.id}}</span>
                      <span class="col-12 text-grey">{{element.type}}</span>
                  </q-card-section>
                  <q-card-section class="row q-col-gutter-x-md">
                      <div><q-btn icon="fas fa-edit" size="sm" color="primary" flat round @click="edit(element)"/></div>
                      <div><q-btn icon="fas fa-trash" size="sm" color="negative" flat round @click="remove(element, index)"/></div>
                  </q-card-section>
              </q-card>
              </template>
            </draggable>
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
import draggable from 'vuedraggable'
import { defineComponent, ref, watch } from 'vue'
import { Notify, useQuasar } from 'quasar'

export default defineComponent({
  components: { ActivityDialog, draggable },
  setup () {
    const { sorted: activities, edit: editActivity, remove: removeActivity } = useActivities()
    // For a smooth response to a sorting action
    const sorted = ref<any[]>([])
    watch(activities, (changed) => {
      sorted.value = activities.value
    })

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

    // Sorting after a drag
    const onDragEnd = ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) { return }
      const prev = oldIndex - 1
      const current = activities.value[oldIndex]

      if (prev >= 0) {
        editActivity({ id: activities.value[prev].id, next: current.next })
      }

      if (newIndex > oldIndex) {
        // Moving down
        editActivity({ id: current.id, next: activities.value[newIndex].next })
        editActivity({ id: activities.value[newIndex].id, next: current.id })
      } else {
        // Moving up
        const prev = newIndex - 1
        editActivity({ id: current.id, next: activities.value[newIndex].id })
        if (prev >= 0) {
          editActivity({ id: activities.value[prev].id, next: current.id })
        }
      }
    }

    return { sorted, editing, activity, edit, create, remove, loading, onDragEnd }
  }
})
</script>

<style lang="scss" scoped>
    .grab{
        cursor: grab;
    }
</style>
