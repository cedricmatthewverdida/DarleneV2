import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _d9c2f496 = () => interopDefault(import('..\\pages\\admin.vue' /* webpackChunkName: "pages/admin" */))
const _5855d36c = () => interopDefault(import('..\\pages\\analytics.vue' /* webpackChunkName: "pages/analytics" */))
const _7ecfeb7a = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _7b800d05 = () => interopDefault(import('..\\pages\\forecast.vue' /* webpackChunkName: "pages/forecast" */))
const _2bf7ddad = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages/register" */))
const _61af31b8 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _d9c2f496,
    name: "admin"
  }, {
    path: "/analytics",
    component: _5855d36c,
    name: "analytics"
  }, {
    path: "/dashboard",
    component: _7ecfeb7a,
    name: "dashboard"
  }, {
    path: "/forecast",
    component: _7b800d05,
    name: "forecast"
  }, {
    path: "/register",
    component: _2bf7ddad,
    name: "register"
  }, {
    path: "/",
    component: _61af31b8,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
