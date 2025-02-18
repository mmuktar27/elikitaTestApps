"use client";
import React, { useState, useEffect } from "react";
import { getCurrentBookingUrlConfig, createBookingUrlConfig, updateBookingUrlConfig } from "../shared/api"
import { Card, CardContent,CardHeader } from "@/components/ui/card";
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
    const [isLoading, setIsLoading] = useState(false);
    const [statusDialog, setStatusDialog] = useState({
      isOpen: false,
      status: null,
      message: "",
    });
    const session = useSession();
  
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
  

    const callStatusdialog = (status,message) => {
      setStatusDialog({
        isOpen: true,
        status: status === "success" ? "success" : "error",
        message:
          message ||
          (status === "success"
            ? "Url added successfully!"
            : "Failed to add Url"),
      });
    };


    const handleSaveURLs = async () => {
      setIsLoading(true);
      try {
        const data = {
          internalBookingUrl: editedUrls.internal,
          externalBookingUrl: editedUrls.external,
          updatedBy: session?.data?.user?.id,
        };
  
        if (configId) {
          await updateBookingUrlConfig(configId, data);
          callStatusdialog('success','Url Updated Successfully')
        } else {
          const newConfig = await createBookingUrlConfig(data);
          setConfigId(newConfig._id);
          callStatusdialog('success','Url Added Successfully')
        }
  
        setUrls(editedUrls);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save booking URLs.");
        callStatusdialog('error','Failed to save booking URLs')

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
        url = `https://${url}`;
      }
      window.open(url, "_blank");
    };
  
    return (
      <div className="max-h-[90vh] overflow-y-auto">
      <Card className="border-none">
        <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#007664] to-[#75C05B] p-6 text-white">
          <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tight">e</span>
              <span className="text-3xl font-bold tracking-wider" style={{ letterSpacing: "0.3em" }}>
                LIKITA
              </span>
            </div>
            <p className="mt-2 text-gray-100 opacity-90">
              Manage and access internal and external booking pages
            </p>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-3/4 rounded-md bg-gray-200"></div>
                <div className="h-10 w-full rounded-md bg-gray-200"></div>
                <div className="h-6 w-3/4 rounded-md bg-gray-200"></div>
                <div className="h-10 w-full rounded-md bg-gray-200"></div>
              </div>
            ) : (
              <>
                {/* Internal Booking URL */}
                <div className="space-y-3">
                  <label className="text-base font-semibold text-[#007664]">Internal Booking URL</label>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <Input
                        value={editedUrls.internal}
                        onChange={(e) => setEditedUrls({ ...editedUrls, internal: e.target.value })}
                        className="flex-1 border-2 border-gray-200 focus:border-[#007664] focus:ring-2 focus:ring-[#007664]/20"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex-1 break-all rounded-lg p-2 text-sm text-gray-700">
                        {urls.internal}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenURL(urls.internal)}
                      className="flex items-center gap-2 border-2 border-[#007664] text-[#007664] transition-colors duration-300 hover:bg-[#007664] hover:text-white"
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </Button>
                  </div>
                </div>
    
                {/* External Booking URL */}
                <div className="space-y-3">
                  <label className="text-base font-semibold text-[#007664]">External Booking URL</label>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <Input
                        value={editedUrls.external}
                        onChange={(e) => setEditedUrls({ ...editedUrls, external: e.target.value })}
                        className="flex-1 border-2 border-gray-200 focus:border-[#007664] focus:ring-2 focus:ring-[#007664]/20"
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="flex-1 break-all rounded-lg p-2 text-sm text-gray-700">
                        {urls.external}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleOpenURL(urls.external)}
                      className="flex items-center gap-2 border-2 border-[#007664] text-[#007664] transition-colors duration-300 hover:bg-[#007664] hover:text-white"
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </Button>
                  </div>
                </div>
    
                {/* Action Buttons */}
                {isEditing ? (
                  <div className="flex gap-3">
                   <Button
  onClick={handleSaveURLs}
  className="flex-1 bg-[#007664] text-white hover:bg-[#006154] disabled:opacity-50"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="size-4 animate-spin" /> Saving...
    </>
  ) : (
    <>
      <Save className="size-4" /> Save
    </>
  )}
</Button>

                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      disabled={isLoading}
                    >
                      <X className="size-4" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#006154] text-white hover:bg-[#004d40]"
                  >
                    <Edit className="size-4" /> Edit URLs
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
    
  };
  
  export default BookingsURLManagement;
  