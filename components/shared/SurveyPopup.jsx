"use client";


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {getAllAppointments ,getAllStaff ,getAllUtility ,fetchPatients ,createSurveyResponse } from '../shared/api';

// Custom styled components with dark teal theme
const StyledButton = ({ variant = "default", className = "", ...props }) => {
  const baseClasses = "font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variantClasses = {
    default: "bg-teal-800 text-white hover:bg-teal-700 focus-visible:ring-teal-800",
    outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400",
    ghost: "hover:bg-gray-100 focus-visible:ring-gray-400",
    link: "text-teal-800 underline-offset-4 hover:underline focus-visible:ring-teal-800"
  };
  
  return (
    <Button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      {...props} 
    />
  );
};


const SurveyPopup = ({ survey, userId, onClose, onSubmit }) => {
    const [open, setOpen] = useState(true);
    const [currentState, setCurrentState] = useState('welcome');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const currentQuestion = survey?.questions?.[currentQuestionIndex];
    const progress = survey?.questions ? ((currentQuestionIndex + 1) / survey.questions.length) * 100 : 0;
    
    const handleResponse = (answer) => {
      const newResponses = [...responses];
      newResponses[currentQuestionIndex] = {
        questionId: currentQuestion.id,
        answer: answer
      };
      
      setResponses(newResponses);
      
      if (currentQuestionIndex < survey.questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered
        handleSubmitSurvey();
    }
    };
    
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };
    
    const handleSubmitSurvey = async () => {
        setIsSubmitting(true);
        try {
          if (!survey || !survey.questions || !survey.questions.length || !responses) {
            throw new Error("Survey data is missing.");
          }
      
          // Calculate satisfaction score
          let totalRating = 0;
          let ratingCount = 0;
      
          responses.forEach((response, index) => {
            const questionType = survey.questions[index]?.type; // Ensure index exists
            if (questionType === "rating" && typeof response.answer === "number") {
              totalRating += response.answer;
              ratingCount++;
            }
          });
      
          const satisfactionScore =
            ratingCount > 0 ? Math.round((totalRating / (ratingCount * 5)) * 100) : null;
      
          const responseData = {
            surveyId: survey._id,
            userId: userId,
            responses: responses,
            satisfactionScore: satisfactionScore,
          };
      
          // Submit survey response
          await createSurveyResponse(responseData);
      
          // **Show thank-you message only if submission succeeds**
          setCurrentState("thank-you");
        } catch (error) {
          console.error("Error submitting survey:", error);
          setCurrentState("error");
        } finally {
          setIsSubmitting(false);
        }
      };
      
      
      
    
    const handleRemindLater = () => {
      setCurrentState('remind-later');
      // Store partial responses if needed
      setTimeout(() => handleClose(), 1500);
    };
    
    const handleClose = () => {
      setOpen(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete
    };
  
    const handleStartSurvey = () => {
      setCurrentState('questions');
    };
  
    const renderQuestionByType = () => {
      if (!currentQuestion) return null;
      
      switch (currentQuestion.type) {
        case 'rating':
          return (
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="flex w-full max-w-md items-center justify-between">
                <span className="text-sm text-gray-500">Not satisfied</span>
                <span className="text-sm text-gray-500">Very satisfied</span>
              </div>
              <div className="flex w-full max-w-md items-center justify-between">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <StyledButton
                    key={rating}
                    onClick={() => handleResponse(rating)}
                    variant={responses[currentQuestionIndex]?.answer === rating ? "default" : "outline"}
                    className="size-12 rounded-full"
                  >
                    {rating}
                  </StyledButton>
                ))}
              </div>
            </div>
          );
          
        case 'multiple-choice':
          return (
            <RadioGroup 
              className="space-y-3 py-4"
              value={responses[currentQuestionIndex]?.answer || ''}
              onValueChange={handleResponse}
            >
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx} 
                  className="flex cursor-pointer items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50"
                  onClick={() => handleResponse(option)}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${idx}`} 
                    className="border-teal-800 text-teal-800 focus:ring-teal-800"
                  />
                  <Label htmlFor={`option-${idx}`} className="grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
          
        case 'text':
          return (
            <div className="py-4">
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-32 border-gray-300 focus:border-teal-800 focus:ring-teal-800"
                value={responses[currentQuestionIndex]?.answer || ''}
                onChange={(e) => setResponses([
                  ...responses.slice(0, currentQuestionIndex),
                  { questionId: currentQuestion.id, answer: e.target.value },
                  ...responses.slice(currentQuestionIndex + 1)
                ])}
              />
              <div className="mt-4 flex justify-end">
                <StyledButton 
                  onClick={() => handleResponse(responses[currentQuestionIndex]?.answer || '')} 
                  disabled={!responses[currentQuestionIndex]?.answer}
                >
                  Next
                </StyledButton>
              </div>
            </div>
          );
          
        default:
          return null;
      }
    };
  
    const renderState = () => {
      switch (currentState) {
        case 'welcome':
          return (
            <>
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-teal-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-800">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">{survey?.title}</h2>
                <p className="mb-6 text-gray-600">Your feedback helps us improve. This will only take a minute or two.</p>
                <StyledButton onClick={handleStartSurvey} className="px-8 py-2">
                  Start Survey
                </StyledButton>
              </div>
              <DialogFooter className="border-t pt-4">
                <StyledButton variant="outline" onClick={handleClose} className="w-full">
                  Not Now
                </StyledButton>
              </DialogFooter>
            </>
          );
          
        case 'questions':
          return (
            <>
              <DialogHeader className="border-b pb-4">
                <div className="flex w-full items-center justify-between">
                  <DialogTitle className="text-xl font-semibold text-teal-800">{survey?.title}</DialogTitle>
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X className="size-4" />
                  </Button>
                </div>
                <Progress value={progress} className="mt-4 h-2 bg-gray-200" 
                  indicatorClassName="bg-teal-800" />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Question {currentQuestionIndex + 1} of {survey?.questions?.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </DialogHeader>
  
              <div className="py-4">
                {currentQuestion && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                    {renderQuestionByType()}
                  </div>
                )}
              </div>
  
              <DialogFooter className="flex-col gap-2 border-t pt-4 sm:flex-row">
                {currentQuestionIndex > 0 && (
                  <StyledButton variant="outline" onClick={handlePrevious}>
                    Previous
                  </StyledButton>
                )}
                <StyledButton 
                  variant="outline" 
                  onClick={handleRemindLater}
                  className="sm:ml-auto"
                >
                  Remind Me Later
                </StyledButton>
                {currentQuestion?.type === 'text' ? null : (
                  <StyledButton 
                    onClick={currentQuestion?.type === 'multiple-choice' ? () => handleResponse(responses[currentQuestionIndex]?.answer) : null}
                    disabled={currentQuestion?.type === 'multiple-choice' && !responses[currentQuestionIndex]?.answer}
                  >
                    {currentQuestionIndex < survey?.questions?.length - 1 ? 'Next' : 'Finish'}
                  </StyledButton>
                )}
              </DialogFooter>
            </>
          );
          
          case 'thank-you':
            return (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-800">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Thank You!</h2>
                <p className="mb-6 text-gray-600">Your feedback has been submitted successfully.</p>
                <StyledButton onClick={handleClose} className="px-8 py-2">
                  Close
                </StyledButton>
              </div>
            );
          
  
        case 'remind-later':
          return (
            <div className="py-8 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-800">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">No Problem!</h2>
              <p className="mb-6 text-gray-600">We will remind you to complete this survey later.</p>
            </div>
          );
          
        case 'error':
          return (
            <div className="py-8 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Something Went Wrong</h2>
              <p className="mb-6 text-gray-600">We couldnt submit your responses. Please try again later.</p>
              <StyledButton onClick={handleClose} className="px-8 py-2">
                Close
              </StyledButton>
            </div>
          );
          
        default:
          return null;
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-full overflow-hidden border-t-4 border-t-teal-800 sm:max-w-md">
          {renderState()}
        </DialogContent>
      </Dialog>
    );
  };
  

export default SurveyPopup;