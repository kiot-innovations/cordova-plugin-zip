import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, flatMap, map, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { waitFor } from 'shared/utils'
import { getFirmwareVersionNumber, getPFile } from 'state/actions/fileDownloader'
import {
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLL_INIT,
  FIRMWARE_UPDATE_POLL_STOP,
  FIRMWARE_UPDATE_POLLING
} from 'state/actions/firmwareUpdate'

/**
 * will upload the FS to the PVS
 * @returns {Promise<PVSFileURL>}
 */
const uploadFirmwarePVS =  () => new Promise(async (resolve, reject) => {
  {
    try {
      const { luaFileName } = await getFirmwareVersionNumber()
      const file = await getPFile(`${luaFileName}.fs`)
      console.log('GETTING FILE SUCCESS', file.localURL)
      function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
      }

      function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
      }

      var uri = encodeURI("http://some.server.com/upload.php");

      const options = new window.FileUploadOptions()
      options.fileKey="file";
      options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
      options.mimeType="text/plain";

      const ft = new FileTransfer()
      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          loadingStatus.increment();
        }
      };
      ft.upload(fileURL, uri, win, fail, options);
    } catch (e) {
      console.error('UPLOAD FIRMWARE PVS', e)
      reject(e)
    }
    console.warn('UPLOAD SUCCESSFUL')
})
}

/**
 * Will tell the PVS to start the upgrade based on the file URL sent before
 * @param PVSFileURL -> File location of the FS inside the PVS
 * @returns {Promise<boolean>}
 * @constructor
 */
const startUpgrade = async (PVSFileURL = '') => {
  console.warn('STARTING THE PVS UPGRADE')
  await waitFor(3000)
  // const swagger = await getApiPVS()
  // const res = await swagger.apis.firmware.startUpgrade({ url: PVSFileURL })
  // if (res.ok) console.warn(res.body)
  // else console.error(res)
  return true
}
/**
 * Will ask the PVS if the upgrade has finished
 * @returns {Promise<boolean>}
 */
const getUpgradeStatus = async () => {
  const swagger = await getApiPVS()
  console.warn(swagger)
  const res = await swagger.apis.firmware.getUpgradeStatus()
  if (res.ok) console.warn(res.body)
  else console.warn(res)
  return false
}

const firmwareUpgradeInit = action$ =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_INIT.getType()),
    flatMap(() =>
      from(uploadFirmwarePVS()).pipe(
        map(() => of(FIRMWARE_UPDATE_POLL_INIT())),
        catchError(err => of(FIRMWARE_UPDATE_ERROR.asError(err)))
      )
    )
  )

const firmwarePollStatus = action$ => {
  const stopPolling$ = action$.pipe(ofType(FIRMWARE_UPDATE_POLL_STOP.getType()))
  return action$.pipe(
    ofType(FIRMWARE_UPDATE_POLL_INIT.getType()),
    switchMap(() => {
      timer(0, 1000).pipe(
        takeUntil(stopPolling$),
        map(() =>
          from(getUpgradeStatus()).pipe(async status => {
            console.warn('STATUS', status)
            return FIRMWARE_UPDATE_POLLING()
          })
        )
      )
    })
  )
}

export default [firmwareUpgradeInit, firmwarePollStatus]
