import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Eye, Edit, Trash2, Filter, X,Printer,Package ,Layers } from "lucide-react";



export default function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 'DRG-001', name: 'Amoxicillin', batch: 'B20231101', expiry: '2024-11-01', stock: 45, threshold: 10 },
    { id: 'DRG-002', name: 'Paracetamol', batch: 'B20231015', expiry: '2025-01-15', stock: 120, threshold: 50 },
    { id: 'DRG-003', name: 'Ibuprofen', batch: 'B20231020', expiry: '2025-02-20', stock: 85, threshold: 30 },
    { id: 'DRG-004', name: 'Metformin', batch: 'B20231105', expiry: '2024-12-05', stock: 60, threshold: 20 },
    { id: 'DRG-005', name: 'Atorvastatin', batch: 'B20231110', expiry: '2024-11-10', stock: 8, threshold: 15 }
  ]);
    // Orders state
    const [orders, setOrders] = useState([
      { 
        id: 'ORD-001', 
        itemId: 'DRG-005', 
        itemName: 'Atorvastatin', 
        quantity: 50, 
        price: 1200, // Price per unit
        supplier: 'MediCorp', 
        orderDate: '2023-11-15', 
        status: 'Pending', 
        expectedDelivery: '2023-11-22' 
      },
      { 
        id: 'ORD-002', 
        itemId: 'DRG-003', 
        itemName: 'Ibuprofen', 
        quantity: 30, 
        price: 350, // Price per unit
        supplier: 'PharmaPlus', 
        orderDate: '2023-11-10', 
        status: 'Delivered', 
        expectedDelivery: '2023-11-17' 
      }
    ]);
    
  
const itemsPerPage=10;
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printFilter, setPrintFilter] = useState('All'); // All | Pending | Delivered
  
  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    batch: '',
    drugstrength: '',
    type: '',
    expiry: '',
    stock: 0,
    threshold: 0,
    category: '',
    supplier: '',
    price: 0,
    lastOrdered: new Date().toISOString().split('T')[0]
  });
  
  const [showOrderModal, setShowOrderModal] = useState(false);
