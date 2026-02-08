/**
 * Derives the canonical live URL for the application.
 * Prefers icp0.io when available, falls back to current location.
 */
export function getLiveUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const currentHost = window.location.host;
  const currentProtocol = window.location.protocol;

  // If already on icp0.io, return current URL
  if (currentHost.includes('icp0.io')) {
    return `${currentProtocol}//${currentHost}`;
  }

  // If on localhost, try to extract canister ID from environment or return localhost
  if (currentHost.includes('localhost')) {
    // In development, we can't provide a live icp0.io URL
    return `${currentProtocol}//${currentHost}`;
  }

  // If on ic0.app, convert to icp0.io
  if (currentHost.includes('ic0.app')) {
    const canisterId = currentHost.split('.')[0];
    return `https://${canisterId}.icp0.io`;
  }

  // If on raw.icp0.io, convert to standard icp0.io
  if (currentHost.includes('raw.icp0.io')) {
    const canisterId = currentHost.split('.')[0];
    return `https://${canisterId}.icp0.io`;
  }

  // Default: return current URL
  return `${currentProtocol}//${currentHost}`;
}

/**
 * Copies the live URL to clipboard.
 */
export async function copyLiveUrlToClipboard(): Promise<boolean> {
  try {
    const url = getLiveUrl();
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
}
