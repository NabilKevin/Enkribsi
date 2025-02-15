from flask import Flask, request, jsonify
import pandas as pd
import base64
import cv2
import dlib
import numpy as np
import base64
import face_recognition
from io import BytesIO
import sys
import os

script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))

app = Flask(__name__)

cv2.setLogLevel(1)
# Load pre-trained face detector and shape predictor from dlib
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(f"{script_dir}/shape_predictor_68_face_landmarks.dat")  # Pastikan file ini ada di direktori
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + f'{script_dir}/haarcascade_frontalface_default.xml')

@app.route('/generateExcell', methods=['POST'])
def generateExcell():
    # Ambil data JSON dari request
    data = request.json

    # Validasi apakah data adalah JSON object
    if not isinstance(data, dict):
        return jsonify({'error': 'Data harus berupa JSON object'}), 400

    # Konversi data JSON menjadi DataFrame
    df_absensi = pd.DataFrame(data['absensi'])
    df_rekap = pd.DataFrame(data['rekap'])
    df_perizinan = pd.DataFrame(data['perizinan'])
    df_pelanggaran = pd.DataFrame(data['pelanggaran'])

    # Gunakan BytesIO untuk menyimpan file Excel di memori
    with BytesIO() as buffer:
        # Tulis file Excel ke buffer
        with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
            df_absensi.to_excel(writer, sheet_name="Absensi", index=False)
            df_rekap.to_excel(writer, sheet_name="Rekap", index=False)
            df_perizinan.to_excel(writer, sheet_name="Perizinan", index=False)
            df_pelanggaran.to_excel(writer, sheet_name="Pelanggaran", index=False)

        # Dapatkan konten buffer dan encode ke Base64
        buffer.seek(0)  # Pindahkan pointer buffer ke awal
        file_content = buffer.read()
        base64_encoded = base64.b64encode(file_content).decode('utf-8')

    # Kembalikan hasil sebagai JSON
    return jsonify({
        'message': 'File Excel telah berhasil dibuat',
        'data': base64_encoded
    }), 200

@app.route('/cekwajah', methods=['POST'])
def is_face_facing_camera():
    data = request.json

    if not isinstance(data, dict):
      return jsonify({'error': 'Data harus berupa JSON object'}), 400
    if 'image' not in data:
      return jsonify({'error': 'Field "image" harus ada'}), 404
    
    decoded_data = base64.b64decode(data['image'])

    nparr = np.frombuffer(decoded_data, np.uint8)

    # Decode gambar menggunakan OpenCV
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
      return jsonify({"message": "Gambar tidak ditemukan.", 'status': "unsuccessful"}), 404

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = detector(gray)
    if len(faces) == 0:
        return jsonify({"message": "Tidak ada wajah yang terdeteksi.", 'status': "unsuccessful"}), 404

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
            return jsonify({"message": "Wajah menghadap ke kamera.", 'status': "successful"}), 200
        else:
            return jsonify({"message": "Wajah tidak menghadap ke kamera.", 'status': "unsuccessful"}), 422
@app.route('/validasiwajah', methods=['POST'])
def recognize_and_validate():
  data = request.json
  if not isinstance(data, dict):
    return jsonify({'error': 'Data harus berupa JSON object'}), 400
  if 'image1' not in data or 'image2' not in data:
    return jsonify({'error': 'Field "image1" atau "image2" harus ada'}), 404
  
  decoded_data1 = base64.b64decode(data['image1'])
  decoded_data2 = base64.b64decode(data['image2'])

  nparr1 = np.frombuffer(decoded_data1, np.uint8)
  nparr2 = np.frombuffer(decoded_data2, np.uint8)

  # Decode gambar menggunakan OpenCV
  image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
  image2 = cv2.imdecode(nparr2, cv2.IMREAD_COLOR)

  if image1 is None:
    return jsonify({"message": "Gambar1 tidak ditemukan.", 'status': "unsuccessful"}), 404
  if image2 is None:
    return jsonify({"message": "Gambar2 tidak ditemukan.", 'status': "unsuccessful"}), 404
  try:
      # Muat gambar input dan referensi
      input_image = face_recognition.load_image_file(image1)
      reference_image = face_recognition.load_image_file(image2)

      # Ekstrak encoding wajah
      input_encodings = face_recognition.face_encodings(input_image)
      reference_encodings = face_recognition.face_encodings(reference_image)

      # Periksa apakah ada wajah di kedua gambar
      if len(input_encodings) == 0:
          return jsonify({"error": "No face found in the input image.", 'status': "unsuccessful"}), 404
      if len(reference_encodings) == 0:
          return jsonify({"error": "No face found in the reference image.", 'status': "unsuccessful"}), 404

      # Ambil encoding wajah pertama
      input_encoding = input_encodings[0]
      reference_encoding = reference_encodings[0]

      # Bandingkan wajah
      results = face_recognition.compare_faces([reference_encoding], input_encoding, tolerance=0.4)
      distance = face_recognition.face_distance([reference_encoding], input_encoding)[0]

      # Kembalikan hasil
      return jsonify({
          'status': "successful" if results[0] else "unsuccessful",
          # "match": results[0],
          # "distance": distance,
          "message": "Face matched!" if results[0] else "Face did not match."
      }), 200 if results[0] else 404

  except Exception as e:
      return jsonify({"error": str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)