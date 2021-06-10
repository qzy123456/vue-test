import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import FirstPage from '@/components/First'
import SecondPage from '@/components/Second'
import FirstPart from '@/components/HomeComponents/FirstPart'
import SecondPart from '@/components/HomeComponents/SecondPart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'FirstPart',
          component: FirstPart
        },
        {
          path: 'SecondPart',
          name: 'SecondPart',
          component: SecondPart
        }
        ]
    },
    {
      path: '/First',
      name: 'First',
      component: FirstPage
    },
    {
      path: '/Second',
      name: 'Second',
      component: SecondPage
    }

  ]
})
