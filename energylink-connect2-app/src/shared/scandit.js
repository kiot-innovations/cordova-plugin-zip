/* eslint-disable no-undef */
import * as Sentry from '@sentry/browser'
import { path, map } from 'ramda'
import { isIos } from './utils'

export function scanM(onRecognize, nodeID = 'scandit') {
  const KEY = isIos()
    ? process.env.REACT_APP_SCANDIT_IOS
    : process.env.REACT_APP_SCANDIT_ANDROID

  const keyBasedOnEnv =
    process.env.REACT_APP_IS_TEST || process.env.REACT_APP_IS_DEV
      ? process.env.REACT_APP_SCANDIT
      : KEY

  const context = Scandit.DataCaptureContext.forLicenseKey(keyBasedOnEnv)

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default
  // camera.preferredResolution = Scandit.VideoResolution.FullHD
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

  // Register a listener to get informed whenever a new barcode is tracked.
  barcodeTracking.addListener({
    didUpdateSession: (barcodeTracking, session) => {
      if (session.addedTrackedBarcodes.length > 0) {
        const barcodes = map(
          path(['barcode', 'data']),
          session.addedTrackedBarcodes
        )

        onRecognize(barcodes)
      }
    }
  })

  // To visualize the on-going barcode tracking process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context)

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById(nodeID))

  // Add a barcode tracking overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  const overlay = Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(
    barcodeTracking,
    view
  )

  const fill = Scandit.Color.fromRGBA(0, 255, 0, 0.3)
  const stroke = Scandit.Color.fromRGBA(0, 255, 0, 1)

  overlay.listener = {
    brushForTrackedBarcode: (overlay, trackedBarcode) =>
      new Scandit.Brush(fill, stroke, 2)
  }

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  const toOn = camera.switchToDesiredState(Scandit.FrameSourceState.On)
  toOn.catch(Sentry.captureException)
  barcodeTracking.isEnabled = true

  return () => {
    const toOff = camera.switchToDesiredState(Scandit.FrameSourceState.Off)
    toOff.catch(Sentry.captureException)
    barcodeTracking.isEnabled = false
  }
}

export function scanSimple(onRecognize, nodeID = 'scandit') {
  const KEY = isIos()
    ? process.env.REACT_APP_SCANDIT_IOS
    : process.env.REACT_APP_SCANDIT_ANDROID

  const keyBasedOnEnv =
    process.env.REACT_APP_IS_TEST || process.env.REACT_APP_IS_DEV
      ? process.env.REACT_APP_SCANDIT
      : KEY

  const context = Scandit.DataCaptureContext.forLicenseKey(keyBasedOnEnv)

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default
  context.setFrameSource(camera)

  // The barcode capturing process is configured through barcode capture settings
  // and are then applied to the barcode capture instance that manages barcode recognition.
  const settings = new Scandit.BarcodeCaptureSettings()

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([Scandit.Symbology.QR])

  // Create new barcode capture mode with the settings from above.
  const barcodeCapture = Scandit.BarcodeCapture.forContext(context, settings)

  // Register a listener to get informed whenever a new barcode got recognized.
  barcodeCapture.addListener({
    didScan: (barcodeCapture, session) => {
      if (session.newlyRecognizedBarcodes.length > 0) {
        const barcodes = map(path(['data']), session.newlyRecognizedBarcodes)
        onRecognize(barcodes)
      }
    }
  })

  // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context)

  // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  const overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(
    barcodeCapture,
    view
  )

  overlay.viewfinder = new Scandit.RectangularViewfinder()

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('scandit'))
  // Switch camera on to start streaming frames and enable the barcode capture mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On)
  barcodeCapture.isEnabled = true

  return () => {
    camera.switchToDesiredState(Scandit.FrameSourceState.Off)
    barcodeCapture.isEnabled = false
  }
}
