'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Calendar, Check, Star, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';


const SurveyResponsesModal = ({ surveyId, isOpen, onClose, surveyDetails,surveyResponse }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  // Simulating responses data - in a real app, you'd fetch this based on surveyId
  useEffect(() => {
    if (isOpen && surveyId) {
      // Sample data structure matching what you provided
      const sampleResponses = [
        {
          createdAt: "2025-03-17T09:42:18.132Z",
          responses: [
            { questionId: "q1", question: "How satisfied are you with the working environment?", answer: "Very Satisfied", type: "choice" },
            { questionId: "q2", question: "How would you rate your workload?", answer: "Manageable", type: "choice" },
            { questionId: "q3", question: "What improvements would you suggest?", answer: "Better communication protocols", type: "text" },
            { questionId: "q4", question: "Rate your overall satisfaction", answer: "4", type: "rating", maxRating: 5 },
            { questionId: "q5", question: "Do you feel supported by management?", answer: "Yes", type: "boolean" }
          ],
          satisfactionScore: 60,
          surveyId: "67d7b9ed49824ff9aa760066",
          updatedAt: "2025-03-17T09:42:18.132Z",
          userId: {
            emergencyContact: {},
            _id: '67b06e925ab2bb73fd33ccb5',
            id: '67b06e925ab2bb73fd33ccb5',
            practitionerReference: 'REF-2025-001',
            employeeID: 'EMP-2025-330',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'Nurse'
          },
          _id: "67d7ee7a0cc4b04f4cb7d976"
        }
      ];
      
      // In a real app, you'd filter responses based on surveyId
    const filteredResponses = surveyResponse.filter(response => response.surveyId._id === surveyId);
      
      setResponses(filteredResponses);
      setLoading(false);

      console.log('surveyDetails filtered')
       console.log(surveyResponse)
       console.log(filteredResponses)


    }
  }, [isOpen, surveyDetails, surveyId, surveyResponse]);

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return 'U';
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  const getRatingLabel = (value) => {
    const ratingLabels = {
      1: "Not Satisfied",
      2: "Slightly Satisfied",
      3: "Neutral",
      4: "Satisfied",
      5: "Very Satisfied"
    };
    return ratingLabels[value] || value; // Default to value if not found
  };
  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}  // Convert object values to string if needed

  const renderAnswerValue = (response) => {
    switch (response.type) {
      case 'boolean':
        return response.answer === 'Yes' ? 
          <Check className="size-5 text-green-500" /> : 
          <X className="size-5 text-red-500" />;
      
      case 'rating':
        const rating = parseInt(response.answer);
        const maxRating = response.maxRating || 5;
        
        return (
          <div className="flex gap-1">
            {[...Array(maxRating)].map((_, i) => (
              <Star 
                key={i} 
                className={`size-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">({rating}/{maxRating})</span>
          </div>
        );
      
      case 'choice':
        return <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">{response.answer}</span>;
      
      case 'text':
        return <p className="italic text-gray-700">{response.answer}</p>;
      
      default:
        return <span>{response.answer}</span>;
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl">
      

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p>Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No responses found for this survey.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-teal-50 p-4">
              <div className="flex items-center justify-between">
              
                <div>
                  <h3 className="font-semibold">Response Summary</h3>
                  <p>Response Title: {surveyDetails?.title}</p>
               

                  <p className="text-sm text-gray-600">Total Responses: {responses.length}</p>
                </div>
                <div className="text-right">
                
                  <p className="text-sm text-gray-600">Average Satisfaction: {responses?.reduce((acc, curr) => acc + curr.satisfactionScore, 0) / responses.length}%</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All Responses</TabsTrigger>
                <TabsTrigger value="byQuestion" className="flex-1">By Question</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {responses.map((response, index) => (
                  <Card key={response._id} className="mb-6">
                    <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 pb-2">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-teal-700 text-white">
                          {getInitials(response?.userId)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {response.userId?.firstName} {response.userId?.lastName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {capitalizeFirstLetter(response.userId?.roles[0]) || 'User'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold">
                          {response.satisfactionScore}%
                        </span>
                        <p className="text-xs text-gray-500">Satisfaction</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                      {response.responses.map((questionResponse, qIndex) => {
  // Find the actual question details using questionId
  const questionDetails = responses[0].surveyId.questions.find(
    (q) => q._id === questionResponse.questionId
  );

  return (
    <div key={questionResponse.questionId} className="border-b pb-3 last:border-0">
      <p className="mb-1 font-medium text-gray-700">
        {qIndex + 1}. {questionDetails ? questionDetails.question : "Question not found"}
      </p>
      <div className="ml-5">
        {questionDetails?.type === "rating"
          ? getRatingLabel(questionResponse.answer) // Convert rating number to label
          : renderAnswerValue(questionResponse)}
      </div>
    </div>
  );
})}

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="byQuestion" className="mt-4">
              {responses.length > 0 && responses[0].surveyId.questions.map((questionTemplate, qIndex) => {
  // Find responses related to the current question
  const questionResponses = responses.map((response) => 
    response.responses.find((r) => r.questionId === questionTemplate._id)
  ).filter(Boolean); // Remove undefined responses

  return (
    <Card key={questionTemplate._id} className="mb-6">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg">
          {qIndex + 1}. {questionTemplate.question}
        </CardTitle>
        <p className="text-sm text-gray-500">
          Question Type: {questionTemplate.type.charAt(0).toUpperCase() + questionTemplate.type.slice(1)}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {questionResponses.map((questionResponse) => {
            const userResponse = responses.find((response) => 
              response.responses.some((r) => r.questionId === questionResponse.questionId)
            );

            if (!userResponse) return null;

            return (
              <div key={userResponse._id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-teal-700 text-xs text-white">
                    {getInitials(userResponse.userId)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">
                      {userResponse.userId?.firstName} {userResponse.userId?.lastName}
                      <span className="ml-2 text-xs text-gray-500">
                        ({formatDate(userResponse.createdAt)})
                      </span>
                    </p>
                  </div>
                  <div className="mt-1">
                    {questionTemplate.type === "rating"
                      ? getRatingLabel(questionResponse.answer) // Convert rating number to label
                      : renderAnswerValue(questionResponse)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
})}

              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
};

export default SurveyResponsesModal;