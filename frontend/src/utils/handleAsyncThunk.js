export const handleAsyncThunk = (builder, asyncThunk, handlers) => {
  builder
    .addCase(asyncThunk.pending, handlers.pending)
    .addCase(asyncThunk.fulfilled, handlers.fulfilled)
    .addCase(asyncThunk.rejected, handlers.rejected);
};