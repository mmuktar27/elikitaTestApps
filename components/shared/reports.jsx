  // Sample data structure - focused on current visit
  const data = {
    clinic: {
      name: 'E-Likita',
      address: '123 Healthcare Avenue',
      phone: '080 E-LIKITA',
      email: 'info@e-likita.com'
    },
  };
  const colors = {
    primary: '#007664',    // Dark Teal
    secondary: '#75C05B',  // Light Green
    accent: '#B24531',     // Rust Red
    highlight: '#53FDFD',  // Bright Cyan
    background: '#F5F5F5', // Off-White
    white: '#FFFFFF'
  };
  const calculateAge = (birthDate) =>{
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  // Helper function to check if an object has valid data
  const hasValidData = (obj) => {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    if (typeof obj === 'object') {
      return Object.keys(obj).length > 0 && 
             Object.values(obj).some(value => 
               value && 
               (typeof value !== 'object' || hasValidData(value))
             );
    }
    return true;
  };
  
  export const handlePrintReport = ({ 
    setIsModalOpen, diagnoses, medications, labTests, examinations, SelectedPatient,reportType,settings,currentUser,currentDashboard
  }) => {
    
    const printWindow = window.open('', '_blank');
    const birthDate = new Date(SelectedPatient.birthDate).toISOString().split('T')[0];
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";


    const formatSectionName = (name) => name.replace(/([A-Z])/g, ' $1').trim();
    const getVisitDateAndTime = () => {
      const sources = [examinations, diagnoses, labTests, medications];
    
      for (let source of sources) {
        if (Array.isArray(source) && source.length > 0) {
          const createdAt = source[0]?.createdAt; // Pick first available timestamp
          if (createdAt) {
            const date = new Date(createdAt);
            const formattedDate = date.toLocaleDateString(); // Extract date
            const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Extract time
            return { date: formattedDate, time: formattedTime };
          }
        }
      }
    
      return { date: "N/A", time: "N/A" }; // Default if no data is found
    };
    
    const { date, time } = getVisitDateAndTime();
    const isDoctor = currentDashboard?.toLowerCase().includes("doctor"); // Check if "doctor" is in the dashboard name
const userFullName = `${isDoctor ? "Dr. " : ""}${currentUser.firstName} ${currentUser.lastName}`;

const reportGeneratedOn = `Report Generated On ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} By ${userFullName}`;


    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
           <title>
          ${reportType === 'details'
            ? 'Detailed Medical Report - e-Likita'
            : 'Patient Information Report - e-Likita'}
        </title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                background-color: ${colors.background};
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                background-color: ${colors.primary};
                color: white;
                padding: 20px;
                border-radius: 8px;
              }
              .header h1 {
                margin: 0;
                color: ${colors.highlight};
              }
              .header p {
                margin: 5px 0;
                opacity: 0.9;
              }
              .section { 
                margin-bottom: 25px;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .section h2 {
                color: ${colors.primary};
                margin-top: 0;
                padding-bottom: 10px;
                border-bottom: 2px solid ${colors.secondary};
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 15px;
                background: white;
              }
              th { 
                background-color: ${colors.primary}; 
                color: white;
                padding: 12px 8px;
              }
              td { 
                padding: 12px 8px;
                border: 1px solid #ddd;
              }
              tr:nth-child(even) {
                background-color: ${colors.background};
              }
              .footer { 
                margin-top: 50px; 
                text-align: center;
                color: ${colors.primary};
                font-size: 0.9em;
              }
              .visit-header { 
                background-color: ${colors.secondary}; 
                color: white;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .vitals-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 15px;
              }
              .vital-card {
                background: white;
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                border: 1px solid ${colors.highlight};
              }
              .vital-value {
                font-size: 1.2em;
                color: ${colors.primary};
                font-weight: bold;
              }
              .vital-label {
                color: #666;
                font-size: 0.9em;
                margin-top: 5px;
              }
              @media print {
                body {
                  background-color: white;
                }
                .section {
                  box-shadow: none;
                  border: 1px solid #ddd;
                }
                .visit-header {
                  box-shadow: none;
                  border: 1px solid ${colors.secondary};
                }
              }
            </style>
            
          </head>
          <body>
            <div class="header">
              <h1>${data.clinic.name}</h1>
              <p>${settings.data.organizationName}</p>
              <p>Phone: N/A | Email: ${data.clinic.email}</p>
            </div>

         <div class="section"> 
  <h2>Patient Information</h2>
  <table>
    <tr>
      <td><strong>First Name:</strong> ${capitalize(SelectedPatient.firstName)}</td>
      <td><strong>Last Name:</strong> ${capitalize(SelectedPatient.lastName)}</td>
    </tr>
    <tr>
      <td><strong>ID:</strong> ${SelectedPatient.patientReference}</td>
      <td><strong>Gender:</strong> ${capitalize(SelectedPatient.gender)}</td>
    </tr>
    <tr>
      <td><strong>Birth Date:</strong> ${birthDate}</td>
      <td><strong>Age:</strong> ${calculateAge(birthDate)}</td>
    </tr>
    <tr>
      <td><strong>Phone:</strong> ${SelectedPatient.phone}</td>
      <td><strong>Email:</strong> ${SelectedPatient.email}</td>
    </tr>
    <tr>
      <td><strong>Address:</strong> ${SelectedPatient.address}</td>
      <td><strong>Medical Condition:</strong> ${capitalize(SelectedPatient.medicalCondition)}</td>
    </tr>
    <tr>
      <td><strong>Progress:</strong> ${capitalize(SelectedPatient.progress)}</td>
      <td><strong>Status:</strong> ${capitalize(SelectedPatient.status)}</td>
    </tr>
    <tr>
      <td><strong>Emergency Contact:</strong> ${SelectedPatient.emergencyContact}</td>
      <td><strong>Insurance Provider:</strong> ${SelectedPatient.insuranceProvider}</td>
    </tr>
  </table>
</div>


            ${reportType === 'detailed' ? `
            <div className="visit-header">
  <strong>Visit Date:</strong> ${date} |  
  <strong>Time:</strong> ${time} <br>
</div>
${examinations && examinations.length > 0 ? `

             <div class="section"> 
  <h2>Vital Signs</h2>
  <div class="vitals-grid">
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            // Get the latest examination entry
            const latestExam = examinations[examinations.length - 1];

            // Ensure the latest examination has vitals data
            if (!latestExam?.vitals) {
              return "<div>No vital signs recorded</div>";
            }

   const { weight, height, bloodPressure, temperature, pulse } = latestExam.vitals;

            // Calculate BMI (Ensure height is in meters)
            const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(2) : "N/A";

            return `
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.bloodPressure || "N/A"}</div>
                <div class="vital-label">Blood Pressure</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.temperature ?? "N/A"}</div>
                <div class="vital-label">Temperature</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.pulse ?? "N/A"}</div>
                <div class="vital-label">Pulse</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.weight ?? "N/A"}</div>
                <div class="vital-label">Weight</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${latestExam.vitals.height ?? "N/A"}</div>
                <div class="vital-label">Height</div>
              </div>
              <div class="vital-card">
                <div class="vital-value">${bmi ?? "N/A"}</div>
                <div class="vital-label">BMI</div>
              </div>
            `;
          })()
        : "<div>No vital signs recorded</div>"
    }
  </div>
