import sys
from pathlib import Path

# Add the `backend/matching_algo` directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from matching_algo import match_tracks_to_clusters
import numpy as np
import random
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

# Generate larger test data
def generate_test_data(num_tracks=50, num_genres=10):
    genres = [
        "Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "R&B", 
        "Country", "Electronic", "Blues", "Dance"
    ]
    track_metadata = []
    features = []

    for i in range(num_tracks):
        # Randomly generate track metadata
        track = {
            "name": f"Track {i+1}",
            "artist": f"Artist {random.randint(1, 20)}",
            "genres": random.sample(genres, k=random.randint(1, 2))  # 1-2 genres per track
        }
        track_metadata.append(track)

        # Randomly generate audio features (e.g., danceability, energy, tempo, etc.)
        features.append([
            random.uniform(0, 1),  # Danceability
            random.uniform(0, 1),  # Energy
            random.uniform(50, 200),  # Tempo
            random.uniform(0, 1),  # Valence
            random.uniform(0, 1)   # Acousticness
        ])
    
    return np.array(features), track_metadata

# Generate a larger dataset
features, track_metadata = generate_test_data(num_tracks=100, num_genres=10)

n_clusters = 5  # Set the number of clusters

# Run the matching algorithm
result = match_tracks_to_clusters(features, track_metadata, n_clusters)

# Get the cluster labels
labels = [None] * len(features)
for cluster in result["clusters"]:
    for track in cluster["tracks"]:
        idx = next(i for i, t in enumerate(track_metadata) if t["name"] == track["name"])
        labels[idx] = cluster["id"]

# Visualization
def visualize_clusters(features, labels, track_metadata, method="pca"):
    """
    Visualize the clusters using PCA or t-SNE with better labeling.
    """
    # Reduce dimensionality
    if method == "pca":
        reducer = PCA(n_components=2)
    elif method == "tsne":
        reducer = TSNE(n_components=2, random_state=42)
    else:
        raise ValueError("Invalid method. Use 'pca' or 'tsne'.")

    reduced_features = reducer.fit_transform(features)

    # Map labels to cluster names for the legend
    unique_labels = set(labels)
    cluster_names = {label: f"Cluster {label}" for label in unique_labels}

    # Plot the clusters
    plt.figure(figsize=(12, 8))
    for label in unique_labels:
        # Extract points in this cluster
        cluster_points = reduced_features[np.array(labels) == label]
        # Scatter plot for the cluster
        plt.scatter(
            cluster_points[:, 0],
            cluster_points[:, 1],
            label=cluster_names[label],
            s=100,
            alpha=0.6,
            edgecolor="k"
        )

    # Add annotations for a few points (e.g., first track in each cluster)
    for i, (x, y) in enumerate(reduced_features):
        if i < len(track_metadata):  # Prevent index errors
            plt.annotate(
                track_metadata[i]["name"],  # Annotate with the track name
                (x, y),
                fontsize=8,
                alpha=0.7
            )

    # Add plot title, legend, and axis labels
    plt.title(f"Cluster Visualization ({method.upper()})", fontsize=16)
    plt.xlabel("Component 1", fontsize=14)
    plt.ylabel("Component 2", fontsize=14)
    plt.legend(loc="best", title="Clusters", fontsize=10)
    plt.grid(alpha=0.3)
    plt.tight_layout()
    plt.show()


# Visualize using PCA
# visualize_clusters(features, labels, track_metadata, method="pca")

# Uncomment this line to visualize using t-SNE
visualize_clusters(features, labels, track_metadata, method="tsne")

# Print a summary of the clustering results
for cluster in result["clusters"]:
    print(f"Cluster {cluster['id']} (Genre: {cluster['genre']}):")
    for track in cluster["tracks"][:5]:  # Print first 5 tracks per cluster
        print(f"  - {track['name']} by {track['artist']} ({', '.join(track['genres'])})")
    print("...")