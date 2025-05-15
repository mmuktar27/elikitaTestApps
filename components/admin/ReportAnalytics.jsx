"use client";

import {
  DialogHeader
} from "@/components/ui/dialog";
import { useGetEvents } from '@/hooks/publicevents.hook';
import { ClipboardList, Printer, X } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { SurveyModal } from '../shared';
import { createSurveyResponse, fetchAllSurveyResponses, fetchAnalyticsData, fetchHealthWorkerStatistics, fetchPatients, getAllAppointments, getAllStaff, getAllSurveys, getAllUtility, getSystemSettings } from "../shared/api";

 export const PrintButton = () => {
   const handlePrint = () => {
     window.print();
   };
 
   return (
     <button
       onClick={handlePrint}
       className="flex items-center gap-2 rounded-lg border-2 border-gray-500 px-4 py-2 text-gray-700 hover:bg-gray-100"
     >
       <Printer size={20} />
       Print Page
     </button>
   );
 };
 
export const fetchReportData = async (reportType, filters = {}) => {
  try {
    switch (reportType) {
      case "appointments":
        return await getAllAppointments();
      case "systemUsers":
        return await getAllStaff();
      case "utilities":
        return await getAllUtility();
      case "patients":
        return await fetchPatients();
      case "events":
        return await getAllEvents();
      default:
        throw new Error("Invalid report type selected");
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
};

const ReportAnalytics = () => {


  const { data: eventData, isLoading: eventLoading, isError: eventError } = useGetEvents();
  const session = useSession();
  const [reportType, setReportType] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);



  

  const [isOpenSurveyModal, setIsOpenSurveyModal] = useState(false)




  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSurveyRole, setSelectedSurveyRole] = useState('');

  const [appointmentStatus, setAppointmentStatus] = useState('');

  const [fromDate, setFromDate] = useState(false);

  const [toDate, setToDate] = useState(false);
  const [localSettings, setLocalSettings] = useState({});
  const [reportData, setReportData] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false);
  
  const [totalConsult, setTotalConsult] = useState(0);

  const [eventType, setEventType] = useState('');


  const [surveys, setSurveys] = useState([]);
  const [surveyRespond, setSurveyRespond] = useState([]);


  useEffect(() => {
    const loadSurveys = async () => {
      if (!session?.data?.user?.id) return; // Ensure session exists before fetching
  
      try {
        const data = await getAllSurveys();
        const surveyRespons =await fetchAllSurveyResponses();
        setSurveys(data);
        setSurveyRespond(surveyRespons)
      } catch (err) {
        console.log('Failed to fetch surveys');
      }
    };
  
    loadSurveys();
  }, [session?.data?.user?.id]);
  






  const surveyReport = surveys.map(survey => {
    // Convert survey _id to string for comparison
    const surveyIdStr = survey._id.toString();
    
    // Filter responses that match this survey's ID
    const relevantResponses = surveyRespond.filter(resp => {
      const responseSurveyId = resp.surveyId?.toString();
      return responseSurveyId === surveyIdStr;
    });
    
    // Create question mapping for easier lookup
    const questionMap = {};
    survey.questions.forEach(q => {
      questionMap[q._id.toString()] = {
        question: q.question,
        type: q.type,
        options: q.options
      };
    });
    
    // Reorganize the data to group by questions
    const questionResponses = {};
    survey.questions.forEach(q => {
      const questionId = q._id.toString();
      questionResponses[questionId] = {
        question: q.question,
        type: q.type,
        options: q.options,
        answers: []
      };
    });
    
    // Fill in answers for each question
    relevantResponses.forEach(resp => {
      const userId = resp.userId?._id?.toString() ?? "N/A";
      const userName = `${resp.userId?.firstName || ""} ${resp.userId?.lastName || ""}`.trim() || "N/A";
      
      resp.responses.forEach(response => {
        const questionId = response.questionId.toString();
        if (questionResponses[questionId]) {
          questionResponses[questionId].answers.push({
            userId: userId,
            userName: userName,
            answer: response.answer,
            submittedAt: resp.createdAt
          });
        }
      });
    });
    
    return {
      surveyTitle: survey.title,
      surveyFor: survey.surveyFor,
      frequency: survey.frequency,
      totalRespondents: relevantResponses.length,
      submittedAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      questions: Object.values(questionResponses),
      // Include individual respondent data if needed
      respondents: relevantResponses.map(resp => ({
        user: {
          userId: resp.userId?._id?.toString() ?? "N/A",
          lastName: resp.userId?.lastName ?? "N/A",
          firstName: resp.userId?.firstName ?? "N/A"
        },
        satisfactionScore: resp.satisfactionScore ?? "N/A",
        createdAt: resp.createdAt ?? "N/A",
        updatedAt: resp.updatedAt ?? "N/A",
        responses: Array.isArray(resp.responses)
          ? resp.responses.map(response => {
              const questionId = response.questionId.toString();
              return {
                question: questionMap[questionId]?.question ?? "Unknown Question",
                answer: response.answer ?? "N/A",
                type: questionMap[questionId]?.type ?? "Unknown"
              };
            })
          : []
      }))
    };
  });
  
  function processSurveyData(surveys, surveyResponses) {
    // Handle null or undefined inputs
    const validSurveys = Array.isArray(surveys) ? surveys : [];
    const validResponses = Array.isArray(surveyResponses) ? surveyResponses : [];
    
    // Create structured variable for reports
    const surveyReportData = {
      surveys: [],
      metrics: {
        totalSurveys: validSurveys.length,
        activeSurveys: validSurveys.filter(survey => survey && survey.active === true).length,
        totalResponses: validResponses.length,
        averageSatisfaction: 0
      },
      distributions: {
        byFrequency: {},
        byRole: {},
        byScore: {
          low: 0,    // 0-40
          medium: 0, // 41-70
          high: 0    // 71-100
        }
      }
    };
  
    // Calculate average satisfaction
    if (validResponses.length > 0) {
      const totalScore = validResponses.reduce((sum, response) => {
        const score = response && typeof response.satisfactionScore === 'number' ? response.satisfactionScore : 0;
        return sum + score;
      }, 0);
      surveyReportData.metrics.averageSatisfaction = validResponses.length ? Math.round(totalScore / validResponses.length) : 0;
    }
  
    // Process each survey
    validSurveys.forEach(survey => {
      if (!survey) return; // Skip null/undefined surveys
      
      const surveyId = survey._id || '';
      
      // Get responses for this survey
      const relatedResponses = validResponses.filter(response => {
        if (!response || !response.surveyId) return false;
        const responseId = typeof response.surveyId === 'object' ? (response.surveyId._id || '') : response.surveyId;
        return responseId === surveyId;
      });
      
      // Calculate satisfaction score for this survey
      let surveyAvgSatisfaction = 0;
      if (relatedResponses.length > 0) {
        const totalScore = relatedResponses.reduce((sum, response) => {
          const score = response && typeof response.satisfactionScore === 'number' ? response.satisfactionScore : 0;
          return sum + score;
        }, 0);
        surveyAvgSatisfaction = Math.round(totalScore / relatedResponses.length);
      }
      
      // Create survey object with essential info
      const surveyInfo = {
        id: surveyId,
        title: survey.title || 'Untitled Survey',
        surveyFor: survey.surveyFor || 'Unspecified',
        frequency: survey.frequency || 'Unspecified',
        active: Boolean(survey.active),
        responseCount: relatedResponses.length,
        averageSatisfaction: surveyAvgSatisfaction,
        createdAt: survey.createdAt || new Date().toISOString(),
        responses: []
      };
  
      // Process responses for this survey
      relatedResponses.forEach(response => {
        if (!response) return; // Skip null/undefined responses
        
        // Safely extract user information
        const userId = response.userId || {};
        const firstName = userId.firstName || '';
        const lastName = userId.lastName || '';
        const userName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'Unknown';
        const userRole = userId.role || 'Unknown';
        
        // Create response object with essential info
        const responseInfo = {
          id: response._id || '',
          userName: userName,
          userRole: userRole,
          satisfactionScore: typeof response.satisfactionScore === 'number' ? response.satisfactionScore : 0,
          responseDate: response.createdAt || new Date().toISOString(),
          answers: {}
        };
        
        // Process answers
        if (Array.isArray(response.responses) && Array.isArray(survey.questions)) {
          response.responses.forEach(answer => {
            if (!answer) return; // Skip null/undefined answers
            
            const questionId = answer.questionId || '';
            
            // Find the corresponding question
            const question = survey.questions.find(q => q && q._id === questionId);
                
            if (question) {
              responseInfo.answers[question.question || 'Unknown Question'] = 
                answer.answer !== undefined && answer.answer !== null
                  ? answer.answer
                  : 'No answer provided';
            }
          });
        }
        
        surveyInfo.responses.push(responseInfo);
        
        // Update satisfaction score distribution
        const score = typeof response.satisfactionScore === 'number' ? response.satisfactionScore : 0;
        if (score <= 40) {
          surveyReportData.distributions.byScore.low++;
        } else if (score <= 70) {
          surveyReportData.distributions.byScore.medium++;
        } else {
          surveyReportData.distributions.byScore.high++;
        }
        
        // Update role stats
        const role = userRole;
        if (!surveyReportData.distributions.byRole[role]) {
          surveyReportData.distributions.byRole[role] = {
            count: 0,
            totalScore: 0,
            averageSatisfaction: 0
          };
        }
        surveyReportData.distributions.byRole[role].count++;
        surveyReportData.distributions.byRole[role].totalScore += score;
      });
      
      // Add survey to the report data
      surveyReportData.surveys.push(surveyInfo);
      
      // Update frequency stats
      const frequency = survey.frequency || 'Unspecified';
      if (!surveyReportData.distributions.byFrequency[frequency]) {
        surveyReportData.distributions.byFrequency[frequency] = {
          count: 0,
          totalScore: 0,
          averageSatisfaction: 0
        };
      }
      
      // Calculate scores by frequency
      relatedResponses.forEach(response => {
        if (!response) return;
        const score = typeof response.satisfactionScore === 'number' ? response.satisfactionScore : 0;
        surveyReportData.distributions.byFrequency[frequency].count++;
        surveyReportData.distributions.byFrequency[frequency].totalScore += score;
      });
    });
    
    // Calculate averages for role and frequency distributions
    Object.keys(surveyReportData.distributions.byRole).forEach(role => {
      const data = surveyReportData.distributions.byRole[role];
      data.averageSatisfaction = data.count > 0 ? Math.round(data.totalScore / data.count) : 0;
      delete data.totalScore;
    });
    
    Object.keys(surveyReportData.distributions.byFrequency).forEach(frequency => {
      const data = surveyReportData.distributions.byFrequency[frequency];
      data.averageSatisfaction = data.count > 0 ? Math.round(data.totalScore / data.count) : 0;
      delete data.totalScore;
    });
    
    return surveyReportData;
  }
  
  // Example usage:
  // const reportDatas = processSurveyData(surveys, surveyRespond);
  // console.log(reportDatas); 
  
