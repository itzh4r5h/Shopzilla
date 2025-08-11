export const showError = (errors,lastErrorKeyRef,toast) => {
  const keyArray = Object.keys(errors);
  if (keyArray.length !== 0) {
    const key = keyArray[0];
    const msg = errors[key].message || errors[key][0].message;
    const type = errors[key].type || errors[key][0].type;

    if (
      lastErrorKeyRef.current?.key !== key ||
      lastErrorKeyRef.current?.type !== type
    ) {
      toast.error(msg);
      lastErrorKeyRef.current = { key, type }; // ✅ remember last shown error key
    }
  }
};
