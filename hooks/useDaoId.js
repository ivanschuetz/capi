import { useRouter } from "next/router";
import { useEffect } from "react";

export const useDaoId = () => {
  const {
    query: { daoId },
  } = useRouter();
  return daoId;
};

// NOTE: experimental - not used currently, just think about for possible refactoring
// TODO examine whether deps is needed
// f is often callbacks in the app context, which declare the dependencies too
// we probably should remove the deps from one of these, probably from the callbacks, but then we have to pass them from here? hmm
export const useEffectWithDaoId = (daoId, deps, f) => {
  useEffect(() => {
    if (daoId) {
      f();
    }
  }, [daoId, deps.statusMsg, deps.updateDao]);
};
