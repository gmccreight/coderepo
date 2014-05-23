#include "code.h"

// [tag:ptr_to_ptr:gem] See also the stack_cc for [tag:ref_to_ptr:gem] usage
void append_node(node **list, int value) {
    node *newnode = new node(value);

    if (*list == NULL) {
        *list = newnode;
    }
    else {
        node *temp = *list;
        while (temp->nxt != NULL) {
            temp = temp->nxt;
        }
        temp->nxt = newnode;
    }
}

bool insert_node(node **list, node *insert_after, node *newnode) {
    if (*list == NULL) {
        return false;
    }
    else {
        node *temp = *list;
        while (temp != NULL) {
            if (temp == insert_after) {
                node *after_splice = temp->nxt;
                temp->nxt = newnode;
                newnode->nxt = after_splice;
                return true;
            }
            temp = temp->nxt;
        }
        return false;
    }

}

int count_nodes(node **list) {
    node *temp = *list;
    if (temp == NULL) {
        return 0;
    }
    else {
        int counter = 0;
        while (temp != NULL) {
            counter++;
            temp = temp->nxt;
        }
        return counter;
    }
}

void delete_all_nodes(node **list) {
    node *temp, *to_delete;
    if (*list == NULL) {
        return;
    }
    temp = *list;
    while(temp->nxt != NULL) {
        to_delete = temp;
        temp = temp->nxt;
        delete to_delete;
    }
    delete temp;
    *list = NULL;
}
//ogfileid:6
