import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import OtherDevicesList, {
  CommonLayout,
  ConfigurePending,
  DeviceFound,
  isValid,
  NothingToDoHere,
  ProgressModal,
  RetryDiscovery
} from 'pages/StringInverters/OtherDevicesList'
import * as i18n from 'shared/i18n'

const mock = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mock
  })
}))

describe('The main OtherDevices component', function() {
  const store = {
    pvs: {
      settingMetadata: {},
      setMetadataStatus: ''
    },
    devices: {
      found: [
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Inverter',
          type: 'Inverter',
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter002ca',
          DEVICE_TYPE: 'Inverter',
          type: 'Inverter',
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A400-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Power Meter',
          type: 'Power Meter',
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        }
      ],
      progress: {
        progress: [
          {
            TYPE: 'MicroInverters',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRf',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SunSpecDevices',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'Meters',
            PROGR: '20',
            NFOUND: '0'
          },
          {
            TYPE: 'HubPlus',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'OtherInverters',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'MetStations',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'MIO',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'PV Disconnect',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRm',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRk',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRp',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'GroundCurMon',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'PVS5Meter',
            PROGR: '100',
            NFOUND: '2'
          }
        ],
        complete: false
      }
    },
    stringInverters: {
      models: ['SPR-A390-BLK', 'SPR-A400-BLK']
    }
  }

  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('should render correctly', function() {
    const { component } = mountWithProvider(<OtherDevicesList />)(store)
    expect(component).toMatchSnapshot()
  })
})

describe('The small components of the page', function() {
  describe('The RetryDiscovery component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const component = shallow(<RetryDiscovery />)
      expect(component).toMatchSnapshot()
    })
  })

  describe('The DeviceFound component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const mockOnClick = jest.fn()
      const component = shallow(
        <DeviceFound name="name" numberFound={1} onClick={mockOnClick} />
      )
      expect(component).toMatchSnapshot()
    })

    it('should call onClick', function() {
      const mockOnClick = jest.fn()
      const component = shallow(
        <DeviceFound name="name" numberFound={1} onClick={mockOnClick} />
      )
      component.prop('onClick')()
      expect(mockOnClick).toBeCalled()
    })
  })

  describe('The CommonLayout component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const onClick = jest.fn()
      const component = shallow(
        <CommonLayout title="TITLE" subtitle="SUBTITLE" onClick={onClick}>
          {<p>CHILD</p>}
        </CommonLayout>
      )
      expect(component).toMatchSnapshot()
    })

    it('should call onClick', function() {
      const onClick = jest.fn()
      const component = shallow(
        <CommonLayout title="TITLE" subtitle="SUBTITLE" onClick={onClick}>
          {<p>CHILD</p>}
        </CommonLayout>
      )
      const content = component.find('.common-layout-content')
      content.simulate('click')

      expect(onClick).toBeCalled()
    })
  })

  describe('The NothingToDoHere component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const onClick = jest.fn()
      const component = shallow(
        <NothingToDoHere title="TITLE" close={onClick} />
      )

      expect(component).toMatchSnapshot()
    })

    it('should call onClick', function() {
      const onClick = jest.fn()
      const component = shallow(
        <NothingToDoHere title="TITLE" close={onClick} />
      )
      const content = component.find('button')
      content.simulate('click')

      expect(onClick).toBeCalled()
    })
  })

  describe('The ProgressModal component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const component = shallow(<ProgressModal />)
      expect(component).toMatchSnapshot()
    })

    it('should call onClick', function() {
      const onClick = jest.fn()
      const component = shallow(<ProgressModal close={onClick} />)
      const content = component.find('button')
      content.simulate('click')

      expect(onClick).toBeCalled()
    })
  })

  describe('The ConfigurePending component', function() {
    let dispatchMock
    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key = '', ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    it('should render correctly', function() {
      const component = shallow(<ConfigurePending />)
      expect(component).toMatchSnapshot()
    })

    it('should call onClick', function() {
      const onClick = jest.fn()
      const component = shallow(<ConfigurePending close={onClick} />)
      const content = component.find('button')
      content.simulate('click')

      expect(onClick).toBeCalled()
    })
  })
})

describe('Helper functions', function() {
  describe('isValid', function() {
    it('should be valid', function() {
      const progress = [
        {
          TYPE: 'MicroInverters',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SPRf',
          PROGR: '100',
          NFOUND: '0'
        }
      ]
      const out = isValid(progress)
      expect(out).toEqual(progress)
    })

    it('should not be valid', function() {
      const progress = 'progress'
      const out = isValid(progress)
      expect(out).toEqual([{ PROGR: 0 }])
    })
  })
})
