const axios = require('axios');
const dotenv = require('dotenv').config();

// Base URL of your backend
const BASE_URL = 'http://localhost:3001';

// Sample test data
const sampleTracks = [
    {
        name: "Test Pop Song",
        artists: "Pop Artist",
        genres: ["Pop", "Dance"],
        features: {
            danceability: 0.8,
            energy: 0.7,
            valence: 0.6,
            tempo: 120,
            acousticness: 0.2
        }
    },
    {
        name: "Rock Anthem",
        artists: "Rock Band",
        genres: ["Rock", "Alternative"],
        features: {
            danceability: 0.4,
            energy: 0.9,
            valence: 0.5,
            tempo: 140,
            acousticness: 0.1
        }
    },
    {
        name: "Classical Piece",
        artists: "Orchestra",
        genres: ["Classical"],
        features: {
            danceability: 0.2,
            energy: 0.3,
            valence: 0.4,
            tempo: 90,
            acousticness: 0.9
        }
    }
];

// Mock clustering response based on features
const mockClusteringResponse = (tracks) => {
    // Simple logic to group tracks based on energy levels
    const clusters = {
        high: {
            id: 0,
            genre: "Energetic",
            tracks: []
        },
        low: {
            id: 1,
            genre: "Calm",
            tracks: []
        }
    };

    tracks.forEach(track => {
        if (track.features.energy > 0.5) {
            clusters.high.tracks.push({
                name: track.name,
                artist: track.artists,
                genres: track.genres
            });
        } else {
            clusters.low.tracks.push({
                name: track.name,
                artist: track.artists,
                genres: track.genres
            });
        }
    });

    return {
        clusters: [
            clusters.high,
            clusters.low
        ].filter(cluster => cluster.tracks.length > 0)
    };
};

const testClusteringLogic = async () => {
    console.log('\n=== Testing Clustering Logic ===');
    
    try {
        // Mock the clustering process
        const result = mockClusteringResponse(sampleTracks);
        
        // Print results
        console.log('\nClustering Results:');
        result.clusters.forEach(cluster => {
            console.log(`\nCluster ${cluster.id} (${cluster.genre}):`);
            cluster.tracks.forEach(track => {
                console.log(`  - ${track.name} by ${track.artist}`);
                console.log(`    Genres: ${track.genres.join(', ')}`);
            });
        });

        // Perform some basic validation
        const validationErrors = [];
        
        // Check if we have clusters
        if (!result.clusters || result.clusters.length === 0) {
            validationErrors.push('No clusters were created');
        }

        // Check if all tracks were assigned to clusters
        const totalTracksInClusters = result.clusters.reduce(
            (sum, cluster) => sum + cluster.tracks.length, 
            0
        );
        if (totalTracksInClusters !== sampleTracks.length) {
            validationErrors.push('Not all tracks were assigned to clusters');
        }

        // Check if each cluster has the required properties
        result.clusters.forEach((cluster, index) => {
            if (!cluster.hasOwnProperty('id')) validationErrors.push(`Cluster ${index} missing 'id'`);
            if (!cluster.hasOwnProperty('genre')) validationErrors.push(`Cluster ${index} missing 'genre'`);
            if (!cluster.hasOwnProperty('tracks')) validationErrors.push(`Cluster ${index} missing 'tracks'`);
        });

        if (validationErrors.length > 0) {
            console.log('\nValidation Errors:');
            validationErrors.forEach(error => console.log(` - ${error}`));
            return false;
        }

        return true;
    } catch (error) {
        console.error('\nError in clustering test:', error.message);
        return false;
    }
};

// Test feature extraction logic
const testFeatureExtraction = () => {
    console.log('\n=== Testing Feature Extraction ===');
    
    try {
        // Extract features from sample tracks
        const features = sampleTracks.map(track => ({
            danceability: track.features.danceability,
            energy: track.features.energy,
            valence: track.features.valence,
            normalizedTempo: track.features.tempo / 200,
            acousticness: track.features.acousticness
        }));

        // Validate features
        const validationErrors = [];
        features.forEach((feature, index) => {
            if (feature.danceability < 0 || feature.danceability > 1) {
                validationErrors.push(`Track ${index}: Invalid danceability value`);
            }
            if (feature.energy < 0 || feature.energy > 1) {
                validationErrors.push(`Track ${index}: Invalid energy value`);
            }
            if (feature.valence < 0 || feature.valence > 1) {
                validationErrors.push(`Track ${index}: Invalid valence value`);
            }
        });

        if (validationErrors.length > 0) {
            console.log('\nFeature Validation Errors:');
            validationErrors.forEach(error => console.log(` - ${error}`));
            return false;
        }

        console.log('Feature extraction successful');
        console.log('Sample features:', JSON.stringify(features[0], null, 2));
        return true;
    } catch (error) {
        console.error('\nError in feature extraction test:', error.message);
        return false;
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('Starting clustering tests...\n');
    
    // Test 1: Feature Extraction
    const featureTestResult = testFeatureExtraction();
    console.log('\nFeature extraction test:', featureTestResult ? 'PASSED' : 'FAILED');

    // Test 2: Clustering Logic
    const clusteringTestResult = await testClusteringLogic();
    console.log('\nClustering logic test:', clusteringTestResult ? 'PASSED' : 'FAILED');

    // Overall test result
    const allTestsPassed = featureTestResult && clusteringTestResult;
    console.log('\n=== Test Summary ===');
    console.log(`All tests ${allTestsPassed ? 'PASSED' : 'FAILED'}`);
};

// Run the tests
runAllTests().catch(console.error);
