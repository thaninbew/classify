import unittest
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.matching_algo.test_matching import TestMatchingAlgorithm

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False) 