// Get a reference to the video element
const videoElement = document.getElementById('camera');

// Request access to the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        // Set the video stream as the source of the video element
        videoElement.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing the camera:', error);
    });
