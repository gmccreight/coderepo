class node:
    def __init__(self):
        self.data = None # contains the data
        self.next = None # contains the reference to the next node

class linked_list:
    def __init__(self):
        self.cur_node = None

    def add_node(self, data):
        new_node = node() # create a new node
        new_node.data = data
        new_node.next = self.cur_node # link the new node to the 'previous' node.
        self.cur_node = new_node #  set the current node to the new one.

    def get_nth_node(self, nth):
        node = self.cur_node
        counter = 0
        while node:
            if counter == nth:
                return node
            counter += 1
            node = node.next
        return None

    def length(self):
        node = self.cur_node
        length = 0
        while node:
            length += 1
            node = node.next
        return length
