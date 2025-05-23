"use client";
import { createAuditLogEntry } from "@/components/shared/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonCard from "@/components/ui/skeletoncard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateAStaff } from "@/hooks/admin";
import { ROLES } from "@/utils/roles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserPageNav } from "@/components/shared";

const roleSpecificFields = {
  DOCTOR: [
    { name: "specialization", label: "Specialization", type: "text" },
    {
      name: "professionalLicenseNumber",
      label: "License Number",
      type: "text",
    },
    { name: "yearsOfExperience", label: "Years of Experience", type: "number" },
    { name: "certifications", label: "Certifications", type: "array" },
    { name: "assignedPatients", label: "Assigned Patients", type: "array" },
  ],
  NURSE: [
    { name: "unit", label: "Unit", type: "text" },
    {
      name: "shift",
      label: "Shift",
      type: "select",
      options: ["day", "night", "rotational"],
    },
    { name: "specialization", label: "Specialization", type: "text" },
  ],
  ADMIN: [
    { name: "payrollID", label: "Payroll ID", type: "text" },
    { name: "salaryGrade", label: "Salary Grade", type: "text" },
    {
      name: "employmentStatus",
      label: "Employment Status",
      type: "select",
      options: ["active", "terminated"],
    },
  ],
};

export default function StaffDetail({ selectedUser,id,setActiveUserPage }) {
  const [staff, setStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const router = useRouter();
  const session = useSession();
    const [currentUser, setcurrentUser] = useState("");
  
 // const { data, isLoading, isFetched } = useGetAStaff(id);
  //console.log("id", data);

  const { mutate, isSuccess } = useUpdateAStaff(id);
    useEffect(() => {
      setcurrentUser(session?.data?.user?.id)
    }, [session?.data?.user?.id]);
    /*
  useEffect(() => {
    if (data?.data && isFetched) {
      setStaff(data.data[0]);

      const existingCustomFields = Object.keys(data.data)
        .filter(
          (key) =>
            !Object.keys(roleSpecificFields).some((role) =>
              roleSpecificFields[role].some((field) => field.name === key),
            ),
        )
        .map((key) => ({
          name: key,
          label:
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1"),
          type: Array.isArray(data.data[key]) ? "array" : typeof data.data[key],
          value: data.data[key],
        }));
      setCustomFields(existingCustomFields);
    }
  }, [isLoading, data, isFetched]);
*/
useEffect(() => {
  if (selectedUser) {
    setStaff(selectedUser);

    const existingCustomFields = Object.keys(selectedUser)
      .filter(
        (key) =>
          !Object.keys(roleSpecificFields).some((role) =>
            roleSpecificFields[role].some((field) => field.name === key),
          ),
      )
      .map((key) => ({
        name: key,
        label:
          key.charAt(0).toUpperCase() +
          key.slice(1).replace(/([A-Z])/g, " $1"),
        type: Array.isArray(selectedUser[key]) ? "array" : typeof selectedUser[key],
        value: selectedUser[key],
      }));

    setCustomFields(existingCustomFields);
  }
}, [selectedUser]); // Removed data dependencies, only listening to selectedUser

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index, value) => {
    const updatedFields = [...customFields];
    updatedFields[index].value = value;
    setCustomFields(updatedFields);
    setStaff((prev) => ({ ...prev, [updatedFields[index].name]: value }));
  };

  const getRoleSpecificFields = () => {
    if (!staff?.roles) return [];
    return staff.roles.reduce((fields, role) => {
      const roleFields = roleSpecificFields[role] || [];
      return [
        ...fields,
        ...roleFields.filter(
          (field) =>
            !fields.some((existingField) => existingField.name === field.name),
        ),
      ];
    }, []);
  };

  const renderField = (field) => {
    const value = staff[field.name] || "";

    switch (field.type) {
      case "select":
        return (
          <Select
            disabled={!isEditing}
            value={value}
            onValueChange={(value) =>
              handleChange({ target: { name: field.name, value } })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "array":
        return (
          <Input
            value={Array.isArray(value) ? value.join(", ") : value}
            onChange={(e) =>
              handleChange({
                target: {
                  name: field.name,
                  value: e.target.value.split(",").map((item) => item.trim()),
                },
              })
            }
            disabled={!isEditing}
            placeholder={`Enter ${field.label.toLowerCase()} separated by commas`}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) =>
              handleChange({
                target: { name: field.name, value: e.target.value },
              })
            }
            disabled={!isEditing}
          />
        );
    }
  };

  const handleRoleToggle = (role) => {
    setStaff((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating staff:", staff);
  
    try {
      await mutate(staff);
      // Audit log entry
      const auditData = {
        userId: currentUser,
        activityType: "Update",
        entityId: staff.id, // Ensure staff.id exists
        entityModel: "Staff",
        details: `User ${staff.firstName} ${staff.lastName} profile updated successfully`,
      };
  
      try {
        const auditResponse = await createAuditLogEntry(auditData);
        console.log("Audit log response:", auditResponse);
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }
  
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  };
  

  if (!staff) {
    return (
      <div>
      
        <SkeletonCard />;
      </div>
    );
  }


 // console.log('selectedUser')
 // console.log(selectedUser)

  return (
    <div className="container mx-auto py-10">
      <Button
        className="mt-4 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
        onClick={() => setActiveUserPage('users')}
      >
        Back to Staff List
      </Button>
      <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-2">
      <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic staff information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={staff.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={staff.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              {/*   <div className="space-y-2">
                <Label>Languages Spoken</Label>
                <Input
                  name="languagesSpoken"
                  value={staff.languagesSpoken?.join(", ") || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="English, Spanish, etc."
                />
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>Work-related information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeID">Employee ID</Label>
                  <Input
                    id="employeeID"
                    name="employeeID"
                    value={staff.employeeID}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={staff.jobTitle}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {isEditing
                    ? ROLES.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={staff.roles.includes(role)}
                            onCheckedChange={() => handleRoleToggle(role)}
                          />
                          <Label htmlFor={role}>{role.toUpperCase()}</Label>
                        </div>
                      ))
                    : staff.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeType">Employee Type</Label>
                  <Select
                    disabled={!isEditing}
                    value={staff.employeeType}
                    onValueChange={(value) =>
                      handleChange({ target: { name: "employeeType", value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={staff.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact and address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Personal Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={staff.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    value={staff.workEmail}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    value={staff.businessPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone</Label>
                  <Input
                    id="mobilePhone"
                    name="mobilePhone"
                    value={staff.mobilePhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={staff.streetAddress}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={staff.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={staff.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={staff.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={staff.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Role-specific qualifications and certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getRoleSpecificFields().map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button
                className="mt-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                className="mt-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              className="mt-2 rounded bg-[#007664] px-4 py-2 text-white hover:bg-[#007664]/80"
              onClick={() => setIsEditing(true)}
            >
              Edit Staff
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
