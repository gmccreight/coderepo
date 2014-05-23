#include "code.h"
#include <gtest/gtest.h>

#include <sstream> //required by the itos function below

std::string itos(int i) // convert int to string
{
    std::stringstream s;
    s << i;
    return s.str();
}

// Traverse returns a vector of node pointers
// that can be pretty printed into a string by this function
std::string vector_pretty_print(std::vector<node*>& vec) {

    std::string results = "\n";
    int vec_size = vec.size();
    for (int x = 0; x < vec_size; x++) {
        node *tree = vec[x];
        for (int y = 0; y < tree->height; y++) {
            results.append("    ");
        }
        results.append(itos(tree->value));
        results.append("\n");
    }
    return results;
}

TEST(BinaryTreeTestGrouping, CountTree) {
    // Build a tree manually counting the nodes while it's created
    node *tree = new node(4);
    EXPECT_EQ(1, count_nodes(tree));

    tree->left = new node(2);
    EXPECT_EQ(2, count_nodes(tree));

    tree->right = new node(6);
    EXPECT_EQ(3, count_nodes(tree));

    tree->right->left = new node(5);
    tree->right->right = new node(7);
    EXPECT_EQ(5, count_nodes(tree));

}

TEST(BinaryTreeTestGrouping, BalTreeAdd) {
    node *tree = bal_tree_add(NULL, 4);
    EXPECT_EQ(1, count_nodes(tree));
    EXPECT_EQ(1, tree->height);

    tree = bal_tree_add(tree, 6);
    EXPECT_EQ(2, count_nodes(tree));
    EXPECT_EQ(2, tree->height);

    tree = bal_tree_add(tree, 2);
    EXPECT_EQ(3, count_nodes(tree));
    EXPECT_EQ(2, tree->height);

    // These will be added to the left side.
    // The tree height will raise to 3.
    tree = bal_tree_add(tree, 10);
    tree = bal_tree_add(tree, 12);
    EXPECT_EQ(3, tree->height);

    // These will add to the right side.
    // The tree's height will stay the same.
    tree = bal_tree_add(tree, 1);
    tree = bal_tree_add(tree, 3);
    EXPECT_EQ(3, tree->height);

    // The tree is full and balanced.
    // Adding one more element will increase the tree height.
    tree = bal_tree_add(tree, 5);
    EXPECT_EQ(4, tree->height);
}

TEST(BinaryTreeTestGrouping, BalTreeFind) {
    node *tree = bal_tree_add(NULL, 4);
    EXPECT_EQ(1, count_nodes(tree));

    tree = bal_tree_add(tree, 6);
    EXPECT_EQ(2, count_nodes(tree));

    tree = bal_tree_add(tree, 2);
    EXPECT_EQ(3, count_nodes(tree));

    EXPECT_EQ(6, bal_tree_find(tree, 6)->value);
    EXPECT_EQ(NULL, bal_tree_find(tree, 10));

}

TEST(BinaryTreeTestGrouping, SimpleBalTreeTraverse) {
    node *tree = bal_tree_add(NULL, 4);
    tree = bal_tree_add(tree, 6);
    tree = bal_tree_add(tree, 2);
    tree = bal_tree_add(tree, 10);
    tree = bal_tree_add(tree, 12);
    tree = bal_tree_add(tree, 8);

    std::vector<node*> vec;
    bal_tree_traverse(tree, vec);

    std::string expected = "\n";
    expected.append("    2\n");
    expected.append("        4\n");
    expected.append("            6\n");
    expected.append("    8\n");
    expected.append("        10\n");
    expected.append("    12\n");

    std::string results = vector_pretty_print(vec);

    EXPECT_EQ(expected, results);
}

TEST(BinaryTreeTestGrouping, ComplexBalTreeTraverse) {
    node *tree = bal_tree_add(NULL, 4);
    tree = bal_tree_add(tree, 6);
    tree = bal_tree_add(tree, 2);
    tree = bal_tree_add(tree, 10);
    tree = bal_tree_add(tree, 12);
    tree = bal_tree_add(tree, 8);
    // Here's where it deviates from the SimpleBalTreeTraverse function
    tree = bal_tree_add(tree, 5);
    tree = bal_tree_add(tree, 14);
    tree = bal_tree_add(tree, 11);

    std::vector<node*> vec;
    bal_tree_traverse(tree, vec);

    std::string expected = "\n";
    expected.append("    2\n");
    expected.append("        4\n");
    expected.append("    5\n");
    expected.append("                6\n");
    expected.append("    8\n");
    expected.append("            10\n");
    expected.append("    11\n");
    expected.append("        12\n");
    expected.append("    14\n");

    std::string results = vector_pretty_print(vec);

    EXPECT_EQ(expected, results);
}

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

//ogfileid:5
