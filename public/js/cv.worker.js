
function canvasDisplay({msg, payload}){
  console.log(payload.previewImage);
  let mat = cv.matFromImageData(payload.previewImage);
  //let mat = cv.imread(payload.previewImage);
  result = new cv.Mat();
  //cv.imshow(payload.canvasID, mat);
  cv.cvtColor(mat, result, cv.COLOR_BGR2GRAY)
  postMessage({msg, payload:imageDataFromMat(result) });
  mat.delete();
  result.delete();
}

function imageDataFromMat(mat) {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat()
  const depth = mat.type() % 8
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
  mat.convertTo(img, cv.CV_8U, scale, shift)

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
      break
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
      break
    case cv.CV_8UC4:
      break
    default:
      throw new Error(
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
      )
  }
  const clampedArray = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  )
  img.delete()
  return clampedArray
}
/**
 *  Here we will check from time to time if we can access the OpenCV
 *  functions. We will return in a callback if it's been resolved
 *  well (true) or if there has been a timeout (false).
 */
function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
    if (cv.Mat) callbackFn(true)
  
    let timeSpentMs = 0
    const interval = setInterval(() => {
      const limitReached = timeSpentMs > waitTimeMs
      //console.log(!!cv.Mat);
      if (cv.Mat || limitReached) {
        clearInterval(interval)
        return callbackFn(!limitReached)
      } else {
        timeSpentMs += stepTimeMs
      }
    }, stepTimeMs)
  }
  
  /**
   * This exists to capture all the events that are thrown out of the worker
   * into the worker. Without this, there would be no communication possible
   * with the project.
   */
  onmessage = function (e) {
    switch (e.data.msg) {
      case 'load': {
        // Import Webassembly script
        self.importScripts('./opencv_3_4_custom_O3.js')
        waitForOpencv(function (success) {
          if (success) postMessage({ msg: e.data.msg })
          else throw new Error('Error on loading OpenCV')
        })
        break
      }
      case 'canvasDisplay':
        return canvasDisplay(e.data);
      default:
        break
    }
  }