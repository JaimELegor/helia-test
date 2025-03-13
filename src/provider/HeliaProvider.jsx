/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'
import { bootstrap } from '@libp2p/bootstrap'
import { webSockets } from '@libp2p/websockets'
import { webRTC } from '@libp2p/webrtc'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import PropTypes from 'prop-types'
import {
  React,
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'

export const HeliaContext = createContext({
  helia: null,
  fs: null,
  error: false,
  starting: true
})

export const HeliaProvider = ({ children }) => {
  const [helia, setHelia] = useState(null)
  const [fs, setFs] = useState(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState(null)

  const startHelia = useCallback(async () => {
    if (helia) {
      console.info('helia already started')
    } else if (window.helia) {
      console.info('found a windowed instance of helia, populating ...')
      setHelia(window.helia)
      setFs(unixfs(helia))
      setStarting(false)
    } else {
      try {
        console.info('Starting Helia')
        const helia = await createHelia({
          libp2p: {
            transports: [webSockets(), webRTC(), circuitRelayTransport()],
            peerDiscovery: [
              bootstrap({
                list: [
                  '/dnsaddr/bootstrap.libp2p.io/p2p/QmSomeBootstrapPeerId',
                  '/dnsaddr/bootstrap.libp2p.io/p2p/QmAnotherBootstrapPeerId'
                ]
              })
            ]
          }
        })
        setHelia(helia)
        setFs(unixfs(helia))
        setStarting(false)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    startHelia()
  }, [])

  return (
    <HeliaContext.Provider
      value={{
        helia,
        fs,
        error,
        starting
      }}
    >{children}</HeliaContext.Provider>
  )
}

HeliaProvider.propTypes = {
  children: PropTypes.any
}
