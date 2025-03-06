
export const handleStripeUrlParams = (refreshAccount: () => Promise<void>) => {
  const params = new URLSearchParams(window.location.search);
  let shouldRefresh = false;
  
  if (params.get('success') === 'true') {
    shouldRefresh = true;
    
    // Clean up the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('success');
    window.history.replaceState({}, '', url.toString());
    
    // Get stored return path (if any)
    const returnPath = sessionStorage.getItem('stripeReturnPath');
    if (returnPath && returnPath !== window.location.pathname) {
      // Slight delay to allow state changes to complete
      setTimeout(() => {
        window.location.pathname = returnPath;
      }, 1000);
    }
  }
  
  if (params.get('refresh') === 'true') {
    shouldRefresh = true;
    
    // Clean up the URL
    const url = new URL(window.location.href);
    url.searchParams.delete('refresh');
    window.history.replaceState({}, '', url.toString());
  }
  
  if (shouldRefresh) {
    refreshAccount();
  }
};
