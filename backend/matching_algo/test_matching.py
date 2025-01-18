import unittest
import os
import numpy as np
from dotenv import load_dotenv
from matching_algo.matching import (
    get_lastfm_tags,
    create_feature_vector,
    build_tag_vocabulary,
    get_base_genre,
    merge_similar_clusters,
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

    def test_base_genre_detection(self):
        """Test base genre detection from tags"""
        test_cases = [
            (['classic rock', 'hard rock', '70s'], 'rock'),
            (['pop', 'dance', 'electronic'], 'pop'),
            (['hip hop', 'rap', '90s'], 'hip hop'),
            (['classical', 'orchestra'], 'classical'),
            (['unknown tag'], 'unclassified')  # Changed from 'other' to 'unclassified'
        ]
        
        for tags, expected_genre in test_cases:
            self.assertEqual(get_base_genre(tags), expected_genre)

    def test_cluster_merging(self):
        """Test merging of similar clusters"""
        test_clusters = [
            {
                'id': 0,
                'genre': 'rock',
                'tags': ['rock', 'classic rock'],
                'tracks': [{'name': 'Track1', 'artist': 'Artist1', 'tags': ['rock', 'classic rock']}]
            },
            {
                'id': 1,
                'genre': 'pop',
                'tags': ['pop', 'dance'],
                'tracks': [{'name': 'Track2', 'artist': 'Artist2', 'tags': ['pop', 'dance']}]
            },
            {
                'id': 2,
                'genre': 'rock',
                'tags': ['rock', 'hard rock'],
                'tracks': [{'name': 'Track3', 'artist': 'Artist3', 'tags': ['rock', 'hard rock']}]
            }
        ]
        
        merged = merge_similar_clusters(test_clusters)
        # Should merge the two rock clusters
        self.assertEqual(len(merged), 2)
        genres = [cluster['genre'] for cluster in merged]
        self.assertEqual(len(set(genres)), len(genres))
        self.assertIn('rock', genres)
        self.assertIn('pop', genres)

    def test_clustering_basic(self):
        """Test basic clustering functionality"""
        dummy_features = [[1, 1], [1, 2], [2, 1], [2, 2], [3, 3]]
        test_tracks = [
            {"name": "Rock Song", "artist": "Rock Band", "tags": ["rock"]},
            {"name": "Pop Song", "artist": "Pop Artist", "tags": ["pop"]},
            {"name": "Another Rock", "artist": "Rock Band 2", "tags": ["rock"]},
            {"name": "Jazz Tune", "artist": "Jazz Band", "tags": ["jazz"]},
            {"name": "Classical Piece", "artist": "Orchestra", "tags": ["classical"]}
        ]
        
        result = match_tracks_to_clusters(dummy_features, test_tracks)
        
        self.assertIsInstance(result, dict)
        self.assertIn('clusters', result)
        
        # Get unique genres from clusters
        genres = [cluster['genre'] for cluster in result['clusters']]
        self.assertEqual(len(set(genres)), len(genres),
                        "Should not have duplicate genres after merging")

    def test_small_dataset(self):
        """Test handling of very small datasets"""
        small_tracks = [{"name": "Song", "artist": "Artist", "tags": ["rock"]}]
        dummy_features = [[1, 1]]
        
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
        
        # Test with malformed track data
        malformed_tracks = [{"name": "Invalid Song"}]  # Missing artist
        dummy_features = [[1, 1]]
        
        # Should handle missing artist gracefully
        result_malformed = match_tracks_to_clusters(dummy_features, malformed_tracks)
        self.assertIsInstance(result_malformed, dict)
        self.assertIn('clusters', result_malformed)
        self.assertEqual(len(result_malformed['clusters']), 1)
        self.assertEqual(result_malformed['clusters'][0]['genre'], 'unclassified')

def run_tests():
    """Run the test suite"""
    print("\n=== Running Matching Algorithm Tests ===\n")
    unittest.main(verbosity=2, argv=['dummy'])

if __name__ == '__main__':
    run_tests()