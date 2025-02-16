"use client";
import React, { useState, useEffect } from "react";
import { getCurrentBookingUrlConfig, createBookingUrlConfig, updateBookingUrlConfig } from "../shared/api"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Save, Edit, X ,Loader2 ,Check,AlertCircle} from "lucide-react";
import {useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
  } from "@/components/ui/dialog";

const StatusDialog = ({ isOpen, onClose, status, message }) => {
    const isSuccess = status === "success";
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={`max-w-sm rounded-lg border-2 transition-all duration-200${
            isSuccess
              ? "border-[#75C05B] bg-[#007664]"
              : "border-[#B24531]/50 bg-[#B24531]"
          }`}
        >
          <div className="p-6 text-white">
            <div className="mb-4 flex items-center justify-center">
              {isSuccess ? (
                <div className="rounded-full bg-[#75C05B] p-3">
                  <Check className="size-8 text-white" />
                </div>
              ) : (
                <div className="rounded-full bg-[#B24531]/80 p-3">
                  <AlertCircle className="size-8 text-white" />
                </div>
              )}
            </div>
  
            <h2 className="mb-2 text-center text-2xl font-bold">
              {isSuccess ? "Success!" : "Error"}
            </h2>
  
            <p className="text-center text-white/90">{message}</p>
  
            <button
              onClick={onClose}
              className={`mt-6 w-full rounded-lg px-4 py-2 font-semibold transition-colors duration-200
                ${
                  isSuccess
                    ? "bg-[#75C05B] hover:bg-[#75C05B]/80"
                    : "bg-white/20 hover:bg-white/30"
                }`}
            >
              {isSuccess ? "Continue" : "Try Again"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
const BookingsURLManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [urls, setUrls] = useState({ internal: "", external: "" });
  const [editedUrls, setEditedUrls] = useState(urls);
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState(null);
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
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
              ? "URL added successfully!"
              : "Failed to add URL"),
        });
      };
  const [message, setMessage] = useState("");

  // ✅ Fetch current booking URLs
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const config = await getCurrentBookingUrlConfig();
        if (config) {
          setUrls({ internal: config.internalBookingUrl, external: config.externalBookingUrl });
          setEditedUrls({ internal: config.internalBookingUrl, external: config.externalBookingUrl });
          setConfigId(config._id);
        }
      } catch (error) {
        console.warn("No existing configuration found.");
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  const handleSaveURLs = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      const data = {
        internalBookingUrl: editedUrls.internal,
        externalBookingUrl: editedUrls.external,
        updatedBy: session?.data?.user?.id,
      };

      if (configId) {
        await updateBookingUrlConfig(configId, data);
        setMessage("Booking URLs updated successfully!");
        callStatusDialog('success','Booking URLs updated successfully!')
      } else {
        const newConfig = await createBookingUrlConfig(data);
        setConfigId(newConfig._id);
        setMessage("Booking URLs created successfully!");
        callStatusDialog('success','Booking URLs created successfully!')

      }

      setUrls(editedUrls);
      setIsEditing(false);
    } catch (error) {
      setMessage("Failed to save booking URLs.");
      callStatusDialog('error','Failed to save booking URLs.')

    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUrls(urls);
    setIsEditing(false);
  };

  const handleOpenURL = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`; // Ensure the URL has a protocol
    }
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-[#007664] to-[#75C05B] p-4 md:p-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">e</span>
            <span 
              className="text-2xl font-bold tracking-wider text-white md:text-3xl" 
              style={{ letterSpacing: "0.3em" }}
            >
              LIKITA
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-100 opacity-90 md:text-base">
            Manage and access internal and external booking pages
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="space-y-6 p-4 md:p-6">
            {loading ? (
              // ✅ Skeleton loader instead of "Loading..."
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <>
                {/* Internal URL Section */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#007664] md:text-base">
                    Internal Booking URL
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    {isEditing ? (
                      <Input
                        value={editedUrls.internal}
                        onChange={(e) => setEditedUrls({ ...editedUrls, internal: e.target.value })}
                        className="flex-1 border-2 border-gray-200 text-sm focus:border-[#007664] focus:ring-2 focus:ring-[#007664] focus:ring-opacity-20 md:text-base"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex-1 break-all rounded-lg border-2 border-gray-200 p-2 text-sm text-gray-700 md:p-3 md:text-base">
                        {urls.internal}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenURL(urls.internal)}
                      className="flex items-center gap-2 border-2 border-[#007664] text-sm text-[#007664] transition-colors duration-300 hover:bg-[#007664] hover:text-white sm:min-w-24 md:text-base"
                      disabled={isLoading}
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </Button>
                  </div>
                </div>

                {/* External URL Section */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#007664] md:text-base">
                    External Booking URL
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    {isEditing ? (
                      <Input
                        value={editedUrls.external}
                        onChange={(e) => setEditedUrls({ ...editedUrls, external: e.target.value })}
                        className="flex-1 border-2 border-gray-200 text-sm focus:border-[#007664] focus:ring-2 focus:ring-[#007664] focus:ring-opacity-20 md:text-base"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex-1 break-all rounded-lg border-2 border-gray-200 p-2 text-sm text-gray-700 md:p-3 md:text-base">
                        {urls.external}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenURL(urls.external)}
                      className="flex items-center gap-2 border-2 border-[#007664] text-sm text-[#007664] transition-colors duration-300 hover:bg-[#007664] hover:text-white sm:min-w-24 md:text-base"
                      disabled={isLoading}
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </Button>
                  </div>
                </div>
                <StatusDialog
                      isOpen={statusDialog.isOpen}
                      onClose={() => {
                        setStatusDialog((prev) => ({ ...prev, isOpen: false }));
                        if (statusDialog.status === "success") {
                          //Refresh();
                        }
                      }}
                      status={statusDialog.status}
                      message={statusDialog.message}
                    />
                {/* Action Buttons */}
                {isEditing ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Button
                      onClick={handleSaveURLs}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#007664] p-3 text-sm text-white shadow-md transition-all duration-300 hover:bg-[#006154] hover:shadow-lg disabled:opacity-50 md:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {configId ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-500 p-3 text-sm text-red-500 shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg disabled:opacity-50 md:text-base"
                      disabled={isLoading}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                    <Button 
                    onClick={() => setIsEditing(true)} 
                    className="w-full bg-[#006154] text-white hover:bg-[#004d40] disabled:bg-gray-400"
                    disabled={isLoading}
                  >
                    <Edit className="size-4" />
                    Edit URLs
                  </Button>
                  
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingsURLManagement;