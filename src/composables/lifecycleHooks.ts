import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'

export function useLifecycleHooks(componentName = 'UnnamedComponent') {
  onBeforeMount(() => {
    console.log(`[${componentName}] onBeforeMount`)
  })

  onMounted(() => {
    console.log(`[${componentName}] onMounted`)
  })

  onBeforeUnmount(() => {
    console.log(`[${componentName}] onBeforeUnmount`)
  })
}
