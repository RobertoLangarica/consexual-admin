<template>
    <q-form autofocus class="row">
        <div class="col-12 q-mb-xl row items-start q-col-gutter-y-sm">
            <span class="text-h6">Actividad</span>
            <q-input v-if="allowIDEdition"
                class="col-12"
                v-model="edition.id"
                label="Identificador único:"
                outlined
                stack-label/>
            <q-field v-else class="col-12" label="Identificador único:" outlined stack-label>{{edition.id}}</q-field>

            <q-select v-if="allowTypeEdition"
                class="col-12"
                :options="types"
                v-model="edition.type"
                label="Tipo de actividad"
                outlined
                stack-label
                @update:model-value="onTypeChange"/>
            <q-field v-else class="col-12" label="Tipo de actividad"  outlined stack-label>{{edition.type}}</q-field>

            <template v-for="(value,key) in edition.params" :key="key">
                <q-checkbox v-if="key === 'background_vertical'" class="col-12" v-model="edition.params.background_vertical" label="Fondo vertical"/>
                <template v-else>
                <q-input :label="key" class="col-12" v-model="edition.params[key]" stack-label outlined/>
                </template>
            </template>
        </div>

        <div class="col-12 row">
            <div class="col-12"><q-checkbox class="text-h6 text-left" v-model="edition.allowControls" left-label label="Controles de navegación"/></div>
            <q-checkbox class="col-12" v-model="edition.controls.allowBack" label="Permitir regresar" :disable="!edition.allowControls" :readonly="!edition.allowControls"/>
            <q-input class="col-12" v-model="edition.controls.hint" label="Pista para la actividad" outlined stack-label :disable="!edition.allowControls"/>
        </div>
    </q-form>
</template>

<script lang="ts">
import { useActivities } from '@/store'
import { deepCopy, mergeWithType } from '@/store/activities/activities'
import { computed, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ActivityEditor',
  props: { activity: { type: Object, required: false, default: () => undefined } },
  setup (props) {
    const allowTypeEdition = computed(() => !props.activity)
    const allowIDEdition = computed(() => !props.activity)
    const { types } = useActivities()
    const edition = ref(mergeWithType({}, ''))
    const getEdition = () => edition.value

    const onTypeChange = (value) => {
      // passing any missing value to the edition object
      edition.value = mergeWithType(edition.value, value)
    }

    onMounted(() => {
      if (!props.activity) {
        // empty activity
        edition.value.type = types.value[0]
        onTypeChange(types.value[0])
      } else {
        // Edition is a copy of the activity with any missing values
        edition.value = mergeWithType(deepCopy(props.activity), props.activity.type)
      }
    })
    return { allowTypeEdition, allowIDEdition, types, onTypeChange, edition, getEdition }
  }
})
</script>

<style lang="scss" scoped>
    form{
        overflow-y: auto;
    }
</style>
