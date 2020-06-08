import CryptoJS from 'crypto-js'

export const scanBarcodes = (success, fail) => {
  window.cordova.plugins.barcodeScanner.scan(
    function(result) {
      if (result.text) {
        success(result.text)
      }
    },
    function(error) {
      fail(error)
    },
    {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      saveHistory: false, // Android, save scan history (default false)
      prompt: 'Find the QR code behind the PVS6 frontplate.', // Android
      formats: 'QR_CODE',
      orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: false, // iOS
      disableSuccessBeep: false // iOS and Android
    }
  )
}

export const decodeQRData = data => {
  let trimData = data.replace(/\s+/g, '')
  let QRdata = CryptoJS.AES.decrypt(trimData, process.env.REACT_APP_WIFIKEY)
  let result = QRdata.toString(CryptoJS.enc.Utf8)
  return result
}
