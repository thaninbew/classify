from sklearn.cluster import KMeans
from collections import Counter

def match_tracks_to_clusters(features, track_metadata, num_clusters):
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
        num_clusters (int): Number of clusters to create.
    
    Returns:
        dict: A dictionary containing:
            - 'clusters' (list): A list of clusters, each with:
                - 'id' (int): Cluster ID
                - 'genre' (str): Dominant genre of the cluster
                - 'tracks' (list): List of tracks in the cluster with name, artist, and genres.
    """
    # Step 1: Apply KMeans clustering
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    labels = kmeans.fit_predict(features)

    # Step 2: Group tracks by cluster
    clustered_tracks = {i: [] for i in range(num_clusters)}
    for i, label in enumerate(labels):
        clustered_tracks[label].append(track_metadata[i])

    # Step 3: Assign dominant genre to each cluster
    cluster_genres = {}
    for cluster_id, tracks in clustered_tracks.items():
        genre_counts = Counter(
            genre for track in tracks for genre in track['genres']
        )
        dominant_genre = genre_counts.most_common(1)[0][0] if genre_counts else "Unknown"
        cluster_genres[cluster_id] = dominant_genre

    # Step 4: Prepare result
    result = {
        'clusters': [
            {'id': cluster_id, 'genre': cluster_genres[cluster_id], 'tracks': tracks}
            for cluster_id, tracks in clustered_tracks.items()
        ]
    }
    return result
