import { of } from 'rxjs'
import { actions } from '@sunpower/panel-layout-tool'
import * as rxjs from 'rxjs'
import {
  PLT_LOAD,
  PLT_LOAD_FINISHED,
  PLT_SAVE,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

describe('epic panel-layout-tool', () => {
  describe('getPanelLayoutEpic', () => {
    let epicTest
    describe('on successfull api call', () => {
      beforeEach(() => {
        jest.doMock('rxjs', () => ({
          ...rxjs,
          from: () => of([])
        }))

        jest.doMock('../../../shared/fetch', () => ({}))
        const getPanelLayoutEpic = require('./index').getPanelLayoutEpic

        epicTest = epicTester(getPanelLayoutEpic)
      })

      afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
      })

      it('on PLT_LOAD succeeded, it will init the panel layout tool', () => {
        const inputValues = {
          a: PLT_LOAD()
        }
        const expectedValues = {
          b: actions.init([]),
          c: PLT_LOAD_FINISHED()
        }

        const inputMarble = 'a'
        const expectedMarble = '(bc)'

        epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {
          network: { SSID: 'SunPower85888', password: '18858888' }
        })
      })
    })
  })

  describe('savePanelLayoutEpic', () => {
    let epicTest
    describe('on successfull api call', () => {
      beforeEach(() => {
        jest.doMock('rxjs', () => ({
          ...rxjs,
          from: () => of([])
        }))

        jest.doMock('../../../shared/fetch', () => ({}))
        const savePanelLayoutEpic = require('./index').savePanelLayoutEpic

        epicTest = epicTester(savePanelLayoutEpic)
      })

      afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
      })

      it('on PLT_SAVE succeeded, dispatch PLT_SAVE_FINISHED', () => {
        const inputValues = {
          a: PLT_SAVE()
        }
        const expectedValues = {
          b: PLT_SAVE_FINISHED([])
        }

        const inputMarble = 'a'
        const expectedMarble = 'b'

        epicTest(inputMarble, expectedMarble, inputValues, expectedValues, {})
      })
    })
  })
})
