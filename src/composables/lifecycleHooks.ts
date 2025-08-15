import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { logStyle } from '@/assets/logStyles'

export function useLifecycleHooks(componentName = 'UnnamedComponent') {
  onBeforeMount(() => {
    console.log(`%c[${componentName}]%c onBeforeMount`, logStyle.lifecycle, '')
  })

  onMounted(() => {
    console.log(`%c[${componentName}]%c onMounted`, logStyle.lifecycle, '')
  })

  onBeforeUnmount(() => {
    console.log(
      `%c[${componentName}]%c onBeforeUnmount`,
      logStyle.lifecycle,
      '',
    )
  })
}
