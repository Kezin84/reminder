import { createRouter, createWebHistory } from 'vue-router'
import Report from '../components/report.vue'

const routes = [
  {
    path: '/',
    name: 'Report',
    component: Report
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
