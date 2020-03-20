/* eslint-disable no-undef */
import { path, map } from 'ramda'

export function scanM(onRecognize, nodeID = 'scandit') {
  const key = process.env.REACT_APP_SCANDIT

  const context = Scandit.DataCaptureContext.forLicenseKey(key)

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
  settings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128
  ])

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

  const fill = Scandit.Color.fromRGBA(230, 126, 34, 0.3)
  const stroke = Scandit.Color.fromRGBA(230, 126, 34, 1)

  overlay.listener = {
    brushForTrackedBarcode: (overlay, trackedBarcode) =>
      new Scandit.Brush(fill, stroke, 2)
  }

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On)
  barcodeTracking.isEnabled = true

  return () => {
    barcodeTracking.isEnabled = false
    camera.switchToDesiredState(Scandit.FrameSourceState.Off)
  }
}
