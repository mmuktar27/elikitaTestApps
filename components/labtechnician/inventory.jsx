"use client";
import { useState } from 'react';
import Head from 'next/head';

import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    X as CloseIcon,Plus,Minus,
    Edit,
    Eye,
    Filter,Printer,
    Info,
    Loader2,ShoppingCart,ShoppingBag,
    Search,
    Trash2,
    User,
    UserPlus
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
  // UI Components
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function InventoryManagement() {
  // Inventory items state
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 'INV-001',
      name: 'CBC Reagent Kit',
      category: 'Reagent',
      currentStock: 2,
      minRequired: 5,
      expiryDate: 'Aug 15, 2025',
      status: 'Low Stock',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      id: 'INV-005',
      name: 'Glucose Test Strips',
      category: 'Consumable',
      currentStock: 10,
      minRequired: 50,
      expiryDate: 'Dec 20, 2025',
      status: 'Low Stock',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      id: 'INV-008',
      name: 'Urine Sample Containers',
      category: 'Container',
      currentStock: 15,
      minRequired: 30,
      expiryDate: 'N/A',
      status: 'Low Stock',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      id: 'INV-002',
      name: 'Lipid Panel Kit',
      category: 'Reagent',
      currentStock: 12,
      minRequired: 5,
      expiryDate: 'Sep 30, 2025',
      status: 'In Stock',
      statusClass: 'bg-green-100 text-green-800'
    },
    {
      id: 'INV-003',
      name: 'Vacutainer Tubes',
      category: 'Container',
      currentStock: 120,
      minRequired: 50,
      expiryDate: 'N/A',
      status: 'In Stock',
      statusClass: 'bg-green-100 text-green-800'
    }
  ]);

  const [activeTab, setActiveTab] = useState("inventory");

  // Order management state
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form states
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    pricePerUnit: '',
    supplier: '',
    expectedDelivery: ''
  });
  
  const [receiveForm, setReceiveForm] = useState({
    receivedQuantity: '',
    actualPrice: '',
    notes: ''
  });

  // Search and new item state
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    currentStock: '',
    minRequired: '',
    expiryDate: ''
  });

  // Handle order button click
  const handleOrderClick = (item) => {
    setSelectedItem(item);
    
    // Check if an order already exists for this item
    const existingOrder = orders.find(order => order.itemId === item.id && order.status !== 'Received');
    
    if (existingOrder) {
      setCurrentOrder(existingOrder);
      setOrderForm({
        quantity: existingOrder.quantity,
        pricePerUnit: existingOrder.pricePerUnit,
        supplier: existingOrder.supplier,
        expectedDelivery: existingOrder.expectedDelivery
      });
    } else {
      setCurrentOrder(null);
      setOrderForm({
        quantity: Math.max(item.minRequired - item.currentStock, 1),
        pricePerUnit: '',
        supplier: '',
        expectedDelivery: ''
      });
    }
    
    setShowOrderModal(true);
  };

  // Submit order
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    const newOrder = {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Ordered',
      ...orderForm,
      totalCost: parseFloat(orderForm.quantity) * parseFloat(orderForm.pricePerUnit)
    };
    
    if (currentOrder) {
      // Update existing order
      setOrders(orders.map(order => 
        order.orderId === currentOrder.orderId ? newOrder : order
      ));
    } else {
      // Add new order
      setOrders([...orders, newOrder]);
    }
    
    setShowOrderModal(false);
  };

  // Handle receive button click
  const handleReceiveClick = (order) => {
    setCurrentOrder(order);
    setReceiveForm({
      receivedQuantity: order.quantity,
      actualPrice: order.pricePerUnit,
      notes: ''
    });
    setShowReceiveModal(true);
  };

  // Submit received order
  const handleSubmitReceived = (e) => {
    e.preventDefault();
    
    // Update order status
    const updatedOrders = orders.map(order => 
      order.orderId === currentOrder.orderId 
        ? { 
            ...order, 
            status: 'Received',
            receivedDate: new Date().toISOString().split('T')[0],
            receivedQuantity: receiveForm.receivedQuantity,
            actualPrice: receiveForm.actualPrice,
            notes: receiveForm.notes
          } 
        : order
    );
    
    // Update inventory stock
    const updatedItems = inventoryItems.map(item => {
      if (item.id === currentOrder.itemId) {
        const newStock = item.currentStock + parseInt(receiveForm.receivedQuantity);
        return {
          ...item,
          currentStock: newStock,
          status: newStock <= item.minRequired ? 'Low Stock' : 'In Stock',
          statusClass: newStock <= item.minRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        };
      }
      return item;
    });
    
    setOrders(updatedOrders);
    setInventoryItems(updatedItems);
    setShowReceiveModal(false);
  };

  // Print order
  const handlePrintOrder = (order) => {
    const printContent = `
      <h1>Order Receipt</h1>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Item:</strong> ${order.itemName}</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Price per Unit:</strong> $${order.pricePerUnit}</p>
      <p><strong>Total Cost:</strong> $${order.totalCost.toFixed(2)}</p>
      <p><strong>Supplier:</strong> ${order.supplier}</p>
      <p><strong>Order Date:</strong> ${order.date}</p>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // ... (keep all your existing functions like handleInputChange, handleAddItem, handleStockUpdate)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category) return;
    
    const item = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newItem.name,
      category: newItem.category,
      currentStock: parseInt(newItem.currentStock) || 0,
      minRequired: parseInt(newItem.minRequired) || 0,
      expiryDate: newItem.expiryDate || 'N/A',
      status: (parseInt(newItem.currentStock) || 0) <= (parseInt(newItem.minRequired) || 0) ? 'Low Stock' : 'In Stock',
      statusClass: (parseInt(newItem.currentStock) || 0) <= (parseInt(newItem.minRequired) || 0) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    };

    setInventoryItems([...inventoryItems, item]);
    setNewItem({
      name: '',
      category: '',
      currentStock: '',
      minRequired: '',
      expiryDate: ''
    });
  };

  const handleStockUpdate = (id, action) => {
    setInventoryItems(inventoryItems.map(item => {
      if (item.id === id) {
        const newStock = action === 'increase' ? item.currentStock + 1 : Math.max(0, item.currentStock - 1);
        return {
          ...item,
          currentStock: newStock,
          status: newStock <= item.minRequired ? 'Low Stock' : 'In Stock',
          statusClass: newStock <= item.minRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        };
      }
      return item;
    }));
  };

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Inventory Management | Laboratory System</title>
      </Head>

      {/* Header remains the same */}

      <main className="container mx-auto px-4 py-6">
        {/* Dashboard stats remain the same */}

        <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#007664]">Inventory Statistics</h2>
      <Button 
        className="bg-[#007664] hover:bg-[#007664]/80 text-white"
        onClick={() => setShowAddItemModal(true)}
      >
        <ShoppingCart className="mr-2 size-4" />
        Orders
      </Button>
    </div>
    
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-500">Total Items</div>
          <div className="text-2xl font-bold">{inventoryItems.length}</div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-500">Low Stock Items</div>
          <div className="text-2xl font-bold text-red-600">
            {inventoryItems.filter(item => item.status === 'Low Stock').length}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-500">Reagents</div>
          <div className="text-2xl font-bold">
            {inventoryItems.filter(item => item.category === 'Reagent').length}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-500">Last Updated</div>
          <div className="text-2xl font-bold">Today</div>
        </CardContent>
      </Card>
    </div>
        <div className="mt-6 flex overflow-x-auto border-b border-gray-200">
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "inventory"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          <button
            className={`mr-2 px-4 py-2 font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-teal-700 text-teal-800"
                : "text-gray-500 hover:text-teal-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        
        </div>

        {/* Orders Section */}


        {/* Inventory Items Table remains the same, just update the Order button */}
        {activeTab === "orders" && (
  <Card className="bg-[#75C05B]/10 mb-6 mt-6 px-4 py-6">
    <CardHeader>
      <h3 className="text-xl font-bold text-[#007664]">Active Orders</h3>
    </CardHeader>
    <CardContent>
      {orders.filter(order => order.status !== 'Received').length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-[#007664] text-white">Order ID</TableHead>
                <TableHead className="bg-[#007664] text-white">Item</TableHead>
                <TableHead className="bg-[#007664] text-white">Quantity</TableHead>
                <TableHead className="bg-[#007664] text-white">Supplier</TableHead>
                <TableHead className="bg-[#007664] text-white">Status</TableHead>
                <TableHead className="bg-[#007664] text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders
                .filter(order => order.status !== 'Received')
                .map(order => (
                  <TableRow key={order.orderId} className="transition-colors duration-200 hover:bg-green-50">
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.itemName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        order.status === 'Ordered' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleReceiveClick(order)}
                        >
                          <Check className="size-4 mr-1" />
                          Receive
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handlePrintOrder(order)}
                        >
                          <Printer className="size-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="size-12 mx-auto mb-2 text-gray-400" />
          <p>No active orders</p>
        </div>
      )}
    </CardContent>
  </Card>
)}
        {/* Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold">
                {currentOrder ? 'Update Order' : 'Place New Order'}
              </h3>
              <form onSubmit={handleSubmitOrder}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Item</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Price per Unit</label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={orderForm.pricePerUnit}
                    onChange={(e) => setOrderForm({...orderForm, pricePerUnit: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={orderForm.supplier}
                    onChange={(e) => setOrderForm({...orderForm, supplier: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Expected Delivery</label>
                  <input
                    type="date"
                    name="expectedDelivery"
                    value={orderForm.expectedDelivery}
                    onChange={(e) => setOrderForm({...orderForm, expectedDelivery: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="rounded-md border px-4 py-2 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#006654]"
                  >
                    {currentOrder ? 'Update Order' : 'Submit Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receive Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold">Receive Order</h3>
              <form onSubmit={handleSubmitReceived}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Order ID</label>
                  <input
                    type="text"
                    value={currentOrder.orderId}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Item</label>
                  <input
                    type="text"
                    value={currentOrder.itemName}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Received Quantity</label>
                  <input
                    type="number"
                    name="receivedQuantity"
                    value={receiveForm.receivedQuantity}
                    onChange={(e) => setReceiveForm({...receiveForm, receivedQuantity: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    min="1"
                    max={currentOrder.quantity}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Actual Price per Unit</label>
                  <input
                    type="number"
                    name="actualPrice"
                    value={receiveForm.actualPrice}
                    onChange={(e) => setReceiveForm({...receiveForm, actualPrice: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={receiveForm.notes}
                    onChange={(e) => setReceiveForm({...receiveForm, notes: e.target.value})}
                    rows="3"
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReceiveModal(false)}
                    className="rounded-md border px-4 py-2 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    Confirm Receipt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
 
        {/* Rest of your existing inventory management UI */}
        {activeTab === "inventory" && (
  <main className="container mx-auto px-4 py-6">
 

    <Card className="bg-[#75C05B]/10 mb-6">
      <CardHeader>
        <div className="flex w-full items-center justify-between gap-4 sm:flex-row">
          <h3 className="text-xl font-bold text-[#007664]">Inventory Items</h3>
          <div className="flex w-full sm:w-auto">
            <div className="relative max-w-64 grow">
              <Search className="absolute left-2 top-2.5 size-4 text-gray-500" />
              <Input
                placeholder="Search inventory..."
                className="w-full bg-white pl-8"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={() => setSearchTerm("")}
                >
                  <CloseIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-[#007664] text-white">Item ID</TableHead>
                <TableHead className="bg-[#007664] text-white">Item Name</TableHead>
                <TableHead className="bg-[#007664] text-white">Category</TableHead>
                <TableHead className="bg-[#007664] text-white">Current Stock</TableHead>
                <TableHead className="bg-[#007664] text-white">Min. Required</TableHead>
                <TableHead className="bg-[#007664] text-white">Expiry Date</TableHead>
                <TableHead className="bg-[#007664] text-white">Status</TableHead>
                <TableHead className="bg-[#007664] text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className={`transition-colors duration-200 hover:bg-green-50 ${
                      item.status === 'Low Stock' ? 'bg-red-50' : ''
                    }`}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline"
                          size="icon"
                          className="size-6 p-0" 
                          onClick={() => handleStockUpdate(item.id, 'decrease')}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span>{item.currentStock}</span>
                        <Button 
                          variant="outline"
                          size="icon"
                          className="size-6 p-0" 
                          onClick={() => handleStockUpdate(item.id, 'increase')}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.minRequired}</TableCell>
                    <TableCell>{item.expiryDate}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="size-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className={`text-white ${
                            orders.some(o => o.itemId === item.id && o.status !== 'Received')
                              ? 'bg-purple-500 hover:bg-purple-600'
                              : 'bg-yellow-500 hover:bg-yellow-600'
                          }`}
                          onClick={() => handleOrderClick(item)}
                        >
                          <ShoppingBag className="size-4 mr-1" />
                          {orders.some(o => o.itemId === item.id && o.status !== 'Received') 
                            ? 'Update Order' 
                            : 'Order'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </main>
)}

{showAddItemModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      {/* Close button */}
      <button
        onClick={() => setShowAddItemModal(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        &times;
      </button>

      <h3 className="mb-4 text-xl font-bold text-gray-800">Add New Inventory Item</h3>
      <form onSubmit={handleAddItem}>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Form fields */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={newItem.name || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={newItem.category || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Category</option>
              <option value="Reagent">Reagent</option>
              <option value="Consumable">Consumable</option>
              <option value="Container">Container</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Stock</label>
            <input
              type="number"
              name="currentStock"
              value={newItem.currentStock || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Minimum Required</label>
            <input
              type="number"
              name="minRequired"
              value={newItem.minRequired || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={newItem.expiryDate || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-[#007664] px-4 py-2 text-white hover:bg-[#006654]"
        >
          Add Item
        </button>
      </form>
    </div>
  </div>
)}

      </main>
    </div>
  );
}