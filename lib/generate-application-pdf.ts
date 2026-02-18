import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ApplicationFormPdf } from "@/components/application-form-pdf";

type Props = {
  wardName: string;
  wardDob: string;
  wardGender: string;
  sessionYear: number;
  applicationId: string;
  class?: string | null;
};

export async function generateApplicationPdfBuffer(
  props: Props
): Promise<Buffer> {
  const element = React.createElement(ApplicationFormPdf, props);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
