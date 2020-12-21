import React from 'react'
import { useI18n } from 'shared/i18n'
import 'pages/PreCommissioning/PreCommissioning.scss'

export const ChecklistRow = ({ row, check }) => {
  const t = useI18n()

  const text = row.text
  return (
    <div className="precomm_checklist_row mt-10" key={text}>
      <div className="precomm_checklist_row_text">
        <label htmlFor={text} className="has-text-white">
          {t(text)}
        </label>
      </div>
      <div className="precomm_checklist_row_checkbox is-flex has-text-centered">
        <input
          type="checkbox"
          id={text}
          name={text}
          onChange={() => check(text)}
          checked={row.checked}
          className="checkbox-dark"
        />
      </div>
    </div>
  )
}
