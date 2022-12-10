import { useEffect, useMemo, useState } from "react"

// this could be refactored to separate component logic (move returned css classes to custom components). for now like this.
export const useTextCounter = (
  maxLength: number,
  inputValue?: string
): {
  // number to be displayed
  remainingChars: number
  // class to be applied to input
  inputErrorClass: string | null
  // class to be applied to view with length
  lengthClass: string | null
  // whether to show view with length
  showLength: boolean
  // toggle showing view with length
  setShowLength: (value: boolean) => void
  // set the input length (used to calculate remaining chars)
  setInputLength: (value: number) => void
} => {
  const [inputLength, setInputLength] = useState(0)
  const [showLength, setShowLength] = useState(false)

  const remainingChars = useMemo(() => {
    return maxLength - inputLength
  }, [maxLength, inputLength])

  const stateForRemainingChars = useMemo(() => {
    if (remainingChars < 0) {
      return "over"
    } else {
      return "ok"
    }
  }, [remainingChars])

  const inputErrorClass = useMemo(() => {
    if (stateForRemainingChars === "over") {
      return "input-length-error"
    } else {
      return null
    }
  }, [stateForRemainingChars])

  const lengthClass = useMemo(() => {
    if (stateForRemainingChars === "over") {
      return "red-20"
    } else {
      return null
    }
  }, [stateForRemainingChars])

  useEffect(() => {
    setInputLength(inputValue?.length ?? 0)
  }, [inputValue])

  return {
    remainingChars,
    inputErrorClass,
    lengthClass,
    showLength,
    setShowLength,
    setInputLength,
  }
}
