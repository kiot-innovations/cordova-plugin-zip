## How to use modals

How it works is that you need to pass the animation state controller because if it is not there. There will be an unwanted side-effect that will remount the component
```
const modalContent = <div>MODAL CONTENT</div>
const modalTitle = <div>TITLE</div>

const TestComponent = props => {
  const modal = useModal(props.animationState, modalContent, modalTitle, dismissable)
  return (
    <div>
      {modal}
      <p>More stuff about the screen</p>
    </div>
  )
}
```
