"use client";
import { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Trash2,
  Edit,
  Check,
  X,
  Loader2,
  AlertCircle,
  TestTube2,
  Stethoscope,
  Pill,
  Syringe
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Service categories and icons
const serviceCategories = [
  { value: 'consultation', label: 'Consultation', icon: <Stethoscope className="h-4 w-4" /> },
  { value: 'labtest', label: 'Lab Test', icon: <TestTube2 className="h-4 w-4" /> },
  { value: 'pharmacy', label: 'Pharmacy', icon: <Pill className="h-4 w-4" /> },
  { value: 'procedure', label: 'Procedure', icon: <Syringe className="h-4 w-4" /> },
];

export default function ServicesPricing() {
  // State management
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: ''
  });

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Simulate API call
        const mockServices = [
          { id: 'SVC-001', name: 'General Consultation', category: 'consultation', price: 50.00, description: 'Standard doctor consultation' },
          { id: 'SVC-002', name: 'Blood Test', category: 'labtest', price: 25.00, description: 'Complete blood count' },
          { id: 'SVC-003', name: 'X-Ray', category: 'procedure', price: 80.00, description: 'Single area x-ray imaging' },
          { id: 'SVC-004', name: 'Antibiotics', category: 'pharmacy', price: 15.00, description: 'Common antibiotics prescription' },
        ];
        
        setTimeout(() => {
          setServices(mockServices);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search term and category filter
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: ''
    });
    setCurrentService(null);
    setIsEditing(false);
  };

  // Handle edit service
  const handleEditService = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description
    });
    setIsEditing(true);
    setShowEditDialog(true);
  };

  // Handle add new service
  const handleAddService = () => {
    resetForm();
    setIsEditing(false);
    setShowEditDialog(true);
  };

  // Submit service (add/edit)
  const handleSubmitService = () => {
    // Validate form
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      // Update existing service
      setServices(services.map(svc => 
        svc.id === currentService.id ? { ...svc, ...formData } : svc
      ));
      toast({
        title: "Service Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new service
      const newService = {
        id: `SVC-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
        price: parseFloat(formData.price)
      };
      setServices([...services, newService]);
      toast({
        title: "Service Added",
        description: `${formData.name} has been added successfully`,
      });
    }

    setShowEditDialog(false);
    resetForm();
  };

  // Handle delete service
  const handleDeleteService = () => {
    setServices(services.filter(svc => svc.id !== currentService.id));
    setShowDeleteDialog(false);
    toast({
      title: "Service Deleted",
      description: `${currentService.name} has been removed`,
    });
    resetForm();
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const cat = serviceCategories.find(c => c.value === category);
    return cat ? cat.icon : <Stethoscope className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#007664]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading services</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="border-red-400 text-red-700 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Edit/Add Service Dialog */}
      {showEditDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    {/* Modal Container */}
    <div
      className="relative mx-4 my-6 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className="text-sm opacity-90">
              {isEditing
                ? 'Update the service details below'
                : 'Fill in the details for the new service'}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setShowEditDialog(false);
              resetForm();
            }}
            className="rounded-full p-1 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter service name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (GHS) *</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description (optional)"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setShowEditDialog(false);
            resetForm();
          }}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmitService}
          className="rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm bg-[#007664] hover:bg-[#006654]"
        >
          {isEditing ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </div>
  </div>
)}


      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentService?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteService}
            >
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <Card className="rounded-lg bg-[#75C05B]/10 p-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Services Pricing</h2>
              <p className="text-sm text-gray-600">Manage all medical services and their pricing</p>
            </div>
            <Button 
              className="bg-[#007664] hover:bg-[#007664]/80 text-white mt-4 md:mt-0"
              onClick={handleAddService}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative grow max-w-md">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Search services..." 
                className="w-full bg-white pl-8 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <TestTube2 className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No services available. Add a new service to get started.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#007664] text-white">Service</TableHead>
                    <TableHead className="bg-[#007664] text-white">Category</TableHead>
                    <TableHead className="bg-[#007664] text-white">Price (NGN)</TableHead>
                    <TableHead className="bg-[#007664] text-white">Description</TableHead>
                    <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-green-50">
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getCategoryIcon(service.category)}
                          <span className="ml-2 capitalize">{service.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{service.price.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-600">{service.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-[#007664] text-[#007664] hover:bg-[#007664]/10"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setCurrentService(service);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}