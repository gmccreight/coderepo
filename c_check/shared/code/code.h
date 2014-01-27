#ifndef CS_CODE_
#define CS_CODE_

#include <stdlib.h>
#include <stdbool.h>

typedef struct Node
{
    struct Node *nxt;
    int value;
} Node;

bool create_stack(Node **stack);
bool push(Node **stack, int value);
bool pop(Node **stack, int *value);
bool delete_stack(Node **stack);

#endif  // CS_CODE_

//ogfileid:17
