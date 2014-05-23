#include "code.h"
using namespace std;

int count_nodes(node *tree) {
    if (tree == NULL) {
        return 0;
    }
    return 1 + count_nodes(tree->left) + count_nodes(tree->right);
}

node* bal_tree_add(node *tree, int value) {

    if (tree == NULL) {
        // No tree exists, or went off the bottom
        return new node(value);
    }
    else {
        if (value < tree->value) {
            tree->left = bal_tree_add(tree->left, value);
        }
        else {
            tree->right = bal_tree_add(tree->right, value);
        }
    }
    tree = balance_tree(tree);
    return tree;
}

node* move_left(node *tree) {
    node *r = tree->right;
    node *rl = r->left;
    tree->right = rl;
    r->left = tree;
    set_height(tree);
    set_height(r);
    return r;
}

node* move_right(node *tree) {
    node *l = tree->left;
    node *lr = l->right;
    tree->left = lr;
    l->right = tree;
    set_height(tree);
    set_height(l);
    return l;
}

node* swing_left(node *tree) {

    node *r = tree->right;
    node *rr = r->right;
    node *rl = r->left;
    node *l = tree->left;

    int lh = (l == NULL) ? 0 : l->height;
    int rlh = (rl == NULL) ? 0 : rl->height;
    int rrh = (rr == NULL) ? 0 : rr->height;

    if (rlh > rrh) {
        tree->right = move_right(r);
    }

    return move_left(tree);

}

node* swing_right(node *tree) {

    node *l = tree->left;
    node *lr = l->right;
    node *ll = l->left;
    node *r = tree->right;

    int rh = (l == NULL) ? 0 : l->height;
    int lrh = (lr == NULL) ? 0 : lr->height;
    int llh = (ll == NULL) ? 0 : ll->height;

    if (lrh > llh) {
        tree->left = move_left(l);
    }

    return move_right(tree);

}

node* balance_tree(node *tree) {
    if (tree == NULL) {
        return tree;
    }

    node *l = tree->left;
    int lh = (l == NULL) ? 0 : l->height;
    node *r = tree->right;
    int rh = (r == NULL) ? 0 : r->height;

    if (lh > rh + 1) {
        swing_right(tree);
    }
    else if (rh > lh + 1) {
        swing_left(tree);
    }
    else {
        set_height(tree);
        return tree;
    }
}

void set_height(node *tree) {
    node *l = tree->left;
    int lh = (l == NULL) ? 0 : l->height;
    node *r = tree->right;
    int rh = (r == NULL) ? 0 : r->height;

    //cout << "l: " << lh << "\n";
    //cout << "r: " << rh << "\n";

    tree->height = (rh > lh) ? rh + 1 : lh + 1;
}

node* bal_tree_find(node *tree, int value) {
    while (tree != NULL) {
        if (value == tree->value) {
            return tree;
        }
        else if (value < tree->value) {
            tree = tree->left;
        }
        else {
            tree = tree->right;
        }
    }
    return NULL;
}

// Give this function a tree and an empty node pointer vector, it
// will fill the vector with the values in the tree.
void bal_tree_traverse(node *tree, std::vector<node*> & vec) {

    if (tree == NULL) {
        return;
    }
    else {
        if (tree->left != NULL) {
            bal_tree_traverse(tree->left, vec);
        }
        vec.push_back(tree);
        if (tree->right != NULL) {
            bal_tree_traverse(tree->right, vec);
        }
    }
}