</div>
` : ''}



${examinations && examinations.length > 0 ? `
<div class="section">
  <h2>Chief Complaint</h2>
  <div class="complaints-list">
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            const latestExam = examinations[examinations.length - 1];

            if (!latestExam?.chiefComplain || Object.keys(latestExam.chiefComplain).length === 0) {
              return "<div>No chief complaints recorded</div>";
            }

            const formatName = (name) => {
              return name
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            };

            const nonEmptySections = Object.entries(latestExam.chiefComplain)
              .map(([sectionName, issues]) => {
                const validIssues = Object.entries(issues || {})
                  .filter(([_, details]) => {
                    if (!details) return false;
                    if (Array.isArray(details)) return details.length > 0;
                    if (typeof details === 'object') {
                      return Object.values(details).some(val => 
                        val && 
                        ((Array.isArray(val) && val.length > 0) || 
                         (typeof val === 'object' && Object.keys(val).length > 0) ||
                         val.toString().trim() !== '')
                      );
                    }
                    return details.toString().trim() !== '';
                  })
                  .map(([issueName, details]) => {
                    const formattedIssueName = formatName(issueName);
                    return `<li style="color: #006666; margin: 5px 0; font-size: 15px;">${formattedIssueName}</li>`;
                  })
                  .join('');

                if (!validIssues) return '';
                
                const formattedSectionName = formatName(sectionName);
                return `
                  <div class="complaint-category" style="margin-bottom: 15px;">
                    <strong style="color: #004d4d; font-size: 16px;">${formattedSectionName}:</strong>
                    <ul style="list-style-type: disc; margin-top: 8px; padding-left: 25px;">${validIssues}</ul>
                  </div>
                `;
              })
              .filter(Boolean)
              .join('');

            return nonEmptySections || "<div>No significant complaints recorded</div>";
          })()
        : "<div>No chief complaints recorded</div>"
    }
  </div>
