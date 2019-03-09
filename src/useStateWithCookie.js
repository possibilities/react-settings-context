import configureCookie from './configureCookie'
import { useState } from 'react'

export default function useStateWithCookie (initialData) {
  const [Cookie] = useState(configureCookie({ name: initialData.name }))
  const [settings, saveSettings] = useState(initialData.data)
  const patchSettings = newSettings => {
    const patch = { ...settings, ...newSettings }
    saveSettings(patch)
    Cookie.setAll(patch)
  }
  return [settings, patchSettings]
}
