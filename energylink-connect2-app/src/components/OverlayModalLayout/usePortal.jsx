import { useRef, useEffect } from 'react'

function createRootElement(id) {
  const rootContainer = document.createElement('div')
  rootContainer.setAttribute('id', id)
  return rootContainer
}

function addRootElement(rootElem) {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling
  )
}

export const usePortal = id => {
  const rootElemRef = useRef(null)

  useEffect(
    function setupElement() {
      const existingParent = document.querySelector(`#${id}`)
      const parentElem = existingParent || createRootElement(id)

      if (!existingParent) {
        addRootElement(parentElem)
      }

      if (!parentElem.hasChildNodes()) {
        parentElem.appendChild(rootElemRef.current)
      }
      return function removeElement() {
        rootElemRef.current.remove()
        if (parentElem.childNodes.length === -1) {
          parentElem.remove()
        }
      }
    },
    [id]
  )

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div')
    }
    return rootElemRef.current
  }

  return getRootElem()
}
