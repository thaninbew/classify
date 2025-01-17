import unittest
import os
import numpy as np
from dotenv import load_dotenv
from matching_algo.matching import (
    get_lastfm_tags,
    create_feature_vector,
    build_tag_vocabulary,
    match_tracks_to_clusters
)

class TestMatchingAlgorithm(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        load_dotenv()
        cls.api_key = os.getenv('LASTFM_API_KEY')
        if not cls.api_key:
            raise ValueError("LASTFM_API_KEY not found in environment variables")
        
        # Test data
        cls.test_tracks = [
            {"name": "Bohemian Rhapsody", "artist": "Queen"},
            {"name": "Stairway to Heaven", "artist": "Led Zeppelin"},
            {"name": "Smells Like Teen Spirit", "artist": "Nirvana"},
            {"name": "Beat It", "artist": "Michael Jackson"},
            {"name": "Sweet Child O' Mine", "artist": "Guns N' Roses"}
        ]

    def test_lastfm_tag_fetching(self):
        """Test fetching tags from Last.fm"""
        track = self.test_tracks[0]
        tags = get_lastfm_tags(track['artist'], track['name'], self.api_key)
        
        self.assertIsInstance(tags, list)
        self.assertTrue(len(tags) > 0, "Should get at least one tag")
        self.assertTrue(all(isinstance(tag, str) for tag in tags))

    def test_tag_vocabulary_building(self):
        """Test building tag vocabulary"""
        test_tags = [
            ['rock', 'classic rock', 'hard rock'],
            ['pop', 'dance', '80s'],
            ['rock', 'grunge', 'alternative']
        ]
        
        vocabulary = build_tag_vocabulary(test_tags)
        
        self.assertIsInstance(vocabulary, dict)
        unique_tags = set(tag.lower() for tags in test_tags for tag in tags)
        self.assertEqual(len(vocabulary), len(unique_tags))
        self.assertTrue(all(isinstance(idx, int) for idx in vocabulary.values()))

    def test_feature_vector_creation(self):
        """Test creating feature vectors from tags"""
        tags = ['rock', 'classic rock']
        vocabulary = {'rock': 0, 'classic rock': 1, 'pop': 2}
        
        vector = create_feature_vector(tags, vocabulary)
        
        self.assertIsInstance(vector, np.ndarray)
        self.assertEqual(len(vector), 3)
        self.assertEqual(vector[0], 1)  # rock
        self.assertEqual(vector[1], 1)  # classic rock
        self.assertEqual(vector[2], 0)  # pop

    def test_clustering_basic(self):
        """Test basic clustering functionality"""
        dummy_features = [[1, 1], [1, 2], [2, 1], [2, 2], [3, 3]]
        
        result = match_tracks_to_clusters(dummy_features, self.test_tracks)
        
        self.assertIsInstance(result, dict)
        self.assertIn('clusters', result)
        self.assertTrue(len(result['clusters']) >= 1)
        
        for cluster in result['clusters']:
            self.assertIn('id', cluster)
            self.assertIn('genre', cluster)
            self.assertIn('tags', cluster)
            self.assertIn('tracks', cluster)
            self.assertIsInstance(cluster['tracks'], list)

    def test_small_dataset(self):
        """Test handling of very small datasets"""
        small_tracks = self.test_tracks[:2]
        dummy_features = [[1, 1], [1, 2]]
        
        result = match_tracks_to_clusters(dummy_features, small_tracks)
        
        self.assertIsInstance(result, dict)
        self.assertIn('clusters', result)
        self.assertEqual(len(result['clusters']), 1)
        self.assertEqual(result['silhouette_score'], None)

    def test_error_handling(self):
        """Test error handling for invalid inputs"""
        # Test with empty input
        result_empty = match_tracks_to_clusters([], [])
        self.assertIsInstance(result_empty, dict)
        self.assertEqual(len(result_empty['clusters']), 0)
        
        # Test with malformed track data (missing artist)
        malformed_tracks = [{"name": "Invalid Song"}]
        dummy_features = [[1, 1]]
        result_malformed = match_tracks_to_clusters(dummy_features, malformed_tracks)
        self.assertIsInstance(result_malformed, dict)
        self.assertIn('clusters', result_malformed)
        self.assertEqual(result_malformed['clusters'][0]['genre'], 'unclassified')
        self.assertEqual(len(result_malformed['clusters'][0]['tags']), 0)
        
        # Test with malformed track data (missing name)
        malformed_tracks2 = [{"artist": "Unknown Artist"}]
        result_malformed2 = match_tracks_to_clusters(dummy_features, malformed_tracks2)
        self.assertIsInstance(result_malformed2, dict)
        self.assertIn('clusters', result_malformed2)
        self.assertEqual(result_malformed2['clusters'][0]['genre'], 'unclassified')
        self.assertEqual(len(result_malformed2['clusters'][0]['tags']), 0)

    def test_cluster_metrics(self):
        """Test that clustering metrics are calculated correctly"""
        dummy_features = [[1, 1], [1, 2], [2, 1], [2, 2], [3, 3]]
        result = match_tracks_to_clusters(dummy_features, self.test_tracks)
        
        if len(self.test_tracks) > 2:
            self.assertIn('silhouette_score', result)
            self.assertIn('davies_bouldin', result)
            self.assertIn('calinski_harabasz', result)

def run_tests():
    """Run the test suite"""
    print("\n=== Running Matching Algorithm Tests ===\n")
    unittest.main(verbosity=2, argv=['dummy'])

if __name__ == '__main__':
    run_tests()