import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useDrop } from "./FileUploader"
import { ImageCropper } from "./ImageCropper"
import styles from "./image_upload.module.sass"

export const ImageUpload = ({
  initImageBytes,
  setImageBytes,
}: {
  initImageBytes?: string
  setImageBytes: (bytes?: ArrayBuffer) => void
}) => {
  const {
    inputImg,
    updateCrop,
    clear,
    onFormSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useImageUpload(setImageBytes, initImageBytes)

  return (
    <form
      className={`upload-form-image_full_width ${
        isDragActive ? "highlighted" : ""
      }`}
      onSubmit={onFormSubmit}
    >
      {/* image uploader */}
      <div
        {...getRootProps({
          className:
            "bg-dashed_border bg-no-repeat bg-contain aspect-banner flex flex-col items-center justify-center gap-4",
        })}
      >
        <div className="text-te">{"Upload a cover image"}</div>
        <div className="upload-custom">
          <button className="h-12 w-36 bg-te text-bg transition hover:bg-pr">
            {"Upload"}
          </button>
          <input
            {...getInputProps()}
            className="upload-input"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="text-te">{"or Drag and drop here"}</div>
      </div>

      {/* image cropper */}
      {inputImg && (
        <ImageCropper
          updateBlob={updateCrop}
          inputImg={inputImg}
          showClear={true}
          clear={() => clear()}
          imageWidth={1032}
          aspectRatio={3}
          // Note: aspect ratio number above and aspect-banner in tailwind config have to be equal. This for sure can be improved.
          containerClassName={"absolute top-0 left-0 z-50 w-full aspect-banner"}
        />
      )}
    </form>
  )
}

export const CircleImageUpload = ({
  initImageBytes,
  setImageBytes,
}: {
  initImageBytes?: string
  setImageBytes: (bytes?: ArrayBuffer) => void
}) => {
  const {
    inputImg,
    updateCrop,
    onFormSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useImageUpload(setImageBytes, initImageBytes)

  return (
    <form
      className={`${styles.circle_upload_container} ${
        isDragActive ? "highlighted" : ""
      }`}
      onSubmit={onFormSubmit}
    >
      {/* image uploader */}
      <div {...getRootProps({ className: styles.upload_container })}>
        <div className="center-children h-36 w-36 border-spacing-12 rounded-full bg-dashed_border_round bg-cover bg-center bg-no-repeat p-7 text-center">
          <div>{"Drag and drop here"}</div>
        </div>
        <div>{"or"}</div>
        <div className="upload-custom">
          <button className="h-12 w-36 bg-te text-bg">Upload Image</button>
          <input
            {...getInputProps()}
            className="upload-input"
            type="file"
            accept="image/*"
          />
        </div>
      </div>

      {/* image cropper */}
      {inputImg && (
        <ImageCropper
          updateBlob={updateCrop}
          inputImg={inputImg}
          showClear={false}
          clear={() => {}}
          imageWidth={150}
          aspectRatio={1}
          containerClassName={"crop_container_circle"}
        />
      )}
    </form>
  )
}

const useImageUpload = (
  setImageBytes: (bytes?: ArrayBuffer) => void,
  initImageBytes?: string
): ImageUploadSettings => {
  // the image in base64 - not updated when cropping
  const [inputImg, setInputImg] = useState<string | null>(null)

  const [fileReader, setFileReader] = useState(null)

  initFileReader(setFileReader)
  initInputImg(setInputImg, initImageBytes)

  // sets image: called when uploading image with button or dropping it in target zone
  const onDrop = useDrop((file: File) => {
    if (fileReader) {
      setImageFromFile(fileReader, file, setInputImg)
    } else {
      console.log("Warn: no file reader set on drop. Should be already loaded.")
    }
  })

  const updateCrop = async (blob: Blob) => {
    if (fileReader) {
      const bytes = await blobToArrayBuffer(fileReader, blob)
      // console.log("crop updated - setting image bytes: %o", bytes)
      setImageBytes(bytes)
    }
  }

  const clear = () => {
    setInputImg(null) // clear displayed image
    setImageBytes(null) // clear state
  }

  const onFormSubmit = (e: any) => {
    e.preventDefault()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return {
    inputImg,
    updateCrop,
    clear,
    onFormSubmit,
    getRootProps,
    getInputProps,
    isDragActive,
  }
}

type ImageUploadSettings = {
  // base64 representation of original (i.e. not cropped) image
  inputImg: string | null
  // called when the crop area is updated, or the image is set
  updateCrop: (blob: Blob) => void
  // call this to remove the image
  clear: () => void
  // assign to the form's onSubmit handler
  onFormSubmit: (event: any) => void
  // dropzone properties, to be added to the containing root element
  getRootProps: any
  // dropzone properties, to be added to upload input
  // note: not sure this input is actually needed. It was removed in a test and everything seemed to still work.
  getInputProps: any
  // whether the user is dragging an image over the root element
  // can be used for styling (commonly to highlight the area)
  isDragActive: any
}

async function blobToArrayBuffer(
  fileReader: FileReader,
  blob: Blob
): Promise<ArrayBuffer> {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer()

  return new Promise((resolve, reject) => {
    const result = fileReader.result
    if (result instanceof ArrayBuffer) {
      fileReader.onload = () => resolve(result)
    }
    fileReader.onerror = () => reject
    fileReader.readAsArrayBuffer(blob)
  })
}

// convert image file to base64 string and set
const setImageFromFile = (
  fileReader: FileReader,
  file: File,
  setImg: (base64: string) => void
) => {
  fileReader.addEventListener(
    "load",
    () => {
      if (typeof fileReader.result === "string") {
        setImg(fileReader.result)
      } else {
        console.error(
          "Unexpected: file reader didn't return a string: %o",
          fileReader.result
        )
      }
    },
    false
  )
  if (file) {
    fileReader.readAsDataURL(file)
  }
}

const initFileReader = (setFileReader: (reader: FileReader) => void) => {
  useEffect(() => {
    setFileReader(new FileReader())
  }, [])
}

const initInputImg = (
  setInputImg: (img: string) => void,
  initImageBytes?: string
) => {
  useEffect(() => {
    // Quick fix: "object" check: prevents a circular update, where on initialization
    // image is set and initImageBytes sets it again (to invalid type)
    // TODO proper fix
    if (initImageBytes != null && typeof initImageBytes !== "object") {
      setInputImg(initImageBytes + "")
    }
  }, [initImageBytes])
}
