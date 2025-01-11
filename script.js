const openCameraBtn = document.getElementById('openCamera');
const closeCameraBtn = document.getElementById('closeCamera');
const takePictureBtn = document.getElementById('takePicture');
const savePictureBtn = document.getElementById('savePicture');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const ctx = canvas.getContext('2d');

let stream = null;

// Open Camera
const openCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block'; // Show the video feed
    canvas.style.display = 'none'; // Hide the canvas
    openCameraBtn.disabled = true;
    closeCameraBtn.disabled = false;
    takePictureBtn.disabled = false;

    // Flip the video feed horizontally using CSS
    video.style.transform = 'scaleX(-1)';
  } catch (error) {
    alert('Error accessing camera: ' + error.message);
  }
};

// Close Camera
const closeCamera = () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    stream = null;

    // Hide video and keep the canvas if a picture was taken
    video.style.display = 'none';
    canvas.style.display = canvas.style.display === 'block' ? 'block' : 'none';

    openCameraBtn.disabled = false;
    closeCameraBtn.disabled = true;
    takePictureBtn.disabled = true;
    savePictureBtn.disabled = true;
  }
};

// Take Picture
const takePicture = () => {
  if (stream) {
    // Set canvas size to match the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the image horizontally on the canvas
    ctx.save(); // Save the current state
    ctx.scale(-1, 1); // Flip horizontally
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); // Draw flipped image
    ctx.restore(); // Restore the original state

    // Pause the video feed and hide it
    video.pause();
    video.style.display = 'none';

    // Show the canvas with the frozen picture
    canvas.style.display = 'block';

    savePictureBtn.disabled = false; // Enable the "Save Picture" button
    openCameraBtn.disabled = false;
    closeCameraBtn.disabled = true;
  }
};

// Save Picture
const savePicture = () => {
  if (canvas.width > 0 && canvas.height > 0) {
    const imageData = canvas.toDataURL('image/png'); // Convert canvas to a data URL
    const link = document.createElement('a'); // Create a link element
    link.href = imageData; // Set the href to the image data
    link.download = 'captured-image.png'; // Set the filename for download
    link.click(); // Trigger a click event to download the image
  }
};

savePictureBtn.addEventListener('click', savePicture);

// Attach button events
openCameraBtn.addEventListener('click', openCamera);
closeCameraBtn.addEventListener('click', closeCamera);
takePictureBtn.addEventListener('click', takePicture);

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'f': // Open camera
      if (!openCameraBtn.disabled) openCamera();
      break;
    case 'j': // Close camera
      if (!closeCameraBtn.disabled) closeCamera();
      break;
    case ' ': // Take picture (space bar)
      event.preventDefault(); // Prevent page scrolling when space is pressed
      if (!takePictureBtn.disabled) takePicture();
      break;
    case 'Enter': // Save picture (Enter key)
      if (!savePictureBtn.disabled) savePicture();
      break;
  }
});
