"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UtilityForm } from "@/components/ui/UtilityForm";

// Mock function to fetch utility data
const fetchUtility = (id) => {
  const mockUtilities = [
    {
      id: 1,
      name: "Hospital Beds",
      category: "Furniture",
      totalItems: 500,
      availableItems: 50,
      icon: "🛏️",
      items: [
        { id: 1, name: "Standard Hospital Bed", total: 300, available: 30 },
        { id: 2, name: "ICU Bed", total: 100, available: 10 },
        { id: 3, name: "Pediatric Bed", total: 100, available: 10 },
      ],
    },
    // ... other utilities
  ];
  return mockUtilities.find((utility) => utility.id === parseInt(id));
};

export default function UtilityDetail({ params }) {
  const [utility, setUtility] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const utilityData = fetchUtility(params.id);
    setUtility(utilityData);
  }, [params.id]);

  const handleUtilityUpdate = (updatedUtility) => {
    setUtility(updatedUtility);
    setIsEditing(false);
  };

  const handleItemAdd = (newItem) => {
    setUtility((prevUtility) => ({
      ...prevUtility,
      items: [
        ...prevUtility.items,
        { ...newItem, id: prevUtility.items.length + 1 },
      ],
      totalItems: prevUtility.totalItems + newItem.total,
      availableItems: prevUtility.availableItems + newItem.available,
    }));
    setIsAddingItem(false);
  };

  const handleItemUpdate = (updatedItem) => {
    setUtility((prevUtility) => {
      const updatedItems = prevUtility.items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const availableItems = updatedItems.reduce(
        (sum, item) => sum + item.available,
        0,
      );
      return {
        ...prevUtility,
        items: updatedItems,
        totalItems,
        availableItems,
      };
    });
  };

  const handleItemDelete = (itemId) => {
    setUtility((prevUtility) => {
      const updatedItems = prevUtility.items.filter(
        (item) => item.id !== itemId,
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.total,
        0,
      );
      const availableItems = updatedItems.reduce(
        (sum, item) => sum + item.available,
        0,
      );
      return {
        ...prevUtility,
        items: updatedItems,
        totalItems,
        availableItems,
      };
    });
  };

  if (!utility) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Button
        onClick={() => router.push("/admin/utilities")}
        className="mb-4 bg-[#007664]"
      >
        Back to Utilities
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{utility.name}</CardTitle>
              <CardDescription>Category: {utility.category}</CardDescription>
            </div>
            <div className="text-4xl">{utility.icon}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-lg font-semibold">
              {utility.availableItems} / {utility.totalItems}
            </p>
            <p className="text-sm text-muted-foreground">Available / Total</p>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="mb-4 bg-[#007664]">Edit Utility</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Utility</DialogTitle>
                <DialogDescription>
                  Make changes to the utility here.
                </DialogDescription>
              </DialogHeader>
              <UtilityForm
                utility={utility}
                onSubmit={handleUtilityUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </DialogContent>
          </Dialog>
          <h3 className="mb-4 text-xl font-semibold">Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utility.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>{item.available}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleItemUpdate(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleItemDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="mt-4 bg-[#007664]">Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  Enter the details of the new item here.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleItemAdd({
                    name: formData.get("name"),
                    total: parseInt(formData.get("total")),
                    available: parseInt(formData.get("available")),
                  });
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total" className="text-right">
                      Total
                    </Label>
                    <Input
                      id="total"
                      name="total"
                      type="number"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="available" className="text-right">
                      Available
                    </Label>
                    <Input
                      id="available"
                      name="available"
                      type="number"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-[#007664]"
                    onClick={() => setIsAddingItem(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-[#007664]" type="submit">
                    Add Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
