import { computed, ref, watch } from '@vue/runtime-core'
import { useStore } from '..'
import basicCollection, { IBasicCollection, ICollectionItem, useCollection } from '../basic_collection'

const getters = {
  types: state => ['instructions', 'avatar_hair']
}

const collection = basicCollection('activities', { getters })
const deepCopy = (from: any) => {
  const result = Object.assign({}, from)

  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'object') {
      // Avoiding object or array references
      if (Array.isArray(result[key])) {
        result[key] = from[key].map((v: any) => deepCopy(v))
      } else {
        result[key] = deepCopy(from[key])
      }
    }
  })

  return result
}
const replaceCommit = collection.mutations.replace

const addPropertyIfNotExists = (target: any, property: string, value: any) => {
  const result = deepCopy(target)
  if (result[property] === undefined) {
    result[property] = value
  }
  return result
}

collection.mutations.replace = (state: IBasicCollection, value: ICollectionItem) => {
  // Adding default values
  value = addPropertyIfNotExists(value, 'allowControls', true)

  value = addPropertyIfNotExists(value, 'params', {
    background_color: 'black',
    background_vertical: false
  })
  value.params = addPropertyIfNotExists(value.params, 'background_color', 'black')
  value.params = addPropertyIfNotExists(value.params, 'background_vertical', false)

  value = addPropertyIfNotExists(value, 'controls',
    {
      allowBack: value.allowControls,
      hint: ''
    })
  value.controls = addPropertyIfNotExists(value.controls, 'allowBack', true)
  value.controls = addPropertyIfNotExists(value.controls, 'hint', '')

  return replaceCommit(state, value)
}

const sortActivities = (activities: ICollectionItem[]) => {
  const first = activities.find(a => !!a.next && !activities.find(b => b.next === a.id))
  if (!first) {
    return []
  }

  const sorted:ICollectionItem[] = []
  sorted.push(first)
  let next = first.next
  while (next) {
    const toAdd = activities.find(a => a.id === next)
    if (toAdd) {
      sorted.push(toAdd)
    }
    next = toAdd ? toAdd.next : ''
  }

  return sorted
}

const setTextsByLanguage = (activities: ICollectionItem[], language: string) => {
  return activities.map((act: any) => {
    const result = Object.assign({}, act)
    const map = (valueKey: string) => {
      if (act[valueKey]) {
        Object.keys(act[valueKey]).forEach(key => {
          if (typeof act[valueKey][key] === 'object' && act[valueKey][key][language]) {
            result[valueKey][key] = act[valueKey][key][language]
          }
        })
      }
    }

    map('params')
    map('controls')

    return result
  })
}

const useActivities = () => {
  const store = useStore()
  const types = computed(() => store.getters['activities/types'])
  const { activities, ...rest } = useCollection('activities')
  const sorted = computed(() => sortActivities(activities.value))

  return { activities, ...rest, types, sorted }
}

const getActivitySchema = () => ({ id: '', next: '', type: '', allowControls: true })
const getActivityControlsSchema = () => ({ allowBack: true, hint: '' })
const getActivityParamsSchema = (type) => {
  switch (type) {
    case 'instructions':
      return ({ instruction: 'Texto de instrucción' })
    case 'avatar_hair':
      return ({ title: 'Título', note: 'Nota al pie', background_color: 'black', background_vertical: true })
  }

  return {}
}
const mergeWithType = (target:any, type:string) => {
  return Object.assign(getActivitySchema(), target,
    { params: Object.assign(getActivityParamsSchema(type), target.params) },
    { controls: Object.assign(getActivityControlsSchema(), target.controls) }
  )
}

export { sortActivities, setTextsByLanguage, useActivities, getActivitySchema, getActivityControlsSchema, getActivityParamsSchema, deepCopy, mergeWithType }
export default collection
