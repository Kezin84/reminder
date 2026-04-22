import { createRouter, createWebHistory } from 'vue-router'
import Report from '../components/report.vue'
import Customer from '../components/Customer.vue'

const routes = [
  {
    path: '/',
    redirect: '/report'
  },
  {
    path: '/report',
    name: 'Report',
    component: Report
  },
  {
    path: '/customer',
    name: 'Customer',
    component: Customer
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
