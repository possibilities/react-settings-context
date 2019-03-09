import useStateWithCookie from './useStateWithCookie'
import React, { createContext } from 'react'
import PropTypes from 'prop-types'

const SettingsContext = createContext()

const OriginalSettingsContextProvider = SettingsContext.Provider

const SettingsContextProvider = ({ initialData, children }) => {
  const [settings, patchSettings] = useStateWithCookie(initialData)
  return (
    <OriginalSettingsContextProvider value={[settings, patchSettings]}>
      {children}
    </OriginalSettingsContextProvider>
  )
}

SettingsContextProvider.propTypes = {
  initialData: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}

SettingsContext.Provider = SettingsContextProvider
export default SettingsContext
