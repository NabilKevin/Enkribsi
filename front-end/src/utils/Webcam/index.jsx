export const stopWebcam = ({webcamStream, setWebcamStream}) => {
  if (webcamStream) {
    const tracks = webcamStream.getTracks();
    tracks.forEach((track) => track.stop());
    setWebcamStream(null);
  }
};