const COLORS = ['#009963', '#df4001', '#01b5ff', '#ba00df']

export const createIconVariants = (component, baseName = 'Icon', startId = 1) => {
  return COLORS.map((color, index) => ({
    id: startId + index,
    component,
    color,
    name: `${baseName} ${index + 1}`,
  }))
}
