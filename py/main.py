import face_recognition
import sys
import os
import json

def recognize_and_validate(input_image_path, reference_image_path):
    try:
        # Muat gambar input dan referensi
        input_image = face_recognition.load_image_file(input_image_path)
        reference_image = face_recognition.load_image_file(reference_image_path)

        # Ekstrak encoding wajah
        input_encodings = face_recognition.face_encodings(input_image)
        reference_encodings = face_recognition.face_encodings(reference_image)

        # Periksa apakah ada wajah di kedua gambar
        if len(input_encodings) == 0:
            return {"error": "No face found in the input image."}
        if len(reference_encodings) == 0:
            return {"error": "No face found in the reference image."}

        # Ambil encoding wajah pertama
        input_encoding = input_encodings[0]
        reference_encoding = reference_encodings[0]

        # Bandingkan wajah
        results = face_recognition.compare_faces([reference_encoding], input_encoding, tolerance=0.4)
        distance = face_recognition.face_distance([reference_encoding], input_encoding)[0]

        # Kembalikan hasil
        return {
            'status': "successful" if results[0] else "unsuccessful",
            # "match": results[0],
            # "distance": distance,
            "message": "Face matched!" if results[0] else "Face did not match."
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Pastikan ada 2 argumen: gambar input dan gambar referensi
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python3 recognize_face.py <input_image_path> <reference_image_path>"}))
        sys.exit(1)

    input_image_path = sys.argv[1]
    reference_image_path = sys.argv[2]

    # Pastikan kedua file gambar ada
    if not os.path.exists(input_image_path):
        print(json.dumps({"error": f"Input image not found: {input_image_path}"}))
        sys.exit(1)

    if not os.path.exists(reference_image_path):
        print(json.dumps({"error": f"Reference image not found: {reference_image_path}"}))
        sys.exit(1)

    # Lakukan pengenalan dan validasi wajah
    result = recognize_and_validate(input_image_path, reference_image_path)

    json_data = json.dumps(result)

    print(json_data)
