import React, { useEffect } from 'react'
import clsx from 'clsx'
import {
  anyPass,
  compose,
  cond,
  head,
  isEmpty,
  isNil,
  length,
  lt,
  filter,
  map,
  pathOr,
  propEq,
  path,
  T,
  test,
  not,
  equals,
  always
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

import { GET_INTERFACES_INIT } from 'state/actions/systemConfiguration'
import { SET_ONLINE } from 'state/actions/network'

import './InterfacesWidget.scss'

function InterfacesWidget(props) {
  const dispatch = useDispatch()
  const t = useI18n()

  const { data, isFetching, error } = useSelector(
    path(['systemConfiguration', 'interfaces'])
  )
  const { serialNumber } = useSelector(path(['pvs']))
  const upInterface = internetUpInterface(data)
  useEffect(() => {
    dispatch(GET_INTERFACES_INIT())
  }, [dispatch])

  useEffect(() => {
    dispatch(SET_ONLINE(upInterface))
  }, [dispatch, upInterface])

  return (
    <section className="iw is-flex collapsible pl-0">
      <div className="pvs">
        <span className="sp-pvs has-text-white" />
      </div>
      <div className="ifs">
        <div className="mb-5 has-text-white is-uppercase has-text-weight-bold">
          {serialNumber}
        </div>
        {either(!isFetching, <InternetStatus name={upInterface} />)}
        {isFetching ? t('LOADING') : showInterfaces(data, error, t)}
      </div>
    </section>
  )
}

const interfaceName = cond([
  [equals('sta0'), always('WiFi')],
  [equals('cell'), always('Cellular')],
  [equals('wan'), always('Ethernet')],
  [T, always('')]
])
const interfaceId = pathOr('', ['interface'])
const internetUp = propEq('internet', 'up')
const internetUpInterfaces = filter(internetUp)
const internetUpInterface = compose(
  interfaceName,
  interfaceId,
  head,
  internetUpInterfaces
)

function InternetStatus({ name }) {
  const t = useI18n()
  const connected = !isEmpty(name) && !isNil(name)
  const iconClass = clsx('mr-10', {
    'sp-check up connected': connected,
    'sp-hey has-text-danger': !connected
  })
  const textClass = clsx({ connected, 'has-text-danger': !connected })
  const text = t(
    connected ? 'PVS_INTERNET_INTERFACE' : 'PVS_NO_INTERNET_INTERFACE',
    name
  )

  return (
    <p className="if mt-5 ml-20">
      <span className={iconClass} />
      <span className={textClass}>{text}</span>
    </p>
  )
}

const isntPLC = compose(not, propEq('interface', 'plc'))
const getInterfaces = t => compose(map(getInterface(t)), filter(isntPLC))

const showInterfaces = (data, error, t) =>
  hasData(data) && isNil(error) ? getInterfaces(t)(data) : t('NO_DATA')

const hasData = compose(lt(0), length)
const ICON = {
  sta0: 'sp-wifi',
  cell: 'sp-cell',
  wan: 'sp-eth'
}

const getInterface = t => ifc => (
  <Interface
    key={ifc.interface}
    icon={ICON[ifc.interface]}
    name={getInterfaceName(t)(ifc)}
  />
)

function Interface({ icon, name }) {
  const t = useI18n()
  const isConnected =
    !test(new RegExp(t('NO_CONNECTION')), name) && !test(/UNKNOWN/, name)

  const classConnected = {
    'has-text-white': isConnected
  }

  const iconClasses = clsx(icon, 'mr-10', classConnected)
  const textClasses = clsx(classConnected)

  const indicator = clsx('sp', {
    'connected has-text-white': isConnected,
    disconnected: !isConnected
  })

  return (
    <p className="if mt-5 ml-20">
      <span className={indicator} />
      <span className={iconClasses} />
      <span className={textClasses}>{name}</span>
    </p>
  )
}

// String -> Object -> String
const getInterfaceName = t =>
  cond([
    [propEq('interface', 'cell'), withDefault('provider', t)],
    [propEq('interface', 'sta0'), withDefault('ssid', t)],
    [propEq('interface', 'wan'), withDefault('ipaddr', t)]
  ])

// String -> Object -> String
const withDefault = (prop, t) => obj => {
  const iface = obj['interface'] === 'sta0' ? 'WiFi' : obj['interface']
  return hasEmptyValue(obj[prop])
    ? `${t('NO_CONNECTION')} (${iface})`
    : `${obj[prop]} (${iface})`
}

const hasEmptyValue = anyPass([isNil, isEmpty])

export default InterfacesWidget
