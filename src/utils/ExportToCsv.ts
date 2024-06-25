// Function to trigger csv file download
const ExportToCsv = (convertedData: string, fileName: string) => {
    const csvData = convertedData
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export default ExportToCsv;
