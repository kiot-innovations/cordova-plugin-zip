import React from 'react'

import './StatusBox.scss'

function StatusBox({ title, text, indicator }) {
  return (
    <section className="boxwrap mb-10 mt-10 pl-20 pr-20 pt-20 pb-20">
      <article className="left">
        <p className="has-text-white has-text-weight-bold">{title}</p>
        <p className="mt-10">{text}</p>
      </article>
      <article className="is-flex file level is-right is-size-2 has-text-white has-text-weight-bold">
        {indicator}
      </article>
    </section>
  )
}

export default StatusBox
