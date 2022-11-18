import { useEffect, useRef } from "react"

export default function useEffectOnce(f: () => void) {
  const ref = useRef(true)
  useEffect(() => {
    if (ref.current) {
      f()
    }
    return () => {
      ref.current = false
    }
  }, [f])
}
