"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UtilityForm } from "@/components/ui/UtilityForm";

const mockUtilities = [
  {
    id: 1,
    name: "Hospital Beds",
    category: "Furniture",
    totalItems: 500,
    availableItems: 50,
    icon: "🛏️",
  },
  {
    id: 2,
    name: "Ambulances",
    category: "Vehicles",
    totalItems: 20,
    availableItems: 5,
    icon: "🚑",
  },
  {
    id: 3,
    name: "MRI Machines",
    category: "Medical Equipment",
    totalItems: 3,
    availableItems: 1,
    icon: "🏥",
  },
  {
    id: 4,
    name: "Pharmacies",
    category: "Facilities",
    totalItems: 5,
    availableItems: 5,
    icon: "💊",
  },
  {
    id: 5,
    name: "Operating Rooms",
    category: "Facilities",
    totalItems: 10,
    availableItems: 2,
    icon: "🩻",
  },
  {
    id: 6,
    name: "Wheelchairs",
    category: "Mobility Aids",
    totalItems: 200,
    availableItems: 75,
    icon: "🦽",
  },
];

export default function UtilitiesManagement() {
  const [utilities, setUtilities] = useState(mockUtilities);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUtilityOpen, setIsAddUtilityOpen] = useState(false);
  const router = useRouter();

  const filteredUtilities = utilities.filter(
    (utility) =>
      utility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addUtility = (utility) => {
    setUtilities([...utilities, { ...utility, id: utilities.length + 1 }]);
    setIsAddUtilityOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-3xl font-bold text-[#007664]">
        Utilities Management
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search utilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddUtilityOpen} onOpenChange={setIsAddUtilityOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007664]">Add Utility</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Utility</DialogTitle>
              <DialogDescription>
                Enter the details of the new utility here.
              </DialogDescription>
            </DialogHeader>
            <UtilityForm
              onSubmit={addUtility}
              onCancel={() => setIsAddUtilityOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUtilities.map((utility) => (
          <Card
            key={utility.id}
            className="cursor-pointer bg-[#75C05B]/10 transition-shadow hover:shadow-lg"
            onClick={() => router.push(`/admin/utilities/${utility.id}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {utility.name}
              </CardTitle>
              <div className="text-4xl">{utility.icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Category: {utility.category}
              </p>
              <p className="text-2xl font-bold">
                {utility.availableItems} / {utility.totalItems}
              </p>
              <p className="text-xs text-muted-foreground">Available / Total</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/utilities/${utility.id}`);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