</div>
` : ''}

${examinations && examinations.length > 0 ? `

<div class="section"> 
  <h2>Physical Examination</h2>
  <table>
    ${
      Array.isArray(examinations) && examinations.length > 0
        ? (() => {
            // Get the latest examination entry
            const latestExam = examinations[examinations.length - 1]; 

            // Ensure the latest examination has physical exam data
            if (!latestExam?.physicalExam || Object.keys(latestExam.physicalExam).length === 0) {
              return "<tr><td colspan='2'>No physical exam findings recorded</td></tr>";
            }
         
            return Object.entries(latestExam.physicalExam).map(([examPart, subFindings]) => `
              <tr>
                <td><strong>${examPart}:</strong></td>
                <td>
                  <table>
                    ${Object.entries(subFindings || {}).map(([subCategory, result]) => `
                      <tr>
                        <td><strong>${subCategory}:</strong></td>
                        <td>${result || "Not Examined"}</td>
                      </tr>
                    `).join('')}
                  </table>
                </td>
              </tr>
            `).join('');
          })()
        : "<tr><td colspan='2'>No physical exam findings recorded</td></tr>"
    }
  </table>
</div>
` : ''}


${diagnoses && diagnoses.length > 0 ? `


           <div class="section"> 
  <h2>Diagnosis</h2>
  <table>
    ${diagnoses.length > 0 ? (() => {
      const latestDiagnosis = diagnoses[diagnoses.length - 1]; // Get the most recent diagnosis

      return `
        <tr>
          <th>Diagnosis ID</th>
          <td>${latestDiagnosis.diagnosisId}</td>
        </tr>
        <tr>
        <th>Primary Diagnosis</th>
        <td>${latestDiagnosis.primaryDiagnosis?.category} - ${latestDiagnosis.primaryDiagnosis?.code} (${latestDiagnosis.primaryDiagnosis?.codeDescription})</td>
      </tr>

        <tr>
          <th>Severity</th>
          <td>${capitalize(latestDiagnosis.severity) || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>${capitalize(latestDiagnosis.status)}</td>
        </tr>
        <tr>
          <th>Priority</th>
          <td>${latestDiagnosis.priority}</td>
        </tr>
        <tr>
          <th>Verification Status</th>
          <td>${capitalize(latestDiagnosis.verificationStatus) || 'Pending'}</td>
        </tr>
        <tr>
          <th>Chronicity Status</th>
          <td>${capitalize(latestDiagnosis.chronicityStatus) || 'Not specified'}</td>
        </tr>
        ${latestDiagnosis.additionalDiagnoses.length > 0 ? `
          <tr>
            <th>Additional Diagnoses</th>
            <td>
              <ul>
                ${latestDiagnosis.additionalDiagnoses.map(d => `
                  <li>
                    <strong>Type:</strong> ${d.type} | <strong>Category:</strong> ${d.category} <br>
                    <strong>Code:</strong> ${d.code} (${capitalize(d.codeDescription)}) <br>
                    <strong>Category Description:</strong> ${d.categoryDescription}
                  </li>
                `).join('')}
              </ul>
            </td>
          </tr>
        ` : ''}
        <tr>
          <th>Expected Outcome</th>
          <td>${capitalize(latestDiagnosis.expectedOutcome) || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Other Outcomes</th>
          <td>${capitalize(latestDiagnosis.otherOutcome) || 'None'}</td>
        </tr>
        <tr>
          <th>Timeframe</th>
          <td>${capitalize(latestDiagnosis.timeframe) || 'Not specified'}</td>
        </tr>
        <tr>
          <th>Prognosis Notes</th>
          <td>${capitalize(latestDiagnosis.prognosisAdditionalNotes) || 'None'}</td>
        </tr>
        ${latestDiagnosis.appointmentDate ? `
          <tr>
            <th>Follow-up Appointment</th>
            <td>${latestDiagnosis.appointmentDate} at ${latestDiagnosis.appointmentTime} (${latestDiagnosis.appointmentType})</td>
          </tr>
        ` : ''}
        <tr>
          <th>Additional Notes</th>
          <td>${latestDiagnosis.diagnosesisadditionalNotes || 'None'}</td>
        </tr>
      `;

    })() : `<tr><td colspan="2">No diagnosis recorded</td></tr>`}
  </table>
