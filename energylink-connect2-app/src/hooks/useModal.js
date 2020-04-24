import React, { useEffect, useState } from 'react'
import Modal from 'components/Modal'
import * as ReactDOM from 'react-dom'

const useModal = (
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
    return () => {
      setModal(false)
    }
  }, [])
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
  return {
    modal: ReactDOM.createPortal(modal, modalRoot),
    toggleModal,
    setModal
  }
}
export default useModal
