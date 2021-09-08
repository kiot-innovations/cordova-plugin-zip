/* eslint-disable no-undef */
import { path, map, contains, flip, reject } from 'ramda'
import * as Sentry from 'sentry-cordova'

import { isIos } from './utils'

const fcontains = flip(contains)

export function scanAR(onRecognize, nodeID = 'scandit') {
  const KEY = isIos()
    ? process.env.REACT_APP_SCANDIT_IOS
    : process.env.REACT_APP_SCANDIT_ANDROID

  const keyBasedOnEnv =
    process.env.REACT_APP_FLAVOR === 'cm2-prod'
      ? KEY
      : process.env.REACT_APP_SCANDIT

  const node = document.getElementById(nodeID)
  const context = Scandit.DataCaptureContext.forLicenseKey(keyBasedOnEnv)

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default
  const cameraSettings = Scandit.BarcodeCapture.recommendedCameraSettings
  camera.applySettings(cameraSettings)
  camera.preferredResolution = Scandit.VideoResolution.FullHD
  context.setFrameSource(camera)

  // The barcode tracking process is configured through barcode tracking settings
  // which are then applied to the barcode tracking instance that manages barcode tracking.
  const settings = new Scandit.BarcodeTrackingSettings()

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([Scandit.Symbology.Code128])

  // Create new barcode tracking mode with the settings from above.
  const barcodeTracking = Scandit.BarcodeTracking.forContext(context, settings)

  const feedback = new Scandit.Feedback(null, Scandit.Sound.defaultSound)
  feedback.emit()

  const history = []

  // Register a listener to get informed whenever a new barcode is tracked.
  barcodeTracking.addListener({
    didUpdateSession: (barcodeTracking, session) => {
      if (session.addedTrackedBarcodes.length > 0) {
        const barcodes = map(
          path(['barcode', 'data']),
          session.addedTrackedBarcodes
        )

        const newlyAdded = reject(fcontains(history), barcodes)

        newlyAdded.forEach(ab => {
          history.push(ab)
          feedback.emit()
        })

        onRecognize(barcodes)
      }
    }
  })

  // To visualize the on-going barcode tracking process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context)

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(node)

  // Add a barcode tracking overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  const overlay = Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(
    barcodeTracking,
    view
  )

  const fill = Scandit.Color.fromRGBA(0, 255, 0, 0.3)
  const stroke = Scandit.Color.fromRGBA(0, 255, 0, 1)

  overlay.brush = new Scandit.Brush(fill, stroke, 2)

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  const toOn = camera.switchToDesiredState(Scandit.FrameSourceState.On)
  toOn.catch(Sentry.captureException)
  barcodeTracking.enabled = true
  node.textContent = Math.random()

  return () => {
    const toOff = camera.switchToDesiredState(Scandit.FrameSourceState.Off)
    toOff.catch(Sentry.captureException)
    barcodeTracking.enabled = false
  }
}
