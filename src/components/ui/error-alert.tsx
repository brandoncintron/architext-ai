import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ErrorAlert = ({ error }: { error: string }) => {
  return (
    error && (
    <div className="flex justify-center">
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    </div>
    )
  );
};

export default ErrorAlert;
