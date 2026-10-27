import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/IndexPage.vue') },
      { path: '/login', component: () => import('../pages/Auth/LoginPage.vue') },

      {
        path: '/galpones',
        component: () => import('../pages/Galpon/GalponesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/pollos',
        component: () => import('../pages/Pollos/PollosPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/trabajadores',
        component: () => import('../pages/Trabajador/TrabajadoresPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/retiro-de-pollos',
        component: () => import('../pages/RetiroDePollos/RetiroDePollosPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/mantenimiento-y-emergencias',
        component: () =>
          import('../pages/MantenimientoYEmergencia/MantenimientoYEmergenciasPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/conteo-de-pollos',
        component: () => import('../pages/ConteoDePollos/ConteoDePollosPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/control-de-peso',
        component: () => import('../pages/ControlDePeso/ControlDePesoPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

export default routes
