import { Button } from "@/components/ui/button";
import { DialogFooter, DialogContent ,DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Activity,PlusCircle,Pencil} from "lucide-react"; // Icons from Lucide

 
const emojiOptions = [
  { label: "Hospital Bed", value: "🛏️" },
  { label: "Ambulance", value: "🚑" },
  { label: "MRI Machine", value: "🏥" },
  { label: "Pharmacy", value: "💊" },
  { label: "Operating Room", value: "🩻" },
  { label: "Wheelchair", value: "🦽" },
];
export function UtilityForm({ utility,onUpdate, onSubmit, onCancel ,buttonText}) {

const session = useSession();
  const [formData, setFormData] = useState(
    utility || {
      name: "",
      category: "",
      totalItems: 0,
      availableItems: 0,
      icon: "",
      lastServiced: "",
      nextServiceDue: "",
      addedBy: "",
    }
  );

  // Auto-assign `addedBy` if it's missing
  useEffect(() => {
    if (!formData.addedBy && session?.data?.user?.id) {
      setFormData((prev) => ({ ...prev, addedBy: session.data.user.id }));
    }
  }, [session?.data?.user.id, formData?.addedBy]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "totalItems" || name === "availableItems"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (buttonText === "Submit") {
      onSubmit(formData);
    } else if (buttonText === "Update") {
      onUpdate(formData);
    }

  };

  return (
    <>

 <div className="max-h-[90vh] w-full overflow-y-auto bg-[#F7F7F7] sm:max-w-4xl">
  <DialogHeader className="bg-gradient-to-r from-teal-800 to-teal-500 p-6 text-white">
    <div className="flex w-full items-center justify-center gap-3 text-2xl font-bold">
      {buttonText === "Update" ? (
        <>
          <Pencil className="size-6" />
          Update Utility
        </>
      ) : (
        <>
          <PlusCircle className="size-6" />
          Add New Utility
        </>
      )}
    </div>
  </DialogHeader>

  <div className="p-4 sm:p-6">
    <form onSubmit={handleSubmit} className="rounded-lg bg-white">
      <div className="grid gap-5 py-3 md:py-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {/* First column */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="name" className="text-left font-medium text-gray-700 sm:text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="category" className="text-left font-medium text-gray-700 sm:text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="totalItems" className="text-left font-medium text-gray-700 sm:text-right">
                Total Items
              </Label>
              <Input
                id="totalItems"
                name="totalItems"
                type="number"
                value={formData.totalItems}
                onChange={handleChange}
                className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="availableItems" className="text-left font-medium text-gray-700 sm:text-right">
                Available
              </Label>
              <Input
                id="availableItems"
                name="availableItems"
                type="number"
                value={formData.availableItems}
                onChange={handleChange}
                className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
                required
              />
            </div>
          </div>
          
          {/* Second column */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="icon" className="text-left font-medium text-gray-700 sm:text-right">
                Icon
              </Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
                value={formData.icon}
              >
                <SelectTrigger className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3">
                  <SelectValue placeholder="Select emoji" />
                </SelectTrigger>
                <SelectContent className="border-teal-800">
                  {emojiOptions.map((emoji) => (
                    <SelectItem key={emoji.value} value={emoji.label}>
                      {emoji.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
              <Label htmlFor="lastServiced" className="text-left font-medium text-gray-700 sm:text-right">
                Last Service
              </Label>
              <input
                type="date"
                id="lastServiced"
                name="lastServiced"
                value={formData.lastServiced ? formData.lastServiced.split('T')[0] : ''} 
                onChange={handleChange}
                className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
    required
              />
            </div>
            
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-4 sm:items-center sm:gap-3">
  <Label htmlFor="nextServiceDue" className="text-left font-medium text-gray-700 sm:text-right">
    Next Service
  </Label>
  
    <input
      type="date"
      id="nextServiceDue"
      name="nextServiceDue"
      value={formData.nextServiceDue ? formData.nextServiceDue.split('T')[0] : ''} 
      onChange={handleChange}
      className="col-span-1 border-teal-800 focus:border-teal-800 focus:ring-teal-800 sm:col-span-3"
      required
    />

</div>

          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-5 flex flex-row justify-end gap-3 px-4 pb-4 md:mt-6">
  <Button 
    type="button" 
    variant="outline" 
    onClick={onCancel} 
    className="border-teal-800 text-teal-800 hover:bg-teal-50"
  >
    Cancel
  </Button>
  <Button 
    type="submit" 
    className="bg-teal-800 text-white hover:bg-teal-900"
  >
    {buttonText}
  </Button>
</DialogFooter>

    </form>
  </div>
</div>
  </>
  );
}
