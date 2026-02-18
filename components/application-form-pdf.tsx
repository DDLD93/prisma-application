import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 8 },
  label: { width: 120, fontWeight: "bold" },
  value: { flex: 1 },
});

type ApplicationFormPdfProps = {
  wardName: string;
  wardDob: string;
  wardGender: string;
  sessionYear: number;
  applicationId: string;
  class?: string | null;
};

export function ApplicationFormPdf({
  wardName,
  wardDob,
  wardGender,
  sessionYear,
  applicationId,
  class: className,
}: ApplicationFormPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>School Enrollment – Application Form</Text>
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
          <Text style={styles.label}>Ward name:</Text>
          <Text style={styles.value}>{wardName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of birth:</Text>
          <Text style={styles.value}>{wardDob}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{wardGender}</Text>
        </View>
      </Page>
    </Document>
  );
}
