import { useEffect, useRef } from "react";
import { toast } from "react-toastify";


// Recursively search for the first message/type in a nested object
function findFirstError(obj,parentKey = "") {
  if (!obj) return null;

  if (typeof obj === "object") {
    // Direct message/type on this object
    if ("message" in obj || "type" in obj) {
      return {
        key:parentKey,
        message: obj.message ?? null,
        type: obj.type ?? null,
      };
    }

    // Search in nested values (arrays/objects)
     for (const [k, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${k}` : k; // build path
      const found = findFirstError(value, newKey);
      if (found) return found;
    }
  }

  return null;
}

const showError = (errors, lastErrorKeyRef, toast) => {
  if (!errors || Object.keys(errors).length === 0) return;

   const firstKey = Object.keys(errors)[0];
  const found = findFirstError(errors[firstKey], firstKey);

  console.log(found);

  if (found) {
    const { message:msg, type, key } = found

    if (
      lastErrorKeyRef.current?.key !== key ||
      lastErrorKeyRef.current?.type !== type
    ) {
      toast.error(msg);
      lastErrorKeyRef.current = { key, type }; // ✅ remember last shown error key
    }
  }
};

export const useValidationErrorToast = (errors) => {
  const lastErrorKeyRef = useRef(null);

  useEffect(() => {
    // this shows forms errors based on joi validation
    showError(errors, lastErrorKeyRef, toast);
  }, [errors]);
};

