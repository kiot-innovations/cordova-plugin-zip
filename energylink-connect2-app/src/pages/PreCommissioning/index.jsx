import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clone, includes, map, pluck } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useI18n } from 'shared/i18n'
import { SHOW_PRECOMMISSIONING_CHECKLIST } from 'state/actions/global'
import { ChecklistRow } from 'components/ChecklistRow'
import paths from 'routes/paths'
import './PreCommissioning.scss'

const initialChecklistState = [
  { text: 'PRECOMM_HO_DETAILS', checked: false },
  { text: 'PRECOMM_WIFI_CREDENTIALS', checked: false },
  { text: 'PRECOMM_FULL_CHARGE', checked: false },
  { text: 'PRECOMM_DND_MODE', checked: false },
  { text: 'PRECOMM_MI_STICKERS', checked: false },
  { text: 'PRECOMM_PV_MODELS', checked: false },
  { text: 'PRECOMM_CT_ORIENTATION', checked: false },
  { text: 'PRECOMM_PV_BREAKERS', checked: false }
]

function PreCommissioning() {
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  const { showPrecommissioningChecklist } = useSelector(state => state.global)

  const [checklist, setChecklist] = useState(clone(initialChecklistState))
  const [remindMe, setRemindMe] = useState(false)
  const [modal, showModal] = useState(false)

  const updateChecklist = key => {
    const updatedChecklist = checklist.map(elem => {
      if (elem.text === key) {
        elem.checked = !elem.checked
      }
      return elem
    })
    setChecklist(updatedChecklist)
  }

  const renderRow = row => {
    return (
      <ChecklistRow key={row.text} row={row} check={updateChecklist} t={t} />
    )
  }

  const validateChecklist = () => {
    const checks = pluck('checked', checklist)
    if (includes(false, checks)) {
      showModal(true)
    } else {
      setChecklist(initialChecklistState)
      showModal(false)
      dispatch(SHOW_PRECOMMISSIONING_CHECKLIST(!remindMe))
      history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
    }
  }

  useEffect(() => {
    if (!showPrecommissioningChecklist) {
      history.push(paths.PROTECTED.PVS_SELECTION_SCREEN.path)
    }
  }, [history, showPrecommissioningChecklist])

  return (
    <div className="precomm pl-15 pr-15">
      <div className="is-flex tile is-vertical has-text-centered">
        <span className="is-uppercase has-text-weight-bold">
          {t('PRECOMM_TITLE')}
        </span>
        <span className="mt-10">{t('PRECOMM_SUBTITLE')}</span>
      </div>
      <div className="precomm_checklist">
        {map(renderRow, checklist)}
        <div className="precomm_checklist_dont-remind mt-10">
          <div className="is-flex file is-centered has-text-centered">
            <input
              type="checkbox"
              id="PRECOMM_DONT_REMIND_ME"
              name="PRECOMM_DONT_REMIND_ME"
              onChange={e => setRemindMe(e.target.checked)}
              checked={remindMe}
              className="checkbox-dark"
            />
          </div>
          <div className="precomm_checklist_row_text">
            <label
              htmlFor="PRECOMM_DONT_REMIND_ME"
              className="has-text-primary"
            >
              {t('PRECOMM_DONT_REMIND_ME')}
            </label>
          </div>
        </div>
      </div>
      <div className="precomm_footer pt-20 pb-20 has-text-centered">
        <button className="button is-primary" onClick={validateChecklist}>
          {t('CONTINUE')}
        </button>
      </div>
      <SwipeableBottomSheet
        shadowTip={false}
        open={modal}
        onChange={() => showModal(!modal)}
      >
        <div className="precomm_modal has-text-white has-text-centered">
          <div className="mb-20">
            <span className="sp-hey is-size-1" />
          </div>
          <div>
            <span>{t('PRECOMM_CHECK_ALL')}</span>
          </div>
          <div className="mt-10">
            <button
              onClick={() => showModal(false)}
              className="button is-primary"
            >
              {t('OK')}
            </button>
          </div>
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default PreCommissioning