//console.log('surveys')
//console.log(surveys)
//console.log(surveyRespond)

  useEffect(() => {
        const loadSettings = async () => {
          try {
          //  setisLoading(true);
            const settings = await getSystemSettings();
            console.log('Loaded Settings:', settings);
      
            setLocalSettings(settings.data);
           
          } catch (error) {
            console.error('Error loading settings:', error);
          } finally {
          //  setisLoading(false); // Ensures it always runs
          }
        };
      
        loadSettings();
      }, []);

      
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAnalyticsData();
      setAnalyticsData(data.roleBreakdown);
      setTotalConsult(data.totalConsultations)
    };

    loadData();
  }, []);
  const [showReportModal, setShowReportModal] = useState(false);

  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(session?.data?.user)
  }, [session?.data?.user]);


  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchHealthWorkerStatistics();
      setStats(data);
    //  setAnalyticsData({})
    };
    loadStats();
  }, []);

 //console.log(stats)
 const generateReport = () => {
  setShowReportModal(true);
};

const handleGenerateReport = async (reportType) => {
 
 try {
    setLoading(true);

    let data;
    if (reportType === "events") {
      data = eventData; // Use React Query's event data
    } else if (reportType === "surveys") {
      data = surveyReport;
    } else {
      data = await fetchReportData(reportType); // Ensure this is inside an async function
    }
    console.log('reportType Datat')
   // console.log(reportType)
   // console.log(data)
    setReportData(data);
   //console.log('data')
   //console.log(data)

    
  } catch (error) {
    console.error("Failed to generate report:", error);
  } finally {
    setLoading(false);
  }

};
 const printReport = () => {
  let reportLogs = [];
  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Check for null, undefined, or empty value

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Check for invalid date

    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}


  switch (reportType) {
    case "patients":
      reportLogs = reportData.filter(patient => {
        if (!fromDate && !toDate) return true; // No date filtering needed
    
        const patientDate = new Date(patient.createdAt);
        const fromDateValid = fromDate ? new Date(fromDate) : null;
        const toDateValid = toDate ? new Date(toDate) : null;
    
        return (
          (!fromDateValid || patientDate >= fromDateValid) &&
          (!toDateValid || patientDate <= toDateValid)
        );
      });
      break;

      case "systemUsers":
        reportLogs = reportData
          .filter(user => {
            const userDate = new Date(user.createdAt);
            const fromDateValid = fromDate ? new Date(fromDate) : null;
            const toDateValid = toDate ? new Date(toDate) : null;
      
            // Check date range
            const isWithinDateRange =
              (!fromDateValid || userDate >= fromDateValid) &&
              (!toDateValid || userDate <= toDateValid);
      
            // Check role filtering (if "All", show everything)
            const matchesRole =
              selectedRole === "All" || user.roles.includes(selectedRole);
      
            return isWithinDateRange && matchesRole;
          })
          // Ensure only the selected role is displayed for each user
          .map(user => ({
            ...user,
            roles: selectedRole === "All" ? user.roles : [selectedRole], // Keep only the selected role
          }));
        break;
      
        case "surveys":
        //  console.log("Report Data:", reportData); // Debugging log
          
          const surveyReportData = processSurveyData(surveys, surveyRespond);
          
          reportLogs = surveyReportData.surveys
            .filter(survey => {
              console.log("Processing Survey:", survey);
              
              // Filter by role if selected
              const matchesRole = 
                selectedSurveyRole === "all" || 
                (survey.surveyFor.toLowerCase() === selectedSurveyRole.toLowerCase());
              
              return matchesRole;
            })
            .flatMap(survey => {
              // Extract all responses from matching surveys
              return survey.responses.filter(response => {
                if (!response || !response.responseDate) return false;
                
                // Date filtering
                const responseDate = new Date(response.responseDate);
                const fromDateValid = fromDate ? new Date(fromDate) : null;
                const toDateValid = toDate ? new Date(toDate) : null;
                
                const isWithinDateRange =
                  (!fromDateValid || responseDate >= fromDateValid) &&
                  (!toDateValid || responseDate <= toDateValid);
                
                return isWithinDateRange;
              })
              .map(response => {
                //console.log("Filtered Response:", response);
                
                return {
                  surveyTitle: survey.title,
                  surveyFor: survey.surveyFor,
                  frequency: survey.frequency,
                  user: {
                    userId: response.id,
                    userName: response.userName,
                    userRole: response.userRole
                  },
                  satisfactionScore: response.satisfactionScore,
                  createdAt: response.responseDate,
                  updatedAt: response.responseDate, // Using responseDate as updatedAt since it's not available in processed data
                  responses: Object.entries(response.answers).map(([question, answer]) => {
                    return {
                      question: question,
                      answer: answer || "N/A",
                      type: "text" // Default type since it's not available in processed data
                    };
                  })
                };
              });
            });
          
        //  console.log("Final Report Logs:", reportLogs);
          break;
        
      

        case "appointments":
          reportLogs = reportData?.data?.filter(appt => {
            const apptDate = new Date(appt.startDate);
            const fromDateValid = fromDate ? new Date(fromDate) : null;
            const toDateValid = toDate ? new Date(toDate) : null;
        
            // Check if appointment is within the selected date range
            const isWithinDateRange =
              (!fromDateValid || apptDate >= fromDateValid) &&
              (!toDateValid || apptDate <= toDateValid);
        
            // Check if appointment matches the selected status (or return all if "all" is selected)
            const matchesStatus = appointmentStatus === "all" || appt.status === appointmentStatus;
        
            return isWithinDateRange && matchesStatus;
          });
          break;
        

          case "utilities":
            reportLogs = reportData.filter(util => {
              const utilDate = new Date(util.lastServiced);
              const fromDateValid = fromDate ? new Date(fromDate) : null;
              const toDateValid = toDate ? new Date(toDate) : null;
          
              // Check if within date range
              const isWithinDateRange =
                (!fromDateValid || utilDate >= fromDateValid) &&
                (!toDateValid || utilDate <= toDateValid);
          
              return isWithinDateRange;
            });
            break;
          

      case "events":
        reportLogs = reportData?.data?.data?.filter(event => {
          const eventStartDate = new Date(event.start);
          const eventEndDate = new Date(event.end);
          const fromDateValid = fromDate ? new Date(fromDate) : null;
          const toDateValid = toDate ? new Date(toDate) : null;
      
          // Check if event falls within the selected date range
          const isWithinDateRange =
            (!fromDateValid || eventStartDate >= fromDateValid) &&
            (!toDateValid || eventEndDate <= toDateValid);
      
          // Filter by event type
          let matchesEventType = true;
          if (eventType === "past") {
            matchesEventType = eventEndDate < new Date(); // Events that have ended
          } else if (eventType === "upcoming") {
            matchesEventType = eventStartDate >= new Date(); // Events that haven't started yet
          }
      
          return isWithinDateRange && matchesEventType;
        });
        break;
      

    default:
      reportLogs = reportData; // Default to system logs
      break;
  }

  const orgName = localSettings?.organizationName || "e-Likita";

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  
  // Open printable report
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>e-Likita | Report - ${reportType}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #007664; color: white; }
          h1 { color: #007664; text-align: center; }
          .report-info { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${orgName} - ${reportType.toUpperCase()} Report</h1>
        <div class="report-info">
          <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
          <p><strong>Report From:</strong> ${formatDate(fromDate)} To ${formatDate(toDate)}</p>
          <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
           <p><strong>Generated By:</strong> ${user.name ?? 'N/A'}</p>

          <p><strong>Total Records:</strong> ${reportLogs.length}</p>
        </div>
        <table>
          <thead>
            ${generateTableHeader(reportType)}
          </thead>
          <tbody>
            ${generateTableBody(reportType, reportLogs)}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();

  setShowReportModal(false);
  setToDate(null);
  setSelectedRole(null)
  setFromDate(null);
  setSelectedSurveyRole(null);
};

// Function to generate table headers dynamically
const generateTableHeader = (type) => {
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  switch (type) {
    case "patients":
      return `<tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Birth Date</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>`;
    case "systemUsers":
      return `<tr>
               
                <th>Name</th>
                <th>Email</th>
                 <th>Phone</th>
                <th>Roles</th>
                <th>Job Title</th>
              </tr>`;

              case "surveys":
                return `<tr>
                          <th>Survey Title</th>
                          <th>Survey For</th>
                          <th>Frequency</th>
                          <th>User Name</th>
                          <th>Satisfaction Score</th>
                          <th>Response Date</th>
                          <th>Responses</th>
                        </tr>`;
              
    case "appointments":
      return `<tr>
               
                <th>Patient</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Type</th>
              </tr>`;
    case "utilities":
      return `<tr>
                <th>Total Item</th>
                <th>Name</th>

                <th>Category</th>
                <th>Available Items</th>
                <th>Last Serviced</th>
              </tr>`;
    case "events":
      return `<tr>
           
                <th>Title</th>
                <th>Start</th>
                <th>End</th>
                <th>Host</th>
              </tr>`;
    default:
      return `<tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>`;
  }
};

// Function to generate table body dynamically
const generateTableBody = (type, logs) => {
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"; // Handle undefined/null values
  
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "N/A"; // Handle invalid dates
  
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Ensure AM/PM format
    });
  };

  return logs.map(log => {
    switch (type) {
      case "patients":
        return `<tr>
               <td>${log.patientReference ?? "N/A"}</td>
<td>${log.firstName ?? "N/A"} ${log.lastName ?? "N/A"}</td>
<td>${log.gender ?? "N/A"}</td>
<td>${formatDate(log.birthDate) ?? "N/A"}</td>
<td>${log.phone ?? "N/A"}</td>
<td>${log.status ?? "N/A"}</td>
                </tr>`;
      case "systemUsers":
        return `<tr>
               
                 <td>${log.firstName ?? "N/A"} ${log.lastName ?? "N/A"}</td>
<td>${log.email ?? "N/A"}</td>
<td>${log.mobilePhone ?? "N/A"}</td>
<td>${Array.isArray(log.roles) && log.roles.length > 0 ? log.roles.join(", ") : "N/A"}</td>
<td>${log.jobTitle ?? "N/A"}</td>

                </tr>`;



                case "surveys":
  return `<tr>
            <td>${log.surveyTitle}</td>
            <td>${log.surveyFor}</td>
            <td>${log.frequency}</td>
            <td>${log.user.userName || "N/A"}</td>
            <td>${log.satisfactionScore}</td>
            <td>${new Date(log.createdAt).toLocaleDateString()}</td>
            <td>${
              Array.isArray(log.responses) && log.responses.length > 0
                ? log.responses
                    .map(
                      (response) => {
                        let formattedAnswer = response.answer;
                        
                        // Convert numeric ratings to text descriptions
                        if (!isNaN(response.answer) && response.answer >= 1 && response.answer <= 5) {
                          const ratingText = {
                            '1': 'Not satisfied',
                            '2': 'Slightly satisfied',
                            '3': 'Moderately satisfied',
                            '4': 'Satisfied',
                            '5': 'Very satisfied'
                          };
                          formattedAnswer = `${response.answer} - ${ratingText[response.answer]}`;
                        }
                        
                        return `<strong>Q:</strong> ${response.question} 
                                <br> <strong>A:</strong> ${formattedAnswer}`;
                      }
                    )
                    .join("<br><br>")
                : "No Responses"
            }</td>
          </tr>`;
                
      case "appointments":
        return `<tr>
          
<td>${log.patient.firstName?? "N/A"} ${log.patient.lastName?? "N/A"}</td>
<td>${formatDate(log.startDate) ?? "N/A"}</td>
<td>${log.status ?? "N/A"}</td>
<td>${log.appointmentType ?? "N/A"}</td>

                </tr>`;
      case "utilities":
        return `<tr>
                <td>${log.totalItems ?? "N/A"}</td>
<td>${log.name ?? "N/A"}</td>
<td>${log.category ?? "N/A"}</td>
<td>${log.availableItems ?? "N/A"} / ${log.totalItems ?? "N/A"}</td>
<td>${formatDate(log.lastServiced) ?? "N/A"}</td>
                </tr>`;
      case "events":
        return `<tr>
            
<td>${log.title ?? "N/A"}</td>
<td>${formatDateTime(log.start) ?? "N/A"}</td>
<td>${formatDateTime(log.end) ?? "N/A"}</td>
<td>${log.host ?? "N/A"}</td>
                </tr>`;
      default:
        return `<tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                </tr>`;
    }
  }).join('');
};
const availableRoles = [
  'All',
  "staff",
  "system admin",
  "doctor",
  "healthcare admin",
  "remote doctor",
  "healthcare assistant"
];
const availableSurveyRoles = [
  'All',
  "general",
  "system admin",
  "doctor",
  "healthcare admin",
  "remote doctor",
  "healthcare assistant"
];
const [activeSurvey, setActiveSurvey] = useState(null);
  
