#ifndef CS_CODE_
#define CS_CODE_

#include <iostream>

//#define E_EMPTY "the stack is empty"

class Stack {
    public:
        Stack();
        ~Stack();
        void push (int value);
        int pop();
    protected:
        typedef struct Node {
            struct Node *nxt;
            int value;
        } Node;

    Node *head;
};

#endif  // CS_CODE_

//ogfileid:20
