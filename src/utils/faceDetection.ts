import * as faceapi from 'face-api.js';

/**
 * Load face detection models with better error handling
 */
export async function loadFaceDetectionModels(): Promise<boolean> {
  try {
    // Try multiple CDNs in case one fails
    const cdnUrls = [
      'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
      'https://unpkg.com/face-api.js@0.22.2/weights',
      '/models' // Fallback to local models if available
    ];

    let loaded = false;
    let lastError = null;

    // Try each CDN until one works
    for (const modelUrl of cdnUrls) {
      try {
        console.log(`Attempting to load face-api.js models from: ${modelUrl}`);
        
        // Load the models one by one with timeouts
        await Promise.race([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading tinyFaceDetector')), 10000))
        ]);
        
        await Promise.race([
          faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading faceLandmark68Net')), 10000))
        ]);
        
        await Promise.race([
          faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading faceExpressionNet')), 10000))
        ]);
        
        console.log(`Successfully loaded face-api.js models from: ${modelUrl}`);
        loaded = true;
        break;
      } catch (error) {
        console.error(`Failed to load models from ${modelUrl}:`, error);
        lastError = error;
      }
    }

    if (!loaded && lastError) {
      throw lastError;
    }

    return loaded;
  } catch (error) {
    console.error("All attempts to load face detection models failed:", error);
    return false;
  }
}

/**
 * Detect smile in a video element
 */
export async function detectSmile(videoElement: HTMLVideoElement): Promise<boolean> {
  try {
    if (videoElement.readyState !== 4) {
      return false;
    }

    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    const result = await faceapi.detectSingleFace(videoElement, options)
      .withFaceLandmarks()
      .withFaceExpressions();

    if (result && result.expressions) {
      // Consider a smile if happiness is above 0.7 (70%)
      return result.expressions.happy > 0.7;
    }
    
    return false;
  } catch (error) {
    console.error("Error during smile detection:", error);
    return false;
  }
}

/**
 * Create a local model directory and download models if needed
 * This is a fallback method if CDN loading fails
 */
export async function downloadAndSaveModels(): Promise<boolean> {
  try {
    // This would typically be a server-side function
    // For client-side, we'll just return false as we can't save files
    console.log("Attempted to download and save models locally, but this requires server-side implementation");
    return false;
  } catch (error) {
    console.error("Error downloading models:", error);
    return false;
  }
} 