useEffect(() => {
  // Fetch active survey or set from props
  const loadSurvey = () => {
    if (!surveys || !Array.isArray(surveys) || surveys.length === 0) {
      console.warn("No surveys available to set as active.");
      return;
    }

    const firstSurvey = surveys[0]; // Get the first survey from the list

    setActiveSurvey({
      _id: firstSurvey._id,
      title: firstSurvey.title,
      questions: firstSurvey.questions?.map((q) => ({
        id: q._id,
        question: q.question,
        type: q.type,
        options: q.options || [],
      })) || [],
    });
  };

  const timeout = setTimeout(loadSurvey, 1000); // Show survey after 1 second

  return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-run
}, [surveys]);


const createSurveyResponses = async (responseData) => {
  try {
    console.log('Creating survey response:', responseData);

    // Ensure createSurveyResponse is defined and used properly
    const result = await createSurveyResponse(responseData);

    return {
      status: 'success',
      message: 'Survey response created successfully',
      data: result, // Include API response if needed
    };
  } catch (error) {
    console.error('Error creating survey response:', error);

    return {
      status: 'error',
      message: 'Failed to create survey response',
      error: error.message, // Provide error details if useful
    };
  }
};

const handleSubmitSurvey = async (responseData) => {
  console.log(responseData)
  /*
  try {
    console.log('Creating survey response:', responseData);

    // Ensure createSurveyResponse is defined and used properly
    const result = await createSurveyResponse(responseData);

    return {
      status: 'success',
      message: 'Survey response created successfully',
      data: result, // Include API response if needed
    };
  } catch (error) {
    console.error('Error creating survey response:', error);

    return {
      status: 'error',
      message: 'Failed to create survey response',
      error: error.message, // Provide error details if useful
    };
  }
  */
};


