import React from 'react'
import Footer from '.'
import paths from 'routes/paths'

describe('Footer Component', () => {
  const initialState = {
    ui: { footer: true },
    global: { lastVisitedPage: paths.PROTECTED.CONNECT_TO_PVS.path },
    network: { connected: false },
    language: {},
    fileDownloader: {
      settings: {
        essUpdateOverride: {
          url: '',
          displayName: ''
        },
        pvsUpdateOverride: {
          url: '',
          displayName: ''
        }
      }
    },
    superuser: {
      showSuperuserSettings: false
    }
  }

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<Footer />)(initialState)
    expect(component.html()).toMatchSnapshot()
  })

  test('Renders nothing if Footer is false', () => {
    const { component } = mountWithProvider(<Footer />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
