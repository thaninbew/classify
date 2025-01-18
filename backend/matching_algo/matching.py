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
    """Extract the base genre from a list of tags"""
    # Define genre mappings
    genre_mappings = {
        'rock': ['rock', 'classic rock', 'hard rock', 'alternative rock', 
                'indie rock', 'progressive rock', 'punk rock', 'folk rock'],
        'pop': ['pop', 'synth pop', 'indie pop', 'power pop', 'electropop'],
        'hip hop': ['hip hop', 'rap', 'trap', 'grime'],
        'jazz': ['jazz', 'smooth jazz', 'fusion', 'bebop', 'big band'],
        'electronic': ['electronic', 'edm', 'techno', 'house', 'trance'],
        'folk': ['folk', 'americana', 'traditional', 'singer-songwriter'],
        'metal': ['metal', 'heavy metal', 'black metal', 'death metal'],
        'r&b': ['r&b', 'soul', 'funk', 'motown'],
        'blues': ['blues', 'delta blues', 'chicago blues'],
        'classical': ['classical', 'orchestra', 'symphony', 'chamber music']
    }
    
    if not tags:
        return 'unclassified'

    # Count occurrences of base genres
    genre_counts = {}
    for tag in tags:
        tag = tag.lower()
        for base_genre, subgenres in genre_mappings.items():
            if tag in subgenres or tag == base_genre:
                genre_counts[base_genre] = genre_counts.get(base_genre, 0) + 1
    
    if genre_counts:
        return max(genre_counts.items(), key=lambda x: x[1])[0]
    return 'unclassified'

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
    if len(track_metadata) < 2:
        # Get tags and genre for single track
        if track_metadata and 'artist' in track_metadata[0] and 'name' in track_metadata[0]:
            tags = get_lastfm_tags(
                track_metadata[0]['artist'],
                track_metadata[0]['name'],
                api_key
            )
            genre = get_base_genre(tags)
        else:
            genre = 'unclassified'
            
        return {
            'clusters': [
                {
                    'id': 0,
                    'genre': genre,
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
        track['tags'] = tags  # Store tags with track data

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
    n_clusters = min(max(2, len(track_metadata) // 3), 8)  # Between 2 and 8 clusters
    
    # Perform clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(feature_vectors)

    # Calculate metrics if possible
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
        track = track_metadata[i].copy()
        clustered_tracks[label].append(track)

    # Create initial clusters with genres
    initial_clusters = []
    for cluster_id, tracks in clustered_tracks.items():
        # Get all tags in cluster
        cluster_tags = []
        for track in tracks:
            if 'tags' in track:
                cluster_tags.extend(track['tags'])
        
        initial_clusters.append({
            'id': cluster_id,
            'genre': get_base_genre(cluster_tags) if cluster_tags else 'unclassified',
            'tags': cluster_tags,
            'tracks': tracks
        })

    # Merge similar clusters
    final_clusters = merge_similar_clusters(initial_clusters)

    # Prepare final result
    result = {
        'clusters': final_clusters,
        **metrics
    }

    return result

def merge_similar_clusters(clusters: List[Dict], similarity_threshold: float = 0.3) -> List[Dict]:
    """Merge clusters that have similar genre distributions"""
    if not clusters:
        return clusters

    def get_cluster_tags(cluster):
        """Helper function to get all unique tags from a cluster"""
        tags = set()
        for track in cluster['tracks']:
            track_tags = track.get('tags', [])
            if isinstance(track_tags, (list, tuple)):
                tags.update(set(track_tags))
            elif isinstance(track_tags, str):
                tags.add(track_tags)
        return tags

    # Group clusters by genre
    genre_groups = defaultdict(list)
    for cluster in clusters:
        genre_groups[cluster['genre']].append(cluster)
    
    # Merge clusters within each genre group
    merged_clusters = []
    for genre, group in genre_groups.items():
        while group:
            base_cluster = group.pop(0)
            base_tags = get_cluster_tags(base_cluster)
            
            merged_tracks = base_cluster['tracks'].copy()
            merged_tags = base_tags.copy()
            
            # Find similar clusters to merge
            i = 0
            while i < len(group):
                other_cluster = group[i]
                other_tags = get_cluster_tags(other_cluster)
                
                # Calculate Jaccard similarity
                if base_tags or other_tags:
                    similarity = len(base_tags & other_tags) / len(base_tags | other_tags) if (base_tags | other_tags) else 0
                    if similarity >= similarity_threshold:
                        merged_tracks.extend(other_cluster['tracks'])
                        merged_tags.update(other_tags)
                        group.pop(i)
                    else:
                        i += 1
            
            # Create merged cluster
            merged_clusters.append({
                'id': len(merged_clusters),
                'genre': genre,
                'tags': list(merged_tags),
                'tracks': merged_tracks
            })
    
    return merged_clusters