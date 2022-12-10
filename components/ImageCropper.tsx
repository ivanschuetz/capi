import { useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import trash from "../images/trash.svg"

export const ImageCropper = ({
  updateBlob,
  inputImg,
  showClear,
  clear,
  imageWidth,
  aspectRatio,
  containerClassName,
}: {
  // called when the crop area is modified, with its corresponding bytes
  updateBlob: (blob: Blob) => void
  // the image with which to initialize the cropper
  inputImg: string
  // whether to show the delete button
  showClear: boolean
  // called when delete button is pressed
  clear: () => void
  // image width
  imageWidth: number
  // aspect ratio, to calculate the height dynamically
  aspectRatio: number
  containerClassName: string
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // crop currently after each crop area modification. ideally on submit instead.
  const onCropComplete = async (_, croppedAreaPixels: Area) => {
    const croppedImage = await getCroppedImg(
      inputImg,
      croppedAreaPixels,
      imageWidth,
      aspectRatio
    )
    updateBlob(croppedImage)
  }

  return (
    <div className={containerClassName}>
      <Cropper
        image={inputImg}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        objectFit="auto-cover"
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <div className="absolute right-4 bottom-4 flex gap-10">
        {showClear && (
          <button
            className="flex h-8 w-28 items-center justify-center gap-2 bg-te px-2 font-bold text-bg transition hover:bg-pr"
            onClick={() => clear()}
          >
            <img src={trash.src} alt="trash" />
            {"Delete"}
          </button>
        )}
      </div>
    </div>
  )
}

export const getCroppedImg = async (
  imageSrc: string,
  crop: Area,
  imageWidth: number,
  aspectRatio: number
): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = imageWidth
  canvas.height = imageWidth / aspectRatio

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
