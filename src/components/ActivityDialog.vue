<template>
    <q-dialog ref="dialogRef">
        <q-card class="column">
            <q-card-section class="text-white" :class="`bg-${color}`">
                <span class="text-h4">{{title}}</span>
            </q-card-section>

            <q-card-section class="col">
                <activity-editor ref="editor" class="full-height" :activity="activity"/>
            </q-card-section>

            <q-card-actions class="row reverse justify-between q-col-gutter-sm">
                <div class="col-xs-12 col-md-6">
                    <q-btn class="full-width" :label="saveLabel" :color="color" @click="save"/>
                </div>
                <div class="col-xs-12 col-md-6">
                    <q-btn class="full-width" label="Cancelar" color="negative" v-close-popup flat/>
                </div>
            </q-card-actions>

            <q-inner-loading :showing="loading" color="primary"/>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { useActivities } from '@/store'
import { Notify, useDialogPluginComponent } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import ActivityEditor from './ActivityEditor.vue'

export default defineComponent({
  name: 'ActivityDialog',
  components: { ActivityEditor },
  props: { activity: { type: Object, required: false, default: () => undefined } },
  setup (props) {
    const loading = ref(false)
    const { onDialogOK, ...dialogRest } = useDialogPluginComponent()
    const editor = ref<any>(null)
    const { sorted: activities, add, edit } = useActivities()
    const color = computed(() => props.activity ? 'teal' : 'warning')
    const saveLabel = computed(() => props.activity ? 'Guardar cambios' : 'Crear')
    const title = computed(() => props.activity ? 'Editando' : 'Creando')

    const save = async () => {
      loading.value = true
      const edition = editor.value!.getEdition()

      // TODO: Validate data in a better way
      if (!edition.id || !edition.type) {
        Notify.create({ message: 'Error!', caption: 'Agrega un ID válido y un tipo', color: 'negative' })
        setTimeout(() => { loading.value = false }, 300)
        return
      }

      if (props.activity) {
        // Edition
        edit(edition)
          .then(() => onDialogOK())
          .catch(e => {
            Notify.create({ message: 'Error!', caption: e.toString(), color: 'negative' })
            console.log(e)
          })
          .finally(() => { loading.value = false })
      } else {
        // Creation
        const prev = activities.value[activities.value.length - 1]
        add(edition)
          .then(() => {
            // The previous navigate to the new one
            if (prev) {
              prev.next = edition.id
              return edit(prev)
            }
          })
          .then(() => onDialogOK())
          .catch(e => {
            Notify.create({ message: 'Error!', caption: e.toString(), color: 'negative' })
            console.log(e)
          })
          .finally(() => { loading.value = false })
      }
    }

    return { loading, onDialogOK, ...dialogRest, save, editor, color, saveLabel, title }
  }
})
</script>
