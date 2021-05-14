import { createStore } from 'vuex'
import basicCollection, { IBasicCollection } from './basic_collection'
import activities from './activities/activities'

export interface IGlobalState {
    activities: IBasicCollection;
    hairs: IBasicCollection;
    faces: IBasicCollection;
}

const store = createStore<IGlobalState>({
  modules: {
    activities, hairs: basicCollection('hairs'), faces: basicCollection('faces')
  },
  actions: {
    init ({ dispatch }) {
      Object.keys((this as any)._modulesNamespaceMap).forEach(module => {
        dispatch(`${module}init`)
      })
    }
  }
})

export { store }
