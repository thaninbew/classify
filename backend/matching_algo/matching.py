from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from collections import Counter

def get_optimal_clusters_kmeans(features, max_clusters=10):
    # Implement the elbow method to find the best cluster count
    pass

def get_optimal_components_gmm(features, max_components=10):
    # Implement a loop over components using AIC/BIC
    pass

def match_tracks_to_clusters(features, track_metadata, algorithm="kmeans"):
    """
    Matches tracks to clusters based on audio features and assigns dominant genres to clusters.

    Dataset format:
    - 'features': 2D array (n_tracks x n_features), e.g., [[danceability, energy, tempo, valence, acousticness], ...]
    - 'track_metadata': list of dicts, each with 'name', 'artist', 'genres' (list of strings)
    
    Args:
        features (list of list of floats): 2D array where each row represents audio features of a track.
        track_metadata (list of dict): Metadata for each track. Each dictionary must contain:
            - 'name' (str): Track name
            - 'artist' (str): Artist name
            - 'genres' (list of str): List of genres for the track
        algorithm (str): Clustering algorithm to use ("kmeans" or "gmm").
    
    Returns:
        dict: A dictionary containing:
            - 'clusters' (list): A list of clusters, each with:
                - 'id' (int): Cluster ID
                - 'genre' (str): Dominant genre of the cluster
                - 'tracks' (list): List of tracks in the cluster with name, artist, and genres.
            - 'silhouette_score' (float): Silhouette score of the clustering.
            - 'davies_bouldin' (float): Davies-Bouldin score of the clustering.
            - 'calinski_harabasz' (float): Calinski-Harabasz score of the clustering.
    """
    # Handle small datasets by directly grouping by genre
    if len(track_metadata) < 10:
        genre_clusters = {}
        for track in track_metadata:
            for genre in track['genres']:
                if genre not in genre_clusters:
                    genre_clusters[genre] = []
                genre_clusters[genre].append(track)
        return {
            'clusters': [
                {
                    'id': i,
                    'genre': genre,
                    'tracks': tracks
                }
                for i, (genre, tracks) in enumerate(genre_clusters.items())
            ],
            'silhouette_score': None,
            'davies_bouldin': None,
            'calinski_harabasz': None
        }

    # Standardize features
    scaler = StandardScaler()
    features = scaler.fit_transform(features)

    # Automatically determine num_clusters
    if algorithm == "kmeans":
        num_clusters = get_optimal_clusters_kmeans(features)
    else:
        num_clusters = get_optimal_components_gmm(features)

    # Select algorithm and perform clustering
    if algorithm == "kmeans":
        kmeans = KMeans(n_clusters=num_clusters, random_state=42)
        labels = kmeans.fit_predict(features)
    elif algorithm == "gmm":
        from sklearn.mixture import GaussianMixture
        gmm = GaussianMixture(n_components=num_clusters, random_state=42)
        labels = gmm.fit_predict(features)
    else:
        raise ValueError("Unsupported algorithm")

    # Group tracks by cluster
    clustered_tracks = {i: [] for i in range(num_clusters)}
    for i, label in enumerate(labels):
        clustered_tracks[label].append(track_metadata[i])

    # Assign dominant genre to each cluster
    cluster_genres = {}
    for cluster_id, tracks in clustered_tracks.items():
        genre_counts = Counter(
            genre for track in tracks for genre in track['genres']
        )
        top_genre = next((g for g, c in genre_counts.most_common() if g != "Unknown"), "Unknown")
        cluster_genres[cluster_id] = top_genre

    # Compute additional metrics
    sil_score = silhouette_score(features, labels)
    db_score = davies_bouldin_score(features, labels)
    ch_score = calinski_harabasz_score(features, labels)

    # Prepare result
    result = {
        'clusters': [
            {
                'id': cluster_id,
                'genre': cluster_genres[cluster_id],
                'tracks': tracks
            }
            for cluster_id, tracks in clustered_tracks.items()
        ],
        'silhouette_score': sil_score,
        'davies_bouldin': db_score,
        'calinski_harabasz': ch_score
    }
    return result
