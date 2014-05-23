#ifndef CS_CODE_
#define CS_CODE_

#include <iostream>

struct node
{
    int value;
    node *nxt;        // Pointer to next node

    node(int x) {
        value = x;
        nxt = NULL;
    }
};

void append_node(node **list, int value);
bool insert_node(node **list, node *dest, node *newnode);
int count_nodes(node **list);
void delete_all_nodes(node **list);

#endif  // CS_CODE_
//ogfileid:7
