import matplotlib.pyplot as plt 
import seaborn as sns
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import numpy as np
from typing import List, Dict, Any
import os
import time
from dotenv import load_dotenv
from matching_algo.matching import match_tracks_to_clusters, create_feature_vector, build_tag_vocabulary, get_lastfm_tags

class MatchingVisualizer:
    def __init__(self):
        print("Initializing MatchingVisualizer...")
        load_dotenv()
        self.api_key = os.getenv('LASTFM_API_KEY')
        if not self.api_key:
            raise ValueError("LASTFM_API_KEY not found in environment variables")
        print("LastFM API key loaded successfully")

        # Define color palette for genres
        self.genre_colors = {
            'rock': '#E63946',
            'pop': '#457B9D',
            'hip hop': '#F4A261',
            'jazz': '#2A9D8F',
            'electronic': '#FF6B6B',
            'folk': '#BC6C25',
            'classical': '#6B705C',
            'blues': '#023E8A',
            'metal': '#540B0E',
            'r&b': '#7209B7',
            'other': '#6C757D',
            'unclassified': '#ADB5BD'
        }

    def fetch_track_tags(self, track: Dict[str, str]) -> List[str]:
        """Fetch tags for a single track with error handling and logging"""
        try:
            print(f"Fetching tags for: {track['artist']} - {track['name']}")
            tags = get_lastfm_tags(track['artist'], track['name'], self.api_key)
            print(f"Found {len(tags)} tags")
            return tags
        except Exception as e:
            print(f"Error fetching tags: {str(e)}")
            return []

    def prepare_data(self, tracks: List[Dict[str, str]]):
        """Prepare track data for visualization"""
        print("\nPreparing data...")
        
        # Get tags for all tracks
        all_track_tags = []
        for i, track in enumerate(tracks, 1):
            print(f"\nProcessing track {i}/{len(tracks)}")
            tags = self.fetch_track_tags(track)
            all_track_tags.append(tags)
            time.sleep(0.5)  # Add delay to avoid rate limiting

        # Build vocabulary
        print("\nBuilding tag vocabulary...")
        tag_vocabulary = build_tag_vocabulary(all_track_tags)
        print(f"Created vocabulary with {len(tag_vocabulary)} unique tags")

        # Create feature vectors
        print("Creating feature vectors...")
        feature_vectors = np.array([
            create_feature_vector(tags, tag_vocabulary)
            for tags in all_track_tags
        ])
        print(f"Created {len(feature_vectors)} feature vectors")

        return feature_vectors, all_track_tags, tag_vocabulary

    def visualize_clusters_2d(self, tracks: List[Dict[str, str]], method='pca', 
                            save_path: str = None):
        """Visualize clusters in 2D"""
        try:
            # Prepare data
            features, _, _ = self.prepare_data(tracks)
            print("\nRunning clustering algorithm...")
            dummy_features = [[0, 0]] * len(tracks)
            clustering_result = match_tracks_to_clusters(dummy_features, tracks)

            # Get cluster information
            print("Processing cluster information...")
            labels = []
            genres = []
            for track in tracks:
                found = False
                for cluster in clustering_result['clusters']:
                    if any(t['name'] == track['name'] and t['artist'] == track['artist'] 
                          for t in cluster['tracks']):
                        labels.append(cluster['id'])
                        genres.append(cluster['genre'])
                        found = True
                        break
                if not found:
                    print(f"Warning: No cluster found for {track['name']} by {track['artist']}")

            # Reduce dimensionality
            print(f"\nReducing dimensionality using {method.upper()}...")
            if method == 'tsne' and len(tracks) >= 5:
                reducer = TSNE(n_components=2, random_state=42, 
                             perplexity=min(len(tracks) - 1, 30) / 3.0)
                title = 'Track Clusters (t-SNE)'
            else:
                reducer = PCA(n_components=2)
                title = 'Track Clusters (PCA)'

            reduced_features = reducer.fit_transform(features)

            # Create visualization
            print("\nCreating visualization...")
            plt.figure(figsize=(15, 10))
            
            # Plot points
            unique_genres = list(set(genres))
            for genre in unique_genres:
                mask = np.array(genres) == genre
                color = self.genre_colors.get(genre, '#CCCCCC')
                plt.scatter(reduced_features[mask, 0], reduced_features[mask, 1],
                          color=color, label=genre.title(),
                          alpha=0.8, s=150, edgecolor='white')

            # Add labels
            for i, track in enumerate(tracks):
                plt.annotate(f"{track['name']}\n({track['artist']})",
                           (reduced_features[i, 0], reduced_features[i, 1]),
                           xytext=(10, 10), textcoords='offset points',
                           bbox=dict(facecolor='white', edgecolor='none', alpha=0.7),
                           fontsize=8)

            plt.title(title)
            plt.xlabel('Component 1')
            plt.ylabel('Component 2')
            plt.legend()
            plt.tight_layout()

            if save_path:
                plt.savefig(save_path)
                print(f"Saved visualization to {save_path}")

            plt.show()
            print("Visualization completed!")

        except Exception as e:
            print(f"Error during visualization: {str(e)}")
            raise

def main():
    """Example usage with diverse genre test set"""
    print("Starting visualization demo...")
    
    # More diverse test set covering different genres
    test_tracks = [
        # Rock
        {"name": "Bohemian Rhapsody", "artist": "Queen"},
        {"name": "Sweet Child O' Mine", "artist": "Guns N' Roses"},
        # Pop
        {"name": "Billie Jean", "artist": "Michael Jackson"},
        {"name": "Like a Prayer", "artist": "Madonna"},
        # Hip Hop
        {"name": "Lose Yourself", "artist": "Eminem"},
        {"name": "California Love", "artist": "2Pac"},
        # Electronic
        {"name": "Get Lucky", "artist": "Daft Punk"},
        {"name": "Around the World", "artist": "Daft Punk"},
        # R&B
        {"name": "I Will Always Love You", "artist": "Whitney Houston"},
        {"name": "Superstition", "artist": "Stevie Wonder"},
        # Jazz
        {"name": "Take Five", "artist": "Dave Brubeck"},
        {"name": "So What", "artist": "Miles Davis"}
    ]

    try:
        visualizer = MatchingVisualizer()
        print(f"\nProcessing {len(test_tracks)} tracks...")
        visualizer.visualize_clusters_2d(test_tracks, method='pca')
    except Exception as e:
        print(f"\nError in main: {str(e)}")

if __name__ == "__main__":
    main()