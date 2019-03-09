import Nav from '../components/Nav'
import SettingsContext from 'react-settings-context'
import React, { useContext } from 'react'

export default function () {
  const [settings, patchSettings] = useContext(SettingsContext)
  return (
    <>
      <Nav />
      <h1>home</h1>
      <p>is it funky?</p>
      <p>{settings.isItFunky ? 'yes' : 'no'}</p>
      <button onClick={() => patchSettings({ isItFunky: !settings.isItFunky })}>
        turn {settings.isItFunky ? 'off' : 'on'} funky-ness
      </button>
    </>
  )
}
