import configureCookie from './configureCookie'
import { useState } from 'react'

export default function useStateWithCookie (initialData) {
  const [Cookie] = useState(configureCookie({ name: initialData.name }))
  const [settings, saveSettings] = useState(initialData.data)
  const patchSettings = patch => {
    const newSettings = { ...settings, ...patch }
    saveSettings(newSettings)
    Cookie.set(newSettings)
  }
  return [settings, patchSettings]
}
