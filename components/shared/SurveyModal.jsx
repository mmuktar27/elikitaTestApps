'use client';

import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Eye, MessageSquare, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SurveyResponsesModal } from '../shared';
import { createSurvey, deleteSurvey, fetchAllSurveyResponses, getAllSurveys, updateSurvey } from '../shared/api';
const roles = ['staff', 'system admin', 'doctor', 'healthcare admin', 'remote doctor', 'healthcare assistant'];
import { StatusDialog } from "./";

const SurveyModal = () => {
  const [surveys, setSurveys] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    questions: [{ question: '', type: 'rating', options: [''] }],
    frequency: 'monthly',
    active: true,
    surveyFor: 'general' // Default to General
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: null,
    message: "",
  });
  const callStatusDialog = (status, message) => {
    setStatusDialog({
      isOpen: true,
      status: status === "success" ? "success" : "error",
      message:
        message ||
        (status === "success"
          ? "Action completed successfully"
          : "Action failed"),
    });
  };
  useEffect(() => {
    fetchSurveys();
    fetchSurveyResponses();
  }, []);

const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
const [selectedSurveyForResponses, setSelectedSurveyForResponses] = useState(null);

const handleViewResponses = (survey) => {
  setSelectedSurveyForResponses(survey);
  setIsResponseModalOpen(true);
};
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  // Filter surveys based on search term
  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.surveyFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.questions.some(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyResponse, setSurveyResponse] = useState(null);

  
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredSurveys.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredSurveys.length / recordsPerPage);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const fetchSurveys = async () => {
    try {
      const data = await getAllSurveys();
      setSurveys(data);
    } catch (error) {
      console.error('Failed to fetch surveys');
    }
  };

  const fetchSurveyResponses = async () => {
    try {
      const data = await fetchAllSurveyResponses();
      setSurveyResponse(data);
    } catch (error) {
      console.error('Failed to fetch surveys');
    }
  };
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateSurvey(editingId, formData);
        callStatusDialog('success','Survey Updated Successfully')

      } else {
        await createSurvey(formData);
        callStatusDialog('success','Survey Added Successfully')

      }
      setIsOpen(false);
      fetchSurveys();
      resetForm();
    } catch (error) {
      console.error('Error submitting survey:', error);
      callStatusDialog('error','Error submitting survey')

    }
  };

  const handleEdit = (survey) => {
    setFormData(survey);
    setEditingId(survey._id);
    setIsOpen(true);
  };

  const confirmDelete = (survey) => {
    setSurveyToDelete(survey);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (surveyToDelete) {
      try {
        await deleteSurvey(surveyToDelete._id);
        callStatusDialog('success','Survey Deleted Successfully')
        fetchSurveys();
      } catch (error) {
        console.error('Error deleting survey:', error);
        callStatusDialog('error','Failed to delete survey')

      }
    }
    setIsDeleteModalOpen(false);
    setSurveyToDelete(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      questions: [{ question: '', type: 'rating', options: [''] }],
      frequency: 'monthly',
      active: true,
      surveyFor: 'general'
    });
  };
  
  const handleCreateNew = () => {
    resetForm();
    setIsOpen(true);
  };

 // console.log('surveyResponse')
 // console.log(surveyResponse)

  return (
    <div>
      {/* Survey Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white p-6">
      <h2 className="text-lg font-bold">{editingId ? 'Edit Survey' : 'Create Survey'}</h2>

      <div className="flex-1 overflow-y-auto pr-2">
      <label>Title</label>

        <Input
          placeholder="Survey Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Survey For Selection */}
        <div className="mt-2">
          <label>Survey For</label>
          <Select
            value={formData.surveyFor}
            onValueChange={(value) => setFormData({ ...formData, surveyFor: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Survey For" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <label>Frequency</label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <label>Active</label>
          <Select
            value={formData.active}
            onValueChange={(value) => setFormData({ ...formData, active: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
          
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          <label>Questions</label>
          <div className=" mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 p-2">
            {formData.questions.map((q, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-3 last:border-b-0">
                <Input
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => {
                    const updatedQuestions = [...formData.questions];
                    updatedQuestions[index].question = e.target.value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                />

                <Select
                  value={q.type}
                  onValueChange={(value) => {
                    const updatedQuestions = [...formData.questions];
                    updatedQuestions[index].type = value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                  className="mt-2"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Question Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>

                {q.type === 'multiple-choice' && (
                  <Textarea
                    placeholder="Enter options, comma-separated"
                    value={q.options?.join(', ')}
                    onChange={(e) => {
                      const updatedQuestions = [...formData.questions];
                      updatedQuestions[index].options = e.target.value.split(',').map((o) => o.trim());
                      setFormData({ ...formData, questions: updatedQuestions });
                    }}
                    className="mt-2"
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            className="mt-2"
            onClick={() =>
              setFormData({
                ...formData,
                questions: [...formData.questions, { question: '', type: 'rating', options: [''] }]
              })
            }
          >
            Add Question
          </Button>
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
        <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
        <Button onClick={() => setIsOpen(false)} className="ml-2" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-80 rounded-lg bg-white p-6 text-center">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p className="mt-2">Are you sure you want to delete <strong>{surveyToDelete?.title}</strong>?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Button onClick={handleDelete} variant="destructive">Delete</Button>
              <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Search and New Survey Button */}
      <div className="mb-2 mt-4 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search surveys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleCreateNew}
    className="flex items-center gap-2 rounded bg-[#007664] px-3 py-2 text-white hover:bg-[#007664]/90"
    >
          <Plus className="size-4" />
          New Survey
        </Button>
      </div>

      {/* Surveys Table */}
{/* Main wrapper with explicit width and overflow handling */}
<div style={{ width: '100%', overflowX: 'auto', overflowY: 'visible', display: 'block' }}>
<div style={{ width: '100%', overflowX: 'auto' }}>
  <Table className="mt-4 w-full" style={{ minWidth: '650px' }}>
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Questions</TableHead>
        <TableHead>Frequency</TableHead>
        <TableHead>Active</TableHead>
        <TableHead>Survey For</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {records.map((survey) => (
        <TableRow key={survey._id}>
          <TableCell className='overflow-hidden text-ellipsis'>{survey.title}</TableCell>
          <TableCell className="max-w-xs truncate">
            {survey.questions.slice(0, 2).map((q, i) => (
              <div key={i} className="truncate text-sm">
                {i + 1}. {q.question}
              </div>
            ))}
            {survey.questions.length > 2 && (
              <div className="text-xs text-gray-500">
                +{survey.questions.length - 2} more
              </div>
            )}
          </TableCell>
          <TableCell>{survey.frequency}</TableCell>
          <TableCell>{survey.active ? "Yes" : "No"}</TableCell>
          <TableCell>{survey.surveyFor}</TableCell>
          <TableCell className="flex space-x-2">
  <Button onClick={() => handleEdit(survey)} size="icon" variant="ghost">
    <Pencil className="size-4" />
  </Button>
  <Button onClick={() => confirmDelete(survey)} size="icon" variant="destructive">
    <Trash2 className="size-4" />
  </Button>
  <Button onClick={() => setSelectedSurvey(survey)} size="icon" variant="outline">
    <Eye className="size-4" />
  </Button>
  <Button 
    onClick={() => handleViewResponses(survey)} 
    size="icon" 
    variant="secondary"
    title="View Responses"
  >
    <MessageSquare className="size-4" />
  </Button>
</TableCell>

        </TableRow>
      ))}
    </TableBody>

 
  </Table>
  {records?.length > 0 && (
 <div className="mt-4 flex items-center justify-between gap-4">
 <button
   onClick={() => prevPage()}
   disabled={currentPage === 1}
   className="rounded bg-teal-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
 >
   Previous
 </button>
 <span className="whitespace-nowrap text-gray-700">
   Page {currentPage} of {totalPages}
 </span>
 <button
   onClick={() => nextPage()}
   disabled={currentPage === totalPages}
   className="rounded bg-teal-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
 >
   Next
 </button>
</div>

)}
</div>
  
  {/* Survey View Modal */}
  {selectedSurvey && (
    <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
      <DialogContent className="w-full max-w-lg">
        <CardHeader className="rounded-t-lg bg-teal-700 text-center text-2xl font-bold text-white">
          <div className="w-full text-center">
            <CardTitle className="text-2xl">
              {selectedSurvey.title}
            </CardTitle>
          </div>
        </CardHeader>
        
        <div style={{ height: '24rem', overflowY: 'auto', overflowX: 'auto' }} className="space-y-4 pr-2">
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-2">
              <p><strong>Frequency:</strong> {selectedSurvey.frequency}</p>
              <p><strong>Active:</strong> {selectedSurvey.active ? "Yes" : "No"}</p>
              <p><strong>Created At:</strong> {new Date(selectedSurvey.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedSurvey.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          
          {selectedSurvey.questions.map((q, index) => (
            <div key={index} className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <p className="mb-2 text-lg font-semibold">{index + 1}. {q.question}</p>
              <p className="mb-2 text-sm text-gray-600"><strong>Type:</strong> {q.type}</p>
              {q.options.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-sm font-medium text-gray-700">Options:</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    {q.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )}

{isResponseModalOpen && selectedSurveyForResponses && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-lg">
    <button 
      onClick={() => setIsResponseModalOpen(false)}
      className="absolute right-4 top-4 z-50 rounded-full bg-red-100 p-2 text-red-700"
    >
      <X size={20} />
    </button>
    
    <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white">
      <div className="mb-2 text-center">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Survey Responses </h2>
      </div>
    </DialogHeader>
    
    {/* Main content container with proper overflow handling */}

    
    <div className="flex-1 p-6" style={{ overflowY: 'auto', overflowX: 'auto' }}>
      <div style={{ width: '100%', minWidth: 'fit-content' }}>

  <SurveyResponsesModal
    surveyId={selectedSurveyForResponses._id}
    isOpen={isResponseModalOpen}
    onClose={() => setIsResponseModalOpen(false)}
    surveyDetails={selectedSurveyForResponses}
    surveyResponse={surveyResponse}
  />


</div>
</div>
</div>
</div>

)}
</div>

<StatusDialog
                        isOpen={statusDialog.isOpen}
                        onClose={() => {
                          setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                         
                        }}
                        status={statusDialog.status}
                        message={statusDialog.message}
                      />
</div>
  );
};

export default SurveyModal;