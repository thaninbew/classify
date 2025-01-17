from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from collections import Counter
import numpy as np
import requests
from typing import List, Dict

def get_lastfm_tags(artist: str, track: str, api_key: str) -> List[str]:
    """Get track tags from Last.fm API"""
    base_url = "http://ws.audioscrobbler.com/2.0/"
    params = {
        'method': 'track.getTopTags',
        'api_key': api_key,
        'artist': artist,
        'track': track,
        'format': 'json',
        'autocorrect': 1
    }
    
    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        
        if 'toptags' in data and 'tag' in data['toptags']:
            tags = [(tag['name'], float(tag['count'])) for tag in data['toptags']['tag']]
            if tags:
                max_weight = max(weight for _, weight in tags)
                return [tag for tag, weight in tags if weight > max_weight * 0.3]
        return []
    except Exception as e:
        print(f"Error getting tags for {track} by {artist}: {str(e)}")
        return []

def create_feature_vector(tags: List[str], tag_vocabulary: Dict[str, int]) -> np.ndarray:
    """Convert track tags into a numerical feature vector"""
    vector = np.zeros(len(tag_vocabulary))
    for tag in tags:
        if tag.lower() in tag_vocabulary:
            vector[tag_vocabulary[tag.lower()]] = 1
    return vector

def build_tag_vocabulary(all_tags: List[List[str]]) -> Dict[str, int]:
    """Create a mapping of unique tags to indices"""
    unique_tags = sorted(set(tag.lower() for tags in all_tags for tag in tags))
    return {tag: idx for idx, tag in enumerate(unique_tags)}

def get_optimal_clusters_kmeans(features: np.ndarray, max_clusters: int = 10) -> int:
    """Determine optimal number of clusters using silhouette score"""
    if len(features) < 3:
        return min(len(features), 2)
    
    max_clusters = min(max_clusters, len(features) - 1)
    best_score = -1
    best_n = 2
    
    for n in range(2, max_clusters + 1):
        kmeans = KMeans(n_clusters=n, random_state=42, n_init=10)
        labels = kmeans.fit_predict(features)
        score = silhouette_score(features, labels)
        
        if score > best_score:
            best_score = score
            best_n = n
            
    return best_n

def match_tracks_to_clusters(features, track_metadata, algorithm="kmeans"):
    """Match tracks to clusters using Last.fm tags instead of Spotify features"""
    # Handle empty inputs
    if not track_metadata:
        return {
            'clusters': [],
            'silhouette_score': None,
            'davies_bouldin': None,
            'calinski_harabasz': None
        }

    # Get Last.fm API key
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv('LASTFM_API_KEY')
    if not api_key:
        raise ValueError("LASTFM_API_KEY not found in environment variables")

    # Handle small datasets
    if len(track_metadata) < 3:
        return {
            'clusters': [
                {
                    'id': 0,
                    'genre': 'unclassified',
                    'tags': [],
                    'tracks': track_metadata
                }
            ],
            'silhouette_score': None,
            'davies_bouldin': None,
            'calinski_harabasz': None
        }

    # Get tags for all tracks
    all_track_tags = []
    for track in track_metadata:
        if 'artist' not in track or 'name' not in track:
            tags = []
        else:
            tags = get_lastfm_tags(track['artist'], track['name'], api_key)
        all_track_tags.append(tags)

    # Build tag vocabulary and convert to feature vectors
    tag_vocabulary = build_tag_vocabulary(all_track_tags)
    if not tag_vocabulary:
        return {
            'clusters': [
                {
                    'id': 0,
                    'genre': 'unclassified',
                    'tags': [],
                    'tracks': track_metadata
                }
            ],
            'silhouette_score': None,
            'davies_bouldin': None,
            'calinski_harabasz': None
        }

    # Create feature vectors from tags
    feature_vectors = np.array([
        create_feature_vector(tags, tag_vocabulary)
        for tags in all_track_tags
    ])

    # Determine optimal number of clusters
    n_clusters = min(get_optimal_clusters_kmeans(feature_vectors), len(track_metadata))

    # Perform clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(feature_vectors)

    # Calculate clustering metrics if possible
    metrics = {}
    if len(feature_vectors) > 2 and n_clusters > 1:
        metrics['silhouette_score'] = silhouette_score(feature_vectors, labels)
        metrics['davies_bouldin'] = davies_bouldin_score(feature_vectors, labels)
        metrics['calinski_harabasz'] = calinski_harabasz_score(feature_vectors, labels)
    else:
        metrics = {
            'silhouette_score': None,
            'davies_bouldin': None,
            'calinski_harabasz': None
        }

    # Group tracks by cluster
    clustered_tracks = {i: [] for i in range(n_clusters)}
    for i, label in enumerate(labels):
        track_info = track_metadata[i].copy()
        track_info['tags'] = all_track_tags[i]
        clustered_tracks[label].append(track_info)

    # Determine dominant tags/genre for each cluster
    cluster_info = {}
    for cluster_id, tracks in clustered_tracks.items():
        cluster_tags = [tag for track in tracks for tag in track.get('tags', [])]
        tag_counts = Counter(cluster_tags)
        top_tags = tag_counts.most_common(3)
        
        cluster_info[cluster_id] = {
            'genre': top_tags[0][0] if top_tags else "unclassified",
            'tags': [tag for tag, _ in top_tags]
        }

    # Prepare final result
    result = {
        'clusters': [
            {
                'id': cluster_id,
                'genre': cluster_info[cluster_id]['genre'],
                'tags': cluster_info[cluster_id]['tags'],
                'tracks': tracks
            }
            for cluster_id, tracks in clustered_tracks.items()
        ],
        **metrics
    }

    return result