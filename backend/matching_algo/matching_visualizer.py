import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import numpy as np
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from matching_algo.matching import match_tracks_to_clusters, create_feature_vector, build_tag_vocabulary, get_lastfm_tags

class MatchingVisualizer:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv('LASTFM_API_KEY')
        if not self.api_key:
            raise ValueError("LASTFM_API_KEY not found in environment variables")
        
        # Set modern style for plots
        plt.style.use('default')
        sns.set_theme(style="whitegrid")
        sns.set_palette("husl")

    def prepare_data(self, tracks: List[Dict[str, str]]):
        """Prepare track data for visualization"""
        # Get tags for all tracks
        all_track_tags = []
        for track in tracks:
            tags = get_lastfm_tags(track['artist'], track['name'], self.api_key)
            all_track_tags.append(tags)

        # Build vocabulary and create feature vectors
        tag_vocabulary = build_tag_vocabulary(all_track_tags)
        feature_vectors = np.array([
            create_feature_vector(tags, tag_vocabulary)
            for tags in all_track_tags
        ])

        return feature_vectors, all_track_tags, tag_vocabulary

    def visualize_clusters_2d(self, tracks: List[Dict[str, str]], method='pca', 
                            save_path: str = None):
        """
        Visualize clusters in 2D using t-SNE or PCA
        
        Args:
            tracks: List of tracks with artist and name
            method: 'tsne' or 'pca'
            save_path: Optional path to save the plot
        """
        # Get feature vectors and clustering results
        features, _, _ = self.prepare_data(tracks)
        dummy_features = [[0, 0]] * len(tracks)
        clustering_result = match_tracks_to_clusters(dummy_features, tracks)

        # Get cluster labels
        labels = []
        for i, track in enumerate(tracks):
            for cluster in clustering_result['clusters']:
                if any(t['name'] == track['name'] and t['artist'] == track['artist'] 
                      for t in cluster['tracks']):
                    labels.append(cluster['id'])
                    break

        # Choose dimensionality reduction method based on dataset size
        if method == 'tsne' and len(tracks) >= 5:
            reducer = TSNE(n_components=2, random_state=42, 
                         perplexity=min(len(tracks) - 1, 30) / 3.0,
                         n_iter=2000)
            title = 't-SNE Visualization of Track Clusters'
        else:
            reducer = PCA(n_components=2)
            title = 'PCA Visualization of Track Clusters'
            if method == 'tsne':
                print("Warning: Switching to PCA due to small dataset size")

        # Reduce dimensionality
        reduced_features = reducer.fit_transform(features)

        # Create plot
        plt.figure(figsize=(12, 8))
        
        # Create figure with larger size
        plt.figure(figsize=(15, 10))
        
        # Add light grid for better readability
        plt.grid(True, alpha=0.2)
        
        # Create scatter plot with legend using larger markers
        unique_labels = np.unique(labels)
        colors = plt.cm.tab10(np.linspace(0, 1, len(unique_labels)))  # Get distinct colors
        
        # First plot larger semi-transparent circles for cluster regions
        for label, color in zip(unique_labels, colors):
            mask = np.array(labels) == label
            plt.scatter(reduced_features[mask, 0], reduced_features[mask, 1],
                       color=color, alpha=0.2, s=300)
        
        # Then plot the actual points
        for label, color in zip(unique_labels, colors):
            mask = np.array(labels) == label
            plt.scatter(reduced_features[mask, 0], reduced_features[mask, 1],
                       color=color, label=f'Cluster {label}', 
                       alpha=0.9, s=150, edgecolor='white')

        # Add labels for each point with better visibility
        for i, track in enumerate(tracks):
            # Create background box for text
            bbox_props = dict(
                boxstyle="round,pad=0.5",
                fc="white",
                ec=colors[labels[i]],
                alpha=0.8
            )
            
            # Add text with arrow
            plt.annotate(
                f"{track['name']}\n({track['artist']})",
                (reduced_features[i, 0], reduced_features[i, 1]),
                xytext=(10, 10),
                textcoords='offset points',
                fontsize=9,
                bbox=bbox_props,
                arrowprops=dict(
                    arrowstyle="->",
                    connectionstyle="arc3,rad=0.2",
                    color=colors[labels[i]]
                )
            )

        plt.title(title)
        plt.xlabel('Component 1')
        plt.ylabel('Component 2')
        plt.legend()
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

    def visualize_tag_distribution(self, tracks: List[Dict[str, str]], 
                                 save_path: str = None):
        """Visualize the distribution of tags across clusters"""
        # Get clustering results
        dummy_features = [[0, 0]] * len(tracks)
        clustering_result = match_tracks_to_clusters(dummy_features, tracks)

        # Collect tag frequencies per cluster
        cluster_tags = {}
        for cluster in clustering_result['clusters']:
            tag_counts = {}
            for track in cluster['tracks']:
                tags = get_lastfm_tags(track['artist'], track['name'], self.api_key)
                for tag in tags:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
            cluster_tags[f"Cluster {cluster['id']}\n({cluster['genre']})"] = tag_counts

        # Get top N most common tags across all clusters
        all_tag_counts = {}
        for counts in cluster_tags.values():
            for tag, count in counts.items():
                all_tag_counts[tag] = all_tag_counts.get(tag, 0) + count
        
        top_tags = sorted(all_tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        selected_tags = [tag for tag, _ in top_tags]

        # Create heatmap data
        heatmap_data = np.zeros((len(cluster_tags), len(selected_tags)))
        
        for i, (cluster, counts) in enumerate(cluster_tags.items()):
            for j, tag in enumerate(selected_tags):
                heatmap_data[i, j] = counts.get(tag, 0)

        # Normalize data
        row_sums = heatmap_data.sum(axis=1, keepdims=True)
        heatmap_data = np.divide(heatmap_data, row_sums, 
                               out=np.zeros_like(heatmap_data), 
                               where=row_sums!=0)

        # Create heatmap
        plt.figure(figsize=(12, 6))
        sns.heatmap(heatmap_data, 
                   xticklabels=selected_tags,
                   yticklabels=cluster_tags.keys(),
                   cmap='YlOrRd',
                   annot=True,
                   fmt='.2f',
                   cbar_kws={'label': 'Normalized Frequency'})
        
        plt.title('Top Tags Distribution Across Clusters')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

def main():
    """Example usage of the visualizer"""
    # Sample tracks
    test_tracks = [
        {"name": "Bohemian Rhapsody", "artist": "Queen"},
        {"name": "Stairway to Heaven", "artist": "Led Zeppelin"},
        {"name": "Smells Like Teen Spirit", "artist": "Nirvana"},
        {"name": "Beat It", "artist": "Michael Jackson"},
        {"name": "Sweet Child O' Mine", "artist": "Guns N' Roses"},
        {"name": "Like a Rolling Stone", "artist": "Bob Dylan"},
        {"name": "Yesterday", "artist": "The Beatles"},
        {"name": "Purple Rain", "artist": "Prince"},
        {"name": "Black Dog", "artist": "Led Zeppelin"},
        {"name": "Hotel California", "artist": "Eagles"}
    ]

    visualizer = MatchingVisualizer()
    
    # Create visualizations
    print("Generating cluster visualization...")
    visualizer.visualize_clusters_2d(test_tracks, method='pca', 
                                   save_path='cluster_visualization_pca.png')
    
    print("Generating tag distribution heatmap...")
    visualizer.visualize_tag_distribution(test_tracks, 
                                        save_path='tag_distribution.png')

if __name__ == "__main__":
    main()