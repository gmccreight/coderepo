from code import *

import unittest

class TestLinkedListFunctions(unittest.TestCase):

    def test_no_elements(self):
        ll = linked_list()
        self.assertEqual(ll.length(), 0)

    def test_insert(self):
        ll = linked_list()
        ll.add_node(1)
        ll.add_node(2)
        self.assertEqual(ll.length(), 2)

    def test_inserted_node_when_empty(self):
        ll = linked_list()
        self.assertEqual(ll.get_nth_node(0), None)

    def test_inserted_node_data(self):
        ll = linked_list()
        ll.add_node(1)
        ll.add_node(5)
        ll.add_node(10)
        self.assertEqual(ll.get_nth_node(0).data, 10)
        self.assertEqual(ll.get_nth_node(1).data, 5)
        self.assertEqual(ll.get_nth_node(2).data, 1)
        self.assertEqual(ll.get_nth_node(3), None)

if __name__ == '__main__':
    unittest.main()

#cffileid:15
