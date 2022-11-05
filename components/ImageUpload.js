import React, { useState } from "react";
import { ImageCropper } from "./ImageCropper";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { useDrop } from "./FileUploader";

// TODO react -> nextjs
// const fileReader = new FileReader();

export const ImageUpload = ({ initImageBytes, setImageBytes }) => {
  // the initial image - not updated when changing the crop area
  const [inputImg, setInputImg] = useState(null);

  useEffect(() => {
    // Quick fix: "object" check: prevents a circular update, where on initialization
    // image is set and initImageBytes sets it again (to invalid type)
    // TODO proper fix
    if (initImageBytes != null && typeof initImageBytes !== "object") {
      setInputImg(initImageBytes + "");
    }
  }, [initImageBytes]);

  // sets image: called when uploading image with button or dropping it in target zone
  const onDrop = useDrop((file) => {
    setImageFromFile(file, setInputImg);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // called when the crop area is updated (also triggered by setting the image)
  const updateCrop = async (blob) => {
    const bytes = await blobToArrayBuffer(blob);
    console.log("crop updated - setting image bytes: %o", bytes);
    setImageBytes(bytes);
  };

  const clear = () => {
    setInputImg(null); // clear displayed image
    setImageBytes([]); // clear state
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className={`upload-form-image ${isDragActive ? "highlighted" : ""}`}
      onSubmit={handleSubmitImage}
    >
      {/* <div className="upload-container"> */}

      {/* upload image: set in inputImg via onDrop */}
      <div {...getRootProps({ className: "upload-container" })}>
        <div className="grey-190">Upload a cover image</div>
        <div className="upload-custom">
          <button className="file-custom secondary-button">Upload Image</button>
          <input
            {...getInputProps()}
            className="upload-input"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="grey-190">or Drag and drop here</div>
      </div>

      {/* crop image: gets image from inputImg hook, updates it via updateCrop */}
      {inputImg && (
        <ImageCropper
          updateBlob={updateCrop}
          inputImg={inputImg}
          clear={() => clear()}
        />
      )}
    </form>
  );
};

async function blobToArrayBuffer(blob) {
  if ("arrayBuffer" in blob) return await blob.arrayBuffer();

  return new Promise((resolve, reject) => {
    // TODO react -> nextjs
    // const reader = new FileReader();
    // reader.onload = () => resolve(reader.result);
    // reader.onerror = () => reject;
    // reader.readAsArrayBuffer(blob);
  });
}

// convert image file to base64 string and set
const setImageFromFile = (file, setImg) => {
  // TODO react -> nextjs
  //   fileReader.addEventListener(
  //     "load",
  //     () => {
  //       //   console.log("init bytes have to look like this: %o", fileReader.result);
  //       setImg(fileReader.result);
  //     },
  //     false
  //   );
  //   if (file) {
  //     fileReader.readAsDataURL(file);
  //   }
};
