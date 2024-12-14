import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import generateText from '../gemini';

const SpreadsheetForm = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [formFields, setFormFields] = useState({});
  const [geminiResponse, setGeminiResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleParse = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(parsedData);

      // Assuming the first row is the header
      if (parsedData && parsedData.length > 0) {
        const headers = parsedData[0];
        const initialFormFields = {};
        headers.forEach(header => {
          initialFormFields[header] = '';
        });
        setFormFields(initialFormFields);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prevFields => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formFields);
    // Here you would handle the form submission, e.g., sending the data to a server
    const prompt = `Analyze the following data: ${JSON.stringify(formFields)}`;
    const response = await generateText(prompt);
    setGeminiResponse(response);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
      <button onClick={handleParse} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>Parse Spreadsheet</button>

      {data && data.length > 0 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.keys(formFields).map((header, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <label htmlFor={header} style={{ display: 'block', marginBottom: '5px' }}>{header}</label>
              <input
                type="text"
                id={header}
                name={header}
                value={formFields[header]}
                onChange={handleInputChange}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
              />
            </div>
          ))}
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
        </form>
      )}
      {geminiResponse && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Gemini Response:</h3>
          <p>{geminiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetForm;
