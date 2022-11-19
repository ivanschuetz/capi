import { useRouter } from "next/router"

export const useDaoId = (): string | undefined => {
  const {
    query: { daoId },
  } = useRouter()

  if (!daoId) {
    // when the page loads, the query is initially undefined, so we also return undefined
    // note that we don't check explicitly for undefined - leniently including null
    return undefined
  } else if (typeof daoId === "string") {
    return daoId
  } else {
    const router = useRouter()
    throw new Error(
      "Invalid daoId: " +
        daoId +
        ", type: " +
        typeof daoId +
        ", path: " +
        router.pathname
    )
  }
}
