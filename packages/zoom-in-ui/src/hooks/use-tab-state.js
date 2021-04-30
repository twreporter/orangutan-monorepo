import { useState } from 'react'

const devicesOrderByTab = ['hd', 'desktop', 'tablet', 'mobile']

export default initialValue => {
  const [tabIndex, setTabIndex] = useState(initialValue)

  return {
    tabIndex,
    targetDevice: devicesOrderByTab[tabIndex],
    setTabIndex,
  }
}
