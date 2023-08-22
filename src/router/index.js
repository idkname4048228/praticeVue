import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inbetween',
      component: () => import('../views/InBetweenView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

// eslint-disable-next-line no-unused-vars
router.beforeEach(async (to, from) => {
  let isAuthenticated = await checkAuth();
  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // ❗️ 避免无限重定向
    to.name !== 'login'
  ) {
    // 将用户重定向到登录页面
    return { name: 'login' }
  }
  return true
})
async function checkAuth() {
  const token = sessionStorage.getItem("token");
  let valid = false
  await fetch("http://localhost:3000/api/user/auth", {
    headers: {
      authorization: `${token}`,
    },
    method: "POST",
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => {
      valid = result.isValid
    });
  return valid
}

export default router