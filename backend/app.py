from flask import Flask, request, jsonify
import numpy as np
from matching_algo.matching import match_tracks_to_clusters

app = Flask(__name__)

@app.route('/')
def home():
    return "Classify Clustering"

@app.route('/cluster', methods=['POST'])
def cluster():
    try:
        # Get data from request
        data = request.json
        features = data.get('features', [])
        track_metadata = data.get('track_metadata', [])
        n_clusters = data.get('n_clusters', 5)

        # Validate the input
        if not features:
            return jsonify({"error": "Features are required for clustering"}), 400
        if not track_metadata:
            return jsonify({"error": "Track metadata is required for clustering"}), 400

        # Convert the features list to a numpy array
        features_array = np.array(features)

        # Perform clustering and genre matching using the imported function
        result = match_tracks_to_clusters(features_array, track_metadata, n_clusters)

        # Response
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
