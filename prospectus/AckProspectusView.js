import { ProspectusView } from "./ProspectusView";

export const AckProspectusView = ({ deps, url, hash }) => {
  return (
    <div>
      <ProspectusView deps={deps} url={url} hash={hash} />
      <div>
        {
          "By acknowledging, you accept the conditions presented in this prospectus."
        }
      </div>
    </div>
  );
};
