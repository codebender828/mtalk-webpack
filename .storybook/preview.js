import { app } from '@storybook/vue3'
import ElementPlus from 'element-plus'

import { store } from '~/services/store'
import { guard } from '~/services/guard'
import i18n from '~/i18n'

import '~/styles/atomic/vuetify.sass'
import '~/styles/themes/element-plus-custom.scss'
import '~/styles/main.styl'
import '~/stories/main.styl'

app.use(ElementPlus)
app.use(store)
app.use(guard)
app.use(i18n)

app.mount('#app')

export const parameters = {
  layout: 'centered',
  sidebar: {
    showRoots: false
  },
  options: {
    showPanel: false
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
