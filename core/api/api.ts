import { fetchBlob, fetchJson } from "../common/fetch";
import {
  toInteger,
  toTealSourceTemplate,
  VersionedTealSourceTemplate,
} from "../common/types";

export type LastVersions = {
  app_approval: number;
  app_clear: number;
};

export type AppTealTemplates = {
  approval: VersionedTealSourceTemplate;
  clear: VersionedTealSourceTemplate;
};

export const fetchAppTeal = async (): Promise<AppTealTemplates> => {
  // >TODO from environment
  const apiUrl = "http://localhost:8000";

  const lastVersions: LastVersions = await fetchJson(`${apiUrl}/teal/versions`);
  console.log("last teal versions: %o", lastVersions);

  const approval = await fetchBlob(
    `${apiUrl}/teal/approval/${lastVersions.app_approval}`
  );
  const clear = await fetchBlob(
    `${apiUrl}/teal/clear/${lastVersions.app_clear}`
  );

  return {
    approval: await toVersionedTealSourceTemplate(
      lastVersions.app_approval,
      approval
    ),
    clear: await toVersionedTealSourceTemplate(lastVersions.app_clear, clear),
  };
};

const toVersionedTealSourceTemplate = async (
  versionNumber: number,
  compiledTealBlob: Blob
): Promise<VersionedTealSourceTemplate> => {
  return {
    version: toInteger(versionNumber),
    template: toTealSourceTemplate(
      new Uint8Array(await compiledTealBlob.arrayBuffer())
    ),
  };
};
