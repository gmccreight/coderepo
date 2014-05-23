#ifndef CS_CODE_
#define CS_CODE_

#include <iostream>
#include <vector> // Used to check the traverse values of the tree
#include <string> // Used to create a pretty printed version of the tree

struct node
{
    int value;
    node *left;
    node *right;
    int height;

    node(int x) {
        value = x;
        left = NULL;
        right = NULL;
        height = 1;
    }
};

int count_nodes(node *tree);
node* bal_tree_add(node *tree, int value);
node* bal_tree_find(node *tree, int value);
node* move_left(node *tree);
node* move_right(node *tree);
node* swing_right(node * tree);
node* swing_left(node * tree);
node* balance_tree(node *tree);
void set_height(node *tree);
void bal_tree_traverse(node *tree, std::vector<node*> & vec);

#endif  // CS_CODE_
//ogfileid:4
