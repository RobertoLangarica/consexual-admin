import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/InternalLayout.vue'),
    children: [
      {
        path: 'activities',
        name: 'activities',
        component: () => import('../views/Activities.vue')
      },
      {
        path: 'hairs',
        name: 'hairs',
        component: () => import('../views/ImageCollection.vue'),
        props: { collection: 'hairs', title: 'Avatar-Hairs' }
      },
      {
        path: 'faces',
        name: 'faces',
        component: () => import('../views/ImageCollection.vue'),
        props: { collection: 'faces', title: 'Avatar-Faces' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
