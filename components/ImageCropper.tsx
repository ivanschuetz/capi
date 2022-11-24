import React, { useState } from "react"
import Cropper, { Area } from "react-easy-crop"

const IMAGE_WIDTH = 1032
const ASPECT_RATIO = 3

export const ImageCropper = ({
  updateBlob,
  inputImg,
  clear,
}: {
  updateBlob: (blob: Blob) => void
  inputImg: string
  clear: () => void
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // crop currently after each crop area modification. ideally on submit instead.
  const onCropComplete = async (_, croppedAreaPixels: Area) => {
    const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels)
    updateBlob(croppedImage)
  }

  return (
    <div className="crop_container">
      <Cropper
        image={inputImg}
        crop={crop}
        zoom={zoom}
        aspect={ASPECT_RATIO}
        objectFit="horizontal-cover"
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <div className="btn-container">
        <button className="delete" onClick={() => clear()}>
          Delete
        </button>
      </div>
    </div>
  )
}

export const getCroppedImg = async (
  imageSrc: string,
  crop: Area
): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = IMAGE_WIDTH
  canvas.height = IMAGE_WIDTH / ASPECT_RATIO

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        // TODO throw error? unclear when this happens - hasn't been reported so far - for now ignoring
        console.error("unexpected: blob is null")
      }
    }, "image/jpeg")
  })
}

// create image with base64 string src
const createImage = (base64: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = base64
  })
