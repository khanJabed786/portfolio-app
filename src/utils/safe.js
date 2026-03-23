export async function safeAsync(fn, onError) {
  try {
    return await fn();
  } catch (e) {
    onError?.(e);
    return null;
  }
}