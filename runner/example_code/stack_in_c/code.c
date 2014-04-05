#include "code.h"

bool create_stack(Node **stack) {
    *stack = NULL;
    return true;
}

bool push(Node **stack_ptr_ptr, int value) {

    Node *newnode;
    newnode = (Node *) malloc(sizeof(Node));
    if (newnode == NULL) {
        // The memory allocation failed
        return false;
    }

    newnode->value = value;

    if (stack_ptr_ptr == NULL) {
        *stack_ptr_ptr = newnode;
    }
    else {
        newnode->nxt = *stack_ptr_ptr;
        *stack_ptr_ptr = newnode;
    }

    return true;
}

bool pop(Node **stack_ptr_ptr, int *value) {
    Node *node_ptr;
    if (!(node_ptr = *stack_ptr_ptr)) {
        *value = 0;
        return false;
    }

    *value = node_ptr->value;
    *stack_ptr_ptr = node_ptr->nxt;
    free(node_ptr);
    return true;
}

bool delete_stack(Node **stack) {

    Node *next;
    while(*stack) {
        next = (*stack)->nxt;
        free(*stack);
        *stack = next;
    }

    return true;
}
//ogfileid:16
