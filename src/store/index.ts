import { store, IGlobalState } from './store'
import { useCollection } from './basic_collection'
import { InjectionKey } from 'vue'
import { Store, useStore as baseUseStore } from 'vuex'
import { useActivities } from './activities/activities'

export const key: InjectionKey<Store<IGlobalState>> = Symbol()

export function useStore () {
  return baseUseStore(key)
}

export { useCollection, useActivities }
export default store
