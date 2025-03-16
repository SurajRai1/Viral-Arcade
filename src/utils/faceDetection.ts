import * as faceapi from 'face-api.js';

/**
 * Load face detection models with better error handling
 */
export async function loadFaceDetectionModels(): Promise<boolean> {
  try {
    // Try loading from different CDNs
    const modelUrls = [
      '/models', // Local models
      'https://justadudewhohacks.github.io/face-api.js/models', // GitHub CDN
      'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights' // Raw GitHub
    ];

    for (const modelUrl of modelUrls) {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
          faceapi.nets.faceExpressionNet.loadFromUri(modelUrl)
        ]);
        console.log('Face detection models loaded successfully from:', modelUrl);
        return true;
      } catch (error) {
        console.warn(`Failed to load models from ${modelUrl}, trying next source...`);
      }
    }

    throw new Error('Failed to load models from all sources');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
}

/**
 * Detect smile in a video element
 */
export async function detectSmile(videoElement: HTMLVideoElement): Promise<boolean> {
  try {
    // Make sure video is playing and ready
    if (videoElement.readyState !== 4) {
      console.warn('Video not ready yet');
      return false;
    }

    // Detect faces using TinyFaceDetector (faster than default)
    const detection = await faceapi.detectSingleFace(
      videoElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
    ).withFaceExpressions();

    if (!detection) {
      console.log('No face detected');
      return false;
    }

    // Check if the person is happy (smiling)
    const happyScore = detection.expressions.happy;
    const isSmiling = happyScore > 0.7; // 70% confidence threshold

    if (isSmiling) {
      console.log('Smile detected with confidence:', happyScore);
    }

    return isSmiling;
  } catch (error) {
    console.warn('Error in smile detection:', error);
    return false;
  }
} 
} 