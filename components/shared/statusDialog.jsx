import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Check
} from "lucide-react";

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
  export default StatusDialog;