const [currentItem, setCurrentItem] = useState(null);
const [orderForm, setOrderForm] = useState({
  supplier: '',
  price: 0,
  quantity: 0
});


  const [newOrder, setNewOrder] = useState({
    itemId: '',
    itemName: '',
    quantity: 0,
    supplier: '',
    expectedDelivery: '',
    notes: ''
  });
  const [showBatchOrderDetailsModal, setShowBatchOrderDetailsModal] = useState(false);

  const [orderDetails, setOrderDetails] = useState({});
  
  const handleOrderDetailChange = (itemId, field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: field === 'quantity' || field === 'price' ? Number(value) : value,
      }
    }));
  };
  
  const handleConfirmBatchOrder = () => {
    const newOrders = selectedItems.map(itemId => {
      const item = inventory.find(i => i.id === itemId);
      const details = orderDetails[itemId] || {};
      return {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        itemId: item.id,
        itemName: item.name,
        quantity: details.quantity || item.threshold * 2,
        supplier: details.supplier || item.supplier || 'Default Supplier',
        price: details.price || item.price || 0,
        orderDate: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
      };
    });
  
    setOrders(prev => [...prev, ...newOrders]);
    setSelectedItems([]);
    setOrderDetails({});
    setShowBatchOrderDetailsModal(false);
  };
  
  // Initialize order form when an item is selected for ordering
  const initOrderForm = (item) => {
    setSelectedItem(item);
    setNewOrder({
      itemId: item.id,
      itemName: item.name,
      quantity: item.threshold * 2, // Default to double the threshold
      supplier: item.supplier || '',
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setShowOrderForm(true);
  };

  // Place a new order
  const handlePlaceOrder = () => {
    const orderId = `ORD-${(orders.length + 1).toString().padStart(3, '0')}`;
    const orderToAdd = { 
      ...newOrder, 
      id: orderId,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    setOrders([...orders, orderToAdd]);
    setShowOrderForm(false);
    setNewOrder({
      itemId: '',
      itemName: '',
      quantity: 0,
      supplier: '',
      expectedDelivery: '',
      notes: ''
    });
  };

  // Mark order as received and update inventory
  const markOrderReceived = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Update inventory
    setInventory(inventory.map(item => {
      if (item.id === order.itemId) {
        return {
          ...item,
          stock: item.stock + order.quantity,
          lastOrdered: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    // Update order status
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'Delivered', deliveryDate: new Date().toISOString().split('T')[0] } : o
    ));
  };

  // Print order details
  const printAllOrders = (order) => {
    const totalAmount = order.price * order.quantity;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Details - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #007664; }
            .header { margin-bottom: 20px; }
            .details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Pharmacy Order</h1>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          
          <div class="details">
            <h2>Order Details</h2>
            <table>
              <tr>
                <th>Item</th>
                <td>${order.itemName} (${order.itemId})</td>
              </tr>
              <tr>
                <th>Quantity</th>
                <td>${order.quantity}</td>
              </tr>
              <tr>
                <th>Price per Unit</th>
                <td>₦${order?.price?.toLocaleString()}</td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <td class="total">₦${totalAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <th>Supplier</th>
                <td>${order.supplier}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>${order.status}</td>
              </tr>
              <tr>
                <th>Expected Delivery</th>
                <td>${new Date(order.expectedDelivery).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  

  const [showBatchOrderModal, setShowBatchOrderModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };
  
  const handleBatchOrder = () => {
    const newOrders = selectedItems.map((id, index) => {
      const item = inventory.find(i => i.id === id);
      return {
        id: `ORD-${String(orders.length + index + 1).padStart(3, '0')}`,
        itemId: item.id,
        itemName: item.name,
        quantity: item.threshold * 2,
        supplier: item.supplier || 'Default Supplier',
        price: item.price || 0,
        orderDate: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
      };
    });
  
    setOrders(prev => [...prev, ...newOrders]);
    setShowBatchOrderModal(false);
    setSelectedItems([]);
    setSearchTerm("");
  };
  


  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    status: "success",
    message: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.keys(activeFilters).length === 0 || 
      (Object.entries(activeFilters).every(([key, value]) => {
        if (key === 'lowStock') return item.stock < item.threshold;
        if (key === 'expiringSoon') return isExpiringSoon(item.expiry);
        return true;
      }))
    return matchesSearch && matchesFilters;
  });

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (selectedItem) {
      setSelectedItem(null);
    }
  };

  const handleAddItem = () => {
    const newId = `DRG-${(inventory.length + 1).toString().padStart(3, '0')}`;
    const itemToAdd = { ...newItem, id: newId };
    
    setInventory([...inventory, itemToAdd]);
    setShowAddForm(false);
    setNewItem({
      name: '',
      batch: '',
      expiry: '',
      stock: 0,
      threshold: 0,
      category: '',
      supplier: '',
      price: 0,
      lastOrdered: new Date().toISOString().split('T')[0]
    });
    
    setStatusDialog({
      isOpen: true,
      status: "success",
      message: "Item added successfully!",
    });
  };

  const handleUpdateItem = () => {
    if (!selectedItem) return;
    
    setInventory(inventory.map(item => 
      item.id === selectedItem.id ? selectedItem : item
    ));
    
    setShowEditForm(false);
    setSelectedItem(null);
    
    setStatusDialog({
      isOpen: true,
      status: "success",
      message: "Item updated successfully!",
    });
  };

  const startDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setInventory(inventory.filter(item => item.id !== itemToDelete));
      setIsDeleteOpen(false);
      setItemToDelete(null);
      
      setStatusDialog({
        isOpen: true,
        status: "success",
        message: "Item deleted successfully!",
      });
    }
  };
  const handlePrintFilteredOrders = () => {
    let filtered = orders;
  
    if (printFilter !== 'All') {
      filtered = orders.filter(order => order.status === printFilter);
    }
  
    const grandTotal = filtered.reduce((sum, order) => {
      return sum + (order.price * order.quantity);
    }, 0);
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${printFilter} Orders</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #007664; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-row td { font-weight: bold; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>${printFilter} Orders Report</h1>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.itemName} (${order.itemId})</td>
                  <td>${order.quantity}</td>
                  <td>₦${order.price?.toLocaleString()}</td>
                  <td>₦${(order.price * order.quantity).toLocaleString()}</td>
                  <td>${order.supplier}</td>
                  <td>${order.status}</td>
                  <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4">Grand Total</td>
                <td colspan="4">₦${grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px;">Generated on ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  
    setShowPrintModal(false);
  };
  
  
  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setItemToDelete(null);
  };

  const viewDetails = (item) => {
    setSelectedItem(item);
  };

  const startEdit = (item) => {
    setSelectedItem({...item});
    setShowEditForm(true);
  };
  const handleOrderItem = (item) => {
    setCurrentItem(item);
    setOrderForm({
      supplier: item.supplier || 'Default Supplier',
      price: item.price || 0,
      quantity: item.threshold * 2
    });
    setShowOrderModal(true);
  };

  

  return (
    <div className="space-y-4">
     
     {showAddForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-md h-[450px] rounded-lg bg-white shadow-xl flex flex-col">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-semibold">Add New Inventory Item</h2>
        <button
          onClick={() => setShowAddForm(false)}
          className="hover:bg-white/20 rounded-full p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 flex flex-col space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Item name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">drugstrength</label>
            <Input
              value={newItem.drugstrength}
              onChange={(e) => setNewItem({ ...newItem, drugstrength: e.target.value })}
              placeholder="e.g. 500mg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring-[#007664] text-sm"
            >
              <option value="">Select type</option>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Capsule">Capsule</option>
              <option value="Ointment">Ointment</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch</label>
            <Input
              value={newItem.batch}
              onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
              placeholder="Batch number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <Input
              type="date"
              value={newItem.expiry}
              onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Stock</label>
            <Input
              type="number"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reorder Threshold</label>
            <Input
              type="number"
              value={newItem.threshold}
              onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#007664] hover:bg-[#006654] text-white"
            onClick={handleAddItem}
          >
            Add Item
          </Button>
        </div>
      </div>
    </div>
  </div>
)}



{showEditForm && selectedItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div
      className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <h2 className="text-xl font-bold">Edit Inventory Item</h2>
          </div>
          <button
            onClick={() => setShowEditForm(false)}
            className="text-white hover:bg-white/20 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            value={selectedItem.name}
            onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <Input
              value={selectedItem.batch}
              onChange={(e) => setSelectedItem({ ...selectedItem, batch: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <Input
              type="date"
              value={selectedItem.expiry}
              onChange={(e) => setSelectedItem({ ...selectedItem, expiry: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
            <Input
              type="number"
              value={selectedItem.stock}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, stock: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Threshold</label>
            <Input
              type="number"
              value={selectedItem.threshold}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, threshold: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => setShowEditForm(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#007664] hover:bg-[#006654]"
            onClick={handleUpdateItem}
          >
            Update Item
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

{selectedItem && !showEditForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div
      className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6" />
            <h2 className="text-xl font-bold">Item Details</h2>
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="text-white hover:bg-white/20 rounded-full p-1"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{selectedItem.name}</h3>
          <p className="text-sm text-gray-500">ID: {selectedItem.id}</p>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">drugstrength</p>
            <p className="text-sm text-gray-900">{selectedItem.drugstrength}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-sm text-gray-900">{selectedItem.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Batch Number</p>
            <p className="text-sm text-gray-900">{selectedItem.batch}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Expiry Date</p>
            <p className="text-sm text-gray-900">
              {new Date(selectedItem.expiry).toLocaleDateString()}
              {isExpiringSoon(selectedItem.expiry) && (
                <span className="ml-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                  Expiring Soon
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Stock</p>
            <p className="text-sm text-gray-900">{selectedItem.stock}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Reorder Threshold</p>
            <p className="text-sm text-gray-900">{selectedItem.threshold}</p>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="pt-4">
          <p
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              selectedItem.stock < selectedItem.threshold
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {selectedItem.stock < selectedItem.threshold
              ? 'Low Stock - Reorder Now'
              : 'Stock Level OK'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t pt-6">
          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </button>
          {selectedItem.stock < selectedItem.threshold && (
            <button
              onClick={() => handleOrderItem(selectedItem)}
              className="rounded-md bg-[#007664] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#006654]"
            >
              Order More
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}



      {isLoading ? (
        <>hello...</>
      ) : (


        <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 border border-gray-300 rounded-md">
  <TabsTrigger value="inventory">Inventory</TabsTrigger>
  <TabsTrigger value="orders">Orders</TabsTrigger>
</TabsList>

  
          <TabsContent value="inventory">
        <Card
          className="bg-[#75C05B]/10"
          style={{
            width: isMobile ? "100vw" : "auto",
            margin: "0",
            padding: "0",
          }}
        >
       
          <CardHeader>
            <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            
              <div className="flex w-full items-center gap-2 sm:w-auto">
             
                <div className="relative max-w-64 grow">
                  <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
                  <Input
                    placeholder="Search inventory..."
                    className="w-full bg-white pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="size-4" />
                    </Button>
                  )}


                </div>

                <Button
                  variant="outline"
                  className="whitespace-nowrap shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="mr-2 size-4" />
                  Filter
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
  <Button 
    className="w-full bg-green-700 text-white hover:bg-green-800 sm:w-auto"
    onClick={() => setShowBatchOrderModal(true)}
  >
    Batch Order
  </Button>
  
  <Button
    className="w-full bg-[#007664] hover:bg-[#007664]/80 sm:w-auto flex items-center justify-center"
    onClick={() => setShowAddForm(true)}
  >
    <Plus className="mr-2 size-4" />
    New Item
  </Button>
</div>


            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-[#007664] text-white">ID</TableHead>
                    <TableHead className="bg-[#007664] text-white">Name</TableHead>
                    <TableHead className="bg-[#007664] text-white">Batch</TableHead>
                    <TableHead className="bg-[#007664] text-white">Expiry</TableHead>
                    <TableHead className="bg-[#007664] text-white">Stock</TableHead>
                    <TableHead className="bg-[#007664] text-white">Status</TableHead>
                    <TableHead className="bg-[#007664] text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="transition-colors duration-200 hover:bg-green-50"
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.batch}</TableCell>
                        <TableCell>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(item.expiry))}
                          {isExpiringSoon(item.expiry) && (
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                              Soon
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {item.stock}
                            {item.stock < item.threshold && (
                              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                                Low
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.stock < item.threshold ? (
                            <span className="font-medium text-red-600">Reorder</span>
                          ) : (
                            <span className="font-medium text-green-600">OK</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-600 hover:text-blue-700" 
                              onClick={() => viewDetails(item)}
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#007664] hover:text-[#007664]/80"
                              onClick={() => startEdit(item)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-700 hover:text-red-800"
                              onClick={() => startDelete(item.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                            {item.stock < item.threshold && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-amber-100 text-xs text-amber-800 hover:bg-amber-200"
                                onClick={() => handleOrderItem(item)}
                              >
                                Order
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500"
                      >
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>
                <span className="self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        </TabsContent>

        <TabsContent value="orders">
  <Card className="bg-[#75C05B]/10" style={{ width: isMobile ? "100vw" : "auto", margin: "0", padding: "0" }}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <Button onClick={() => setShowPrintModal(true)} className="mb-4 bg-[#007664] text-white hover:bg-[#006654]">
  Print Orders
</Button>

      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#007664] text-white">Order ID</TableHead>
              <TableHead className="bg-[#007664] text-white">Item</TableHead>
              <TableHead className="bg-[#007664] text-white">Quantity</TableHead>
              <TableHead className="bg-[#007664] text-white">Price</TableHead>
              <TableHead className="bg-[#007664] text-white">Supplier</TableHead>
              <TableHead className="bg-[#007664] text-white">Order Date</TableHead>
              <TableHead className="bg-[#007664] text-white">Status</TableHead>
              <TableHead className="bg-[#007664] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              <>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-green-50">
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.itemName} ({order.itemId})</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>₦{(order?.price)?.toLocaleString()}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700" onClick={() => printOrderDetails(order)}>
                          <Printer className="size-4" />
                        </Button>
                        {order.status === 'Pending' && (
                          <Button variant="outline" size="sm" onClick={() => markOrderReceived(order.id)}>
                            Mark Received
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
               
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</TabsContent>

</Tabs>
{showPrintModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-[#007664]">Print Orders</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Order Type</label>
          <select
            value={printFilter}
            onChange={(e) => setPrintFilter(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-[#007664] focus:ring-[#007664]"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending Orders</option>
            <option value="Delivered">Delivered Orders</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShowPrintModal(false)}>Cancel</Button>
          <Button className="bg-[#007664] hover:bg-[#006654]" onClick={handlePrintFilteredOrders}>
            Print
          </Button>
        </div>
      </div>
    </div>
  </div>
)}


{showOrderModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-md h-[400px] rounded-lg bg-white shadow-xl flex flex-col">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          New Order for {currentItem?.name}
        </h2>
        <button
          onClick={() => setShowOrderModal(false)}
          className="hover:bg-white/20 rounded-full p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-col space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <input
              type="text"
              value={orderForm.supplier}
              onChange={(e) => setOrderForm({ ...orderForm, supplier: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Unit (₦)</label>
            <input
              type="number"
              value={orderForm.price}
              onChange={(e) => setOrderForm({ ...orderForm, price: parseFloat(e.target.value) })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => setShowOrderModal(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#007664] hover:bg-[#006654] text-white"
            onClick={() => {
              const newOrder = {
                id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
                itemId: currentItem.id,
                itemName: currentItem.name,
                quantity: orderForm.quantity,
                supplier: orderForm.supplier,
                price: orderForm.price,
                orderDate: new Date().toISOString(),
                expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Pending',
              };

              setOrders(prev => [...prev, newOrder]);
              setShowOrderModal(false);
            }}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  </div>
)}



{showBatchOrderModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-2xl h-[500px] rounded-lg bg-white shadow-xl flex flex-col">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Batch Order</h2>
        </div>
        <button
          onClick={() => setShowBatchOrderModal(false)}
          className="hover:bg-white/20 rounded-full p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 overflow-hidden">
        <p className="text-sm text-teal-700 mb-3">Select multiple inventory items to order</p>

        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Scrollable checkbox list */}
        <div className="border rounded-md h-60 overflow-y-auto p-2 space-y-2">
          {filteredInventory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items found.</p>
          ) : (
            filteredInventory.map(item => (
              <label
                key={item.id}
                className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                  <span className="text-sm text-gray-800">{item.name}</span>
                </div>
                <span className="text-xs text-gray-400">#{item.id}</span>
              </label>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => setShowBatchOrderModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedItems.length === 0}
            className="bg-[#007664] hover:bg-[#006654]"
            onClick={() => {
              setShowBatchOrderModal(false);
              setShowBatchOrderDetailsModal(true);
            }}
          >
            Order Selected
          </Button>
        </div>
      </div>
    </div>
  </div>
)}



{/* Order Modal */}
{showOrderForm && selectedItem && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
    <div className="mb-4 flex items-start justify-between">
      <h2 className="text-xl font-semibold text-[#007664]">Place New Order</h2>
      <button onClick={() => setShowOrderForm(false)} className="text-gray-500 hover:text-gray-700">
        <X className="size-5" />
      </button>
    </div>
    
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Item</p>
        <p className="text-sm text-gray-900">{selectedItem.name} ({selectedItem.id})</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <Input
            type="number"
            value={newOrder.quantity}
            onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 0})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <Input
            value={newOrder.supplier}
            onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
            placeholder="Supplier name"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
        <Input
          type="date"
          value={newOrder.expectedDelivery}
          onChange={(e) => setNewOrder({...newOrder, expectedDelivery: e.target.value})}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <Input
          value={newOrder.notes}
          onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
          placeholder="Any special instructions"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={() => setShowOrderForm(false)}>
          Cancel
        </Button>
        <Button className="bg-[#007664] hover:bg-[#006654]" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  </div>
</div>
)}
{showBatchOrderDetailsModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="relative w-full max-w-2xl h-[400px] rounded-lg bg-white shadow-xl flex flex-col">
      
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-500 p-4 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Enter Order Details</h2>
        </div>
        <button
          onClick={() => setShowBatchOrderDetailsModal(false)}
          className="hover:bg-white/20 rounded-full p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {selectedItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No items selected.</p>
          )}

          {selectedItems.map(itemId => {
            const item = inventory.find(i => i.id === itemId);
            const details = orderDetails[itemId] || {};

            return (
              <div key={itemId} className="mb-4 border-b pb-4 last:border-none last:pb-0">
                <h3 className="font-medium mb-2">{item.name} <span className="text-xs text-gray-400">#{item.id}</span></h3>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    Quantity:
                    <input
                      type="number"
                      min={1}
                      value={details.quantity || item.threshold * 2}
                      onChange={e => handleOrderDetailChange(itemId, 'quantity', e.target.value)}
                      className="border rounded px-2 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </label>

                  <label className="flex flex-col text-sm font-medium text-gray-700">
                    Price per Unit:
                    <input
                      type="number"
                      min={0}
                      value={details.price || item.price || 0}
                      onChange={e => handleOrderDetailChange(itemId, 'price', e.target.value)}
                      className="border rounded px-2 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </label>

                  <label className="col-span-2 flex flex-col text-sm font-medium text-gray-700">
                    Supplier:
                    <input
                      type="text"
                      value={details.supplier || item.supplier || ''}
                      onChange={e => handleOrderDetailChange(itemId, 'supplier', e.target.value)}
                      className="border rounded px-2 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t pt-4 mt-4">
          <Button variant="outline" onClick={() => setShowBatchOrderDetailsModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedItems.length === 0}
            className="bg-[#007664] hover:bg-[#006654]"
            onClick={handleConfirmBatchOrder}
          >
            Confirm Orders
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

   
     </div>   
)}
     </div>   
  )
}