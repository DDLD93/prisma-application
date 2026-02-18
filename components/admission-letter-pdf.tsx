import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 8 },
  subtitle: { fontSize: 12, marginBottom: 24, color: "#666" },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { width: 140, fontWeight: "bold" },
  value: { flex: 1 },
  message: { marginTop: 24, fontSize: 11, lineHeight: 1.5 },
});

type AdmissionLetterPdfProps = {
  wardName: string;
  sessionYear: number;
  applicationId: string;
  admissionStatus: string;
  schoolName?: string;
  class?: string | null;
};

export function AdmissionLetterPdf({
  wardName,
  sessionYear,
  applicationId,
  admissionStatus,
  schoolName = "School",
  class: className,
}: AdmissionLetterPdfProps) {
  const isOfferedOrAccepted =
    admissionStatus === "OFFERED" || admissionStatus === "ACCEPTED";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{schoolName}</Text>
        <Text style={styles.subtitle}>Admission Letter</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Application ID:</Text>
          <Text style={styles.value}>{applicationId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Session year:</Text>
          <Text style={styles.value}>{sessionYear}</Text>
        </View>
        {className != null && className !== "" && (
          <View style={styles.row}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{className}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Child name:</Text>
          <Text style={styles.value}>{wardName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Admission status:</Text>
          <Text style={styles.value}>{admissionStatus}</Text>
        </View>
        <Text style={styles.message}>
          {isOfferedOrAccepted
            ? `This letter confirms that ${wardName} has been ${admissionStatus === "ACCEPTED" ? "accepted" : "offered a place"} for the ${sessionYear} session. Please retain this letter for your records.`
            : `This letter is regarding the admission status (${admissionStatus}) for ${wardName} for the ${sessionYear} session.`}
        </Text>
      </Page>
    </Document>
  );
}
