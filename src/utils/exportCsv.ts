/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param columns - Optional array of column definitions { key, label }
 */

interface Column<T> {
  key: keyof T;
  label: string;
}

export function exportToCsv<T extends object>(
  data: T[],
  filename: string,
  columns?: Column<T>[],
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers
  const headers = columns
    ? columns.map((col) => col.label)
    : Object.keys(data[0]);

  const keys = columns
    ? columns.map((col) => col.key)
    : (Object.keys(data[0]) as (keyof T)[]);

  // Build CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      keys
        .map((key) => {
          const value = row[key];
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const stringValue = String(value ?? "");
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(","),
    ),
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default exportToCsv;
