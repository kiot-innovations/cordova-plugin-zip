/* eslint-disable no-undef */
import { path, map } from 'ramda'

export function scanv6(onRecognize = didRecognizeNewCodes) {
  const key =
    'AZv+xTPQLbW2KcZlCTPEbPQbxArdCR3/tzVv2n5tGSnhHzp4kFWrY3xZ6UMBc50kj3UmbRNRIoblWz3TqXIll9d6cwnyJtXo3yzQ3dRUxR40XC2BYHMwpEhJ0wGwUdIepnNIcD9+lS9uZoh9HiHgz3UFReoROaFMWEGoNfYazHSoywIAeLSaka2dxlSlLC9odtRW8hL6RaUuQx35oSlD6huIENaolXb8yv6TC5g6cq69mknB4UG2pSbJEmWHUrvhxAq7YNylxaovWKhWH2HBeEKqvRc2obQ1y0eJ4OBeHmpbQEQotA1TWc+oJLbEMW3OlAqmjKF0skLKuy2Ssnsoacvwb5cc8X6qBffEGePEF1ysYeCUGL4gc1VwR6m/39A3n6m7LCiSDE4Y/iyN7hLEHihH5n1pWEep1+Th1ZwNSxDVHDKfHXpL2al6lAgCQbQibDBL1xF2KbsFL/i4hOyyLXwbf+ZdcPiQyNSWa0QEnJ7/+cZU6eHyGUFPhvmBWQuo7lW5zEA8Q7VVaEqiyrGrevFmYU+iJEmEaOs6zh46hmcKMRAGiCMsgb4dPJGkbl35e0wODKTnGmnAt3DZIn5NWcoR34m/pKgUYVbOFMLuM1c5YJxfpj+jEw4dSjOfQFZUEGykxSj4NK8xsMYaE1QsI4Mhn/iPRy+HecAJsRqF95L1fmaIqH2XlQeXgDsKaGViflwiC3BOQ1xotAQas75vt/kVdNN0bmMLVFX5PcuQY2sRUW8Sc0LYeMZEtqbYA+4NNGnmaZUU9/DGykD+MAQp/j+Ir20cesc+09p9Ar6kuiJoNeolhWo+6WTVse7CSkIJ0EZiQq/Pj6hpZaE='

  const context = Scandit.DataCaptureContext.forLicenseKey(key)

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
  settings.enableSymbologies([
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.QR,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128
  ])

  // Create new barcode capture mode with the settings from above.
  const barcodeCapture = Scandit.BarcodeCapture.forContext(context, settings)

  // Register a listener to get informed whenever a new barcode got recognized.
  barcodeCapture.addListener({
    didScan: (barcodeCapture, session) => {
      const barcode = session.newlyRecognizedBarcodes[0]
      const symbology = new Scandit.SymbologyDescription(barcode.symbology)

      // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be processed
      // until the alert dialog is dismissed, we're showing the alert through a timeout and disabling the barcode
      // capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener callbacks for
      // longer periods of time. See the documentation to learn more about this.
      setTimeout(() => {
        alert(`Scanned: ${barcode.data} (${symbology.readableName})`)
        barcodeCapture.isEnabled = true
      }, 100)
      barcodeCapture.isEnabled = false
    }
  })

  // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context)

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('scandit'))

  // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  const overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(
    barcodeCapture,
    view
  )
  overlay.viewfinder = new Scandit.RectangularViewfinder()

  // Switch camera on to start streaming frames and enable the barcode capture mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On)
  barcodeCapture.isEnabled = true
}

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