//console.log(stats)
//console.log(analyticsData)
function convertMinutesToHours(minutes) {
  if (minutes == null || isNaN(minutes) || minutes < 0) return "N/A";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = (minutes % 60).toFixed(2); // Keeps decimal precision

  return hours > 0 
    ? `${hours}h ${remainingMinutes}` 
    : `${remainingMinutes}`;
}


  return (
    <div className="space-y-4">
<h2 className="text-2xl font-bold text-teal-800">Report/Analytics</h2>
<div className="flex justify-end space-x-1 md:space-x-2">
  <button 
    onClick={generateReport} 
    className="flex items-center gap-1 rounded bg-[#007664] px-2 py-1 text-sm text-white hover:bg-[#007664]/90 md:px-3 md:py-2 md:text-base"
  >
    <Printer size={16} />
    Generate Report
  </button>
  <button 
    className="flex items-center gap-1 rounded bg-[#007664] px-2 py-1 text-sm text-white hover:bg-[#007664]/90 md:px-3 md:py-2 md:text-base"
    onClick={() => setIsOpenSurveyModal(true)}
  >  
    <ClipboardList className="size-4 md:size-5" />
    Manage Surveys
  </button>
<PrintButton />
 
</div>

      <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex gap-2">
         
        </div>
        <h3 className="mb-4 text-xl font-semibold">
          Telehealth Usage Analysis
        </h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="consultations"
                stroke="#8884d8"
                name="Consultations"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgResponseTime"
                stroke="#82ca9d"
                name="Avg Response Time (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Healthworker Statistics */}
      <div className="rounded-lg bg-[#75C05B]/10 p-4">
        <h3 className="mb-4 text-xl font-semibold">Healthworker Statistics</h3>
        <p>Total Active Healthworkers: {stats ? stats.totalActiveHealthWorkers : "Loading..."}</p>
        <p>Total Consultations: {stats ? stats.totalConsultations : "Loading..."}</p>
        <p>Average Consultation Duration:{" "}
  {stats?.avgConsultationDuration != null
    ? convertMinutesToHours(stats.avgConsultationDuration) + " minutes"
    : "Loading..."}

          
         </p>
      </div>

      {/* Performance Metrics */}
      <div className="rounded-lg bg-[#007664]/10 p-4">
        <h3 className="mb-4 text-xl font-semibold">Performance Metrics</h3>
        <p>
  Total Average Response Time:{" "}
  {stats?.avgResponseTime != null
    ? convertMinutesToHours(stats.avgResponseTime) + " minutes"
    : "Loading..."}
</p>
       <p>Health Worker Satisfaction Rate: {stats ? stats.healthWorkerSatisfactionRate + "%" : "Loading..."}</p>
        <p>Consultation Completion Rate: {stats ? stats.consultationCompletionRate + "%" : "Loading..."}</p>
      </div>
    </div>

    {isOpenSurveyModal && (
  <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-lg">
        <button 
          onClick={() => setIsOpenSurveyModal(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
        >
          <X size={20} />
        </button>
        
        <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Health Worker Satisfaction Survey</h2>
          </div>
        </DialogHeader>
        
        {/* Main content container with proper overflow handling */}
        <div className="flex-1 p-6" style={{ overflowY: 'auto', overflowX: 'auto' }}>
          <div style={{ width: '100%', minWidth: 'fit-content' }}>
            <SurveyModal />
          </div>
        </div>
      </div>
    </div>
  </>
)}



    {showReportModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Generate Report</h3>
      
      {/* Report Type Selection */}
      <div className="mb-4">
        <label className="mb-2 block font-medium">Select Report Type:</label>
        <select
          //value={reportType}
          onChange={(e) => {
            setReportType(e.target.value);
            handleGenerateReport(e.target.value); // Fetch data when user selects a type
          }}
          className="w-full rounded border border-gray-300 p-2"
        >
          <option >Select Reports</option>
          <option value="patients">Patients</option>
          <option value="systemUsers">System Users</option>
          <option value="appointments">Appointments</option>
          <option value="events">Events</option>
          <option value="utilities">Utilities</option>
          <option value="surveys">Surveys</option>
        </select>
      </div>

      {/* Additional Filters Based on Report Type */}
      {reportType === "systemUsers" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select User Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          >
            {availableRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      )}


{reportType === "surveys" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select Survey For:</label>
          <select
            value={selectedSurveyRole}
            onChange={(e) => setSelectedSurveyRole(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          >
            {availableSurveyRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      )}

      {reportType === "appointments" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select Appointment Status:</label>
          <select
            //value={appointmentStatus}
            onChange={(e) => setAppointmentStatus(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      )}

      {reportType === "events" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select Event Type:</label>
          <select
           // value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      )}

      {/* Date Range Filter (if not showing "all" reports) */}
      {reportType !== "all" && (
        <div className="mb-4">
          <label className="mb-2 block font-medium">Select Date Range:</label>
          <div className="flex gap-2">
            <input
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
              className="w-1/2 rounded border border-gray-300 p-2"
              placeholder="From"
            />
            <input
              type="date"
              onChange={(e) => setToDate(e.target.value)}
              className="w-1/2 rounded border border-gray-300 p-2"
              placeholder="To"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          onClick={() => setShowReportModal(false)} 
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          onClick={printReport } 
          className="flex items-center gap-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/90"
        >
          <Printer size={16} />
          Print Report
        </button>
      </div>
    </div>
  </div>
)}

{/* 
{activeSurvey?.questions?.length > 0 && (
  <SurveyPopup 
    survey={activeSurvey}
    userId={user?.id}
    onClose={() => setActiveSurvey(null)}
    onSubmit={handleSubmitSurvey}
  />
)}
 */}
    </div>
  );
};

export default ReportAnalytics;
