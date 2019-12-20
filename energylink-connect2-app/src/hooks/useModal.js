import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import * as ReactDOM from 'react-dom'

const useModal = (animationState, content, title, dismissable) => {
  const modalRoot = document.getElementById('modal-root')
  const [modalVisible, setModal] = useState(true)
  const toggleModal = () => {
    setModal(!modalVisible)
  }
  useEffect(() => {
    if (animationState === 'leave') {
      setModal(false)
    }
  }, [animationState])
  const modal = (
    <>
      <Modal
        display={modalVisible}
        close={toggleModal}
        title={title}
        dismissable={dismissable}
      >
        {content}
      </Modal>
    </>
  )
  return ReactDOM.createPortal(modal, modalRoot)
}
export default useModal