</div>
` : ''}

${labTests && labTests.length > 0 ? `
             <div class="section"> 
  <h2>Laboratory Tests</h2>
  <table>
    <tr>
       <th>Labtest ID</th>
      <th>Priority</th>
    
      <th>Test Requested</th>
      <th>Additional Notes</th>
    </tr>
    ${labTests?.length > 0 ? (() => {
      const latestlabTests = labTests[labTests?.length - 1]; // Get the most recent entry

function generateTestSelectionsHTML(latestLabTests) {
  if (!latestLabTests || !latestLabTests.testSelections) {
    return "<p>No test selections available.</p>";
  }

  let html = `<div class="row">`;

  latestLabTests.testSelections.forEach((selection, index) => {
    html += `
      <div class="col-md-6">
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-success">${selection.category || "Unknown Category"}</h5>
            <p><strong>Tests:</strong> ${selection.tests.length ? selection.tests.join(", ") : "No tests selected"}</p>
            <p><strong>Other Test:</strong> ${selection.otherTest || "N/A"}</p>
          </div>
        </div>
      </div>`;
  });

  html += `</div>`; // Closing row and container divs
  return html;
}



      return `
        <tr>
          <td>${latestlabTests.labtestID}</td>
          <td>${capitalize(latestlabTests?.priority)}</td>
          <td>${generateTestSelectionsHTML(latestlabTests)}</td>
          <td>${capitalize(latestlabTests?.additionalNotes )|| 'N/A'}</td>
        </tr>
      `;
    })() : `<tr><td colspan="5">No medications recorded</td></tr>`}
  </table>
</div>
` : ''}
${medications && medications.length > 0 ? `
             <div class="section"> 
  <h2>Current Medication</h2>
  <table>
    <tr>
       <th>Medication ID</th>
      <th>Medication</th>
      <th>Dosage</th>
    
      <th>Duration (Days)</th>
      <th>Follow-Up</th>
    </tr>
    ${medications?.length > 0 ? (() => {
      const latestMed = medications[medications?.length - 1]; // Get the most recent entry
      return `
        <tr>
          <td>${latestMed?.medicationId}</td>
          <td>${capitalize(latestMed?.medicationName)}</td>
          <td>${latestMed?.dosage}</td>
          <td>${latestMed?.treatmentDuration}</td>
          <td>${capitalize(latestMed?.followUpProtocol )|| 'N/A'}</td>
        </tr>
      `;
    })() : `<tr><td colspan="5">No medications recorded</td></tr>`}
  </table>
</div>
` : ''}
            ` : ''}

            <div class="footer">
              <p> ${reportGeneratedOn}</p>
                <p>Copyright &copy; e-likita.com</p>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    }
    setIsModalOpen(false);
  };
