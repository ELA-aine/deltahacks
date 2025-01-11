const openCameraBtn = document.getElementById('openCamera');
const closeCameraBtn = document.getElementById('closeCamera');
const takePictureBtn = document.getElementById('takePicture');
const savePictureBtn = document.getElementById('savePicture');
const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const ctx = canvas.getContext('2d');

let stream = null;

// Open Camera
openCameraBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'block'; // Show the video feed
    canvas.style.display = 'none'; // Hide the canvas
    openCameraBtn.disabled = true;
    closeCameraBtn.disabled = false;
    takePictureBtn.disabled = false;
  } catch (error) {
    alert('Error accessing camera: ' + error.message);
  }
});

// Close Camera
closeCameraBtn.addEventListener('click', () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    stream = null;

    // Hide video and keep the canvas if a picture was taken
    video.style.display = 'none';
    canvas.style.display = 'block';
    canvas.style.display = 'none';

    openCameraBtn.disabled = false;
    closeCameraBtn.disabled = true;
    takePictureBtn.disabled = true;
    savePictureBtn.disabled = true;
  }
});

// Take Picture
takePictureBtn.addEventListener('click', () => {
  if (stream) {
    // Set canvas size to match the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video feed onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Pause the video feed and hide it
    video.pause();
    video.style.display = 'none';

    // Show the canvas with the frozen picture
    canvas.style.display = 'block';

    savePictureBtn.disabled = false; // Enable the "Save Picture" button
  }
});

// Save Picture
savePictureBtn.addEventListener('click', () => {
  if (canvas.width > 0 && canvas.height > 0) {
    const imageData = canvas.toDataURL('image/png'); // Convert canvas to a data URL
    const link = document.createElement('a'); // Create a link element
    link.href = imageData; // Set the href to the image data
    link.download = 'captured-image.png'; // Set the filename for download
    link.click(); // Trigger a click event to download the image
  }
});
