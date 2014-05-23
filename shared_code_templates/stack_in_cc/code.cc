#include "code.h"

Stack::Stack() {
    head = NULL;
    return;
}

Stack::~Stack() {
    while (head) {
        Node *next = head->nxt;
        delete head;
        head = next;
    }
    return;
}

void Stack::push(int value) {
    Node *node = new Node;
    node->value = value;
    node->nxt = head;
    head = node;
    return;
}

int Stack::pop() {
    Node *popNode = head;
    if (head == NULL) {
        //[tag:todo:gem]
        //throw StackError(E_EMPTY);
        throw "stack is empty";
    }

    int value = head->value;
    head = head->nxt;
    delete popNode;
    return value;
}

//ogfileid:19
