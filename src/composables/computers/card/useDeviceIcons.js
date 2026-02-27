import { createIconVariants } from '@/utils/icons'
import { LaptopMinimal, Monitor, Worm } from 'lucide-vue-next'

export function useDeviceIcons() {
  const deviceIcons = [
    ...createIconVariants(LaptopMinimal, 'Laptop', 1),
    ...createIconVariants(Monitor, 'Monitor', 5),
    ...createIconVariants(Worm, 'Worm', 9),
  ]

  return { deviceIcons }
}
