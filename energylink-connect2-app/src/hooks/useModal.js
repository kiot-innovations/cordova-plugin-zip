import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import * as ReactDOM from 'react-dom'

const useModal = (
  animationState,
  content,
  title,
  initialVisible = true,
  dismissable = true
) => {
  const modalRoot = document.getElementById('modal-root')
  const [modalVisible, setModal] = useState(initialVisible)
  const toggleModal = () => {
    setModal(!modalVisible)
  }
  useEffect(() => {
    if (animationState === 'leave') {
      setModal(false)
    }
  }, [animationState])
  const modal = (
    <Modal
      display={modalVisible}
      close={toggleModal}
      title={title}
      dismissable={dismissable}
    >
      {content}
    </Modal>
  )
  return { modal: ReactDOM.createPortal(modal, modalRoot), toggleModal }
}
export default useModal
