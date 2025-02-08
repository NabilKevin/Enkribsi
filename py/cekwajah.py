import cv2
import dlib
import numpy as np
import sys
import json

cv2.setLogLevel(1)

# Load pre-trained face detector and shape predictor from dlib
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")  # Pastikan file ini ada di direktori

def is_face_facing_camera(image_path):
    # Load image
    image = cv2.imread(image_path)
    if image is None:
        json_data = json.dumps({"message": "Gambar tidak ditemukan.", 'status': "unsuccessful"})
        print(json_data)
        return False

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = detector(gray)
    if len(faces) == 0:
        json_data = json.dumps({"message": "Tidak ada wajah yang terdeteksi.", 'status': "unsuccessful"})
        print(json_data)
        return False

    for face in faces:
        # Get facial landmarks
        landmarks = predictor(gray, face)

        # Extract key points for orientation analysis
        left_eye = (landmarks.part(36).x, landmarks.part(36).y)  # Left eye corner
        right_eye = (landmarks.part(45).x, landmarks.part(45).y)  # Right eye corner
        nose_tip = (landmarks.part(30).x, landmarks.part(30).y)  # Nose tip

        # Calculate angle between eyes to determine face orientation
        delta_x_eyes = right_eye[0] - left_eye[0]
        delta_y_eyes = right_eye[1] - left_eye[1]
        angle_eyes = np.degrees(np.arctan2(delta_y_eyes, delta_x_eyes))

        # Calculate the position of the nose relative to the eyes
        nose_to_left_eye = np.sqrt((nose_tip[0] - left_eye[0])**2 + (nose_tip[1] - left_eye[1])**2)
        nose_to_right_eye = np.sqrt((nose_tip[0] - right_eye[0])**2 + (nose_tip[1] - right_eye[1])**2)

        # Check if the face is facing the camera
        # Conditions:
        # 1. The angle between the eyes should be close to 0 (frontal face).
        # 2. The nose should be roughly centered between the eyes.
        if abs(angle_eyes) < 10 and abs(nose_to_left_eye - nose_to_right_eye) < 20:
            json_data = json.dumps({"message": "Wajah menghadap ke kamera.", 'status': "successful"})
            print(json_data)
            return True
        else:
            json_data = json.dumps({"message": "Wajah tidak menghadap ke kamera.", 'status': "unsuccessful"})
            print(json_data)
            return False

# Contoh penggunaan
image_path = sys.argv[1]  # Ganti dengan path gambar Anda
is_face_facing_camera(image_path)