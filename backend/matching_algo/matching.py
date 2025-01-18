from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from collections import Counter, defaultdict
import numpy as np
import requests
from typing import List, Dict, Any

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

def get_base_genre(tags: List[str]) -> str:
    """
    Extract the base genre from a list of tags.
    Simplifies subgenres into their main genre category.
    """
    # Define genre mappings
    genre_mappings = {
        'rock': ['rock', 'classic rock', 'hard rock', 'alternative rock', 'indie rock', 
                'progressive rock', 'punk rock', 'folk rock', 'psychedelic rock'],
        'pop': ['pop', 'synth pop', 'indie pop', 'power pop', 'electropop', 'dream pop'],
        'metal': ['metal', 'heavy metal', 'black metal', 'death metal', 'thrash metal'],
        'jazz': ['jazz', 'smooth jazz', 'fusion', 'bebop', 'big band'],
        'electronic': ['electronic', 'edm', 'techno', 'house', 'trance', 'dubstep'],
        'folk': ['folk', 'americana', 'traditional', 'singer-songwriter'],
        'hip hop': ['hip hop', 'rap', 'trap', 'grime'],
        'r&b': ['r&b', 'soul', 'funk', 'motown'],
        'blues': ['blues', 'delta blues', 'chicago blues'],
        'classical': ['classical', 'orchestra', 'symphony', 'chamber music']
    }
    
    # Count occurrences of base genres
    genre_counts = defaultdict(int)
    for tag in tags:
        tag = tag.lower()
        for base_genre, subgenres in genre_mappings.items():
            if tag in subgenres or tag == base_genre:
                genre_counts[base_genre] += 1
    
    if genre_counts:
        # Return the most common base genre
        return max(genre_counts.items(), key=lambda x: x[1])[0]
    return 'other'

def merge_similar_clusters(clusters: List[Dict], similarity_threshold: float = 0.5) -> List[Dict]:
    """
    Merge clusters that have similar genre distributions
    """
    if not clusters:
        return clusters

    # Keep track of clusters to merge
    merged = []
    skip_indices = set()

    for i in range(len(clusters)):
        if i in skip_indices:
            continue

        current_cluster = clusters[i]
        similar_clusters = []

        # Look for similar clusters
        for j in range(i + 1, len(clusters)):
            if j in skip_indices:
                continue

            other_cluster = clusters[j]
            
            # Check if clusters share the same base genre
            if current_cluster['genre'] == other_cluster['genre']:
                # Convert lists of tags to sets of individual tags
                current_tags = set().union(*[set(track.get('tags', [])) for track in current_cluster['tracks']])
                other_tags = set().union(*[set(track.get('tags', [])) for track in other_cluster['tracks']])
                
                # Calculate Jaccard similarity
                if current_tags or other_tags:  # Avoid division by zero
                    similarity = len(current_tags & other_tags) / len(current_tags | other_tags)
                    if similarity >= similarity_threshold:
                        similar_clusters.append(j)
                        skip_indices.add(j)

        # Merge similar clusters
        if similar_clusters:
            merged_cluster = {
                'id': current_cluster['id'],
                'genre': current_cluster['genre'],
                'tags': list(set(current_cluster['tags'] + 
                               sum([clusters[j]['tags'] for j in similar_clusters], []))),
                'tracks': current_cluster['tracks'] + 
                         sum([clusters[j]['tracks'] for j in similar_clusters], [])
            }
            merged.append(merged_cluster)
        else:
            merged.append(current_cluster)

    return merged

def match_tracks_to_clusters(features, track_metadata, algorithm="kmeans"):
    """Match tracks to clusters using Last.fm tags with genre merging"""
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
        base_genre = get_base_genre(get_lastfm_tags(
            track_metadata[0]['artist'],
            track_metadata[0]['name'],
            api_key
        ))
        return {
            'clusters': [
                {
                    'id': 0,
                    'genre': base_genre,
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

    # Initial clustering
    n_clusters = min(max(2, len(track_metadata) // 3), 8)  # Adjust cluster count
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(feature_vectors)

    # Calculate metrics
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

    # Create initial clusters with base genres
    initial_clusters = []
    for cluster_id, tracks in clustered_tracks.items():
        # Get all tags in the cluster
        cluster_tags = [tag for track in tracks for tag in track.get('tags', [])]
        
        # Determine base genre for the cluster
        base_genre = get_base_genre(cluster_tags)
        
        initial_clusters.append({
            'id': cluster_id,
            'genre': base_genre,
            'tags': cluster_tags,
            'tracks': tracks
        })

    # Merge similar clusters
    final_clusters = merge_similar_clusters(initial_clusters)

    # Reassign IDs after merging
    for i, cluster in enumerate(final_clusters):
        cluster['id'] = i

    # Prepare final result
    result = {
        'clusters': final_clusters,
        **metrics
    }

    return result