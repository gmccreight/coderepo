from code import *

import unittest

class TestKMPFunctions(unittest.TestCase):

    def test_fail_table_with_no_repeated_characters(self):
        self.assertEqual(failTable("ababcac"), [None, 0, 0, 1, 2, 0, 1, 0])

    def test_fail_table_with_en_present_three_times(self):
        self.assertEqual(failTable("enlightenment"), [None, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0])

    def test_fail_table_with_in_present_three_times(self):
        self.assertEqual(failTable("pinpointing"), [None, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0])

    def test_word_doubled(self):
        self.assertEqual(failTable("hotshots"), [None, 0, 0, 0, 0, 1, 2, 3, 4])

    def test_fail_table_unde_repeated_but_not_anchored_at_end_of_string(self):
        self.assertEqual(failTable("underfunded"), [None, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0])

    def test_fail_table_with_some_repeated_characters(self):
        self.assertEqual(failTable("george"), [None, 0, 0, 0, 0, 1, 2])

    def test_match_at_beginning_of_string(self):
        self.assertEqual(kmpMatch("george", "george likes geocaching"), 0)

        #cfinstrument_start
        matchlist = [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5]]
        self.assertEqual(match_index_instrument, matchlist) #cfinstrument
        #cfinstrument_end

    def test_match_with_failures(self):

        #                         14       23   28       37
        #                         |__      |    |____    |_____
        haystack = "she mentioned geocaching to georgian george"
        #                                           |
        #                                           32, but implicitly matched
        #                                               by failTable so not in
        #                                               match list

        self.assertEqual(kmpMatch("george", haystack), 37)

        #cfinstrument_start
        matchlist = [
            [14,0], [14,1], [14,2],
            [23,0],
            [28,0], [28,1], [28,2], [28,3], [28,4],
            [37,0], [37,1], [37,2], [37,3], [37,4], [37,5]
        ]
        self.assertEqual(match_index_instrument, matchlist)

        faillist = [
            [14, 3], [17, 0],
            [23, 1], [24, 0],
            [28, 5], [32, 1],
            [32, 1], [33, 0]
        ]
        self.assertEqual(fail_instrument, faillist)
        #cfinstrument_end

if __name__ == '__main__':
    unittest.main()

#cffileid:36
