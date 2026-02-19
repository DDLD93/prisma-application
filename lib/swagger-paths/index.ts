import { sessionPaths } from "./sessions";
import { applicationPaths } from "./applications";
import { admissionPaths } from "./admissions";
import { paymentPaths, analyticsPaths } from "./payments-analytics";

export const openApiPaths = {
  ...sessionPaths,
  ...applicationPaths,
  ...admissionPaths,
  ...paymentPaths,
  ...analyticsPaths,
};
