from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return "Classify Clustering"

@app.route('/cluster', methods=['POST'])
def cluster():
    try:
        #get data from request
        data = request.json
        features = data.get('features', [])
        n_clusters = data.get('n_clusters', 5)

        #validate the input
        if not features:
            return jsonify({"error": "Features are required for clustering"}), 400

        #convert the features list to a numpy array
        features_array = np.array(features)

        #KMeans clustering
        kmeans = KMeans(n_clusters=n_clusters)
        kmeans.fit(features_array)

        #response
        labels = kmeans.labels_.tolist()
        response = {
            "labels": labels,
            "cluster_centers": kmeans.cluster_centers_.tolist()
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
