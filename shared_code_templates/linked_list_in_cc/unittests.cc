#include "code.h"
#include <gtest/gtest.h>

TEST(NodesTestGrouping, AppendSomeNodes) {
  node *list = NULL;
  EXPECT_EQ(0, count_nodes(&list));
  append_node(&list, 4);
  EXPECT_EQ(1, count_nodes(&list));
  append_node(&list, 3);
  EXPECT_EQ(2, count_nodes(&list));
}

TEST(NodesTestGrouping, InsertNode) {
  node *list = NULL;
  EXPECT_EQ(0, count_nodes(&list));

  // Cannot insert because the "list" pointer in the "insert_after" points to a
  // null value.
  EXPECT_EQ(false, insert_node(&list, list, new node(4)));

  // Insert the first one at the non-existent head
  append_node(&list, 1);

  // Insert another one after the head
  EXPECT_EQ(true, insert_node(&list, list, new node(4)));
  EXPECT_EQ(2, count_nodes(&list));

  // Insert another one after the head
  EXPECT_EQ(true, insert_node(&list, list, new node(2)));
  EXPECT_EQ(3, count_nodes(&list));

  EXPECT_EQ(1, list->value);
  EXPECT_EQ(2, list->nxt->value);
  EXPECT_EQ(4, list->nxt->nxt->value);
  EXPECT_EQ(NULL, list->nxt->nxt->nxt);

  // Now, insert a 3 right after the 2, to fill in the gap
  EXPECT_EQ(true, insert_node(&list, list->nxt, new node(3)));
  EXPECT_EQ(4, count_nodes(&list));

  EXPECT_EQ(1, list->value);
  EXPECT_EQ(2, list->nxt->value);
  EXPECT_EQ(3, list->nxt->nxt->value); // Newly inserted
  EXPECT_EQ(4, list->nxt->nxt->nxt->value);
  EXPECT_EQ(NULL, list->nxt->nxt->nxt->nxt);

  // Finally, insert one at the end of the list
  EXPECT_EQ(true, insert_node(&list, list->nxt->nxt->nxt, new node(5)));
  EXPECT_EQ(5, count_nodes(&list));

  EXPECT_EQ(1, list->value);
  EXPECT_EQ(2, list->nxt->value);
  EXPECT_EQ(3, list->nxt->nxt->value);
  EXPECT_EQ(4, list->nxt->nxt->nxt->value);
  EXPECT_EQ(5, list->nxt->nxt->nxt->nxt->value); // Newly inserted
  EXPECT_EQ(NULL, list->nxt->nxt->nxt->nxt->nxt);

}

TEST(NodesTestGrouping, DeleteAllNodes) {
  node *list = NULL;
  EXPECT_EQ(0, count_nodes(&list));
  append_node(&list, 4);
  EXPECT_EQ(1, count_nodes(&list));
  append_node(&list, 3);
  EXPECT_EQ(2, count_nodes(&list));
  delete_all_nodes(&list);
  EXPECT_EQ(0, count_nodes(&list));
}

TEST(NodesTestGrouping, DeleteAllNodesEmptyList) {
  node *list = NULL;
  EXPECT_EQ(0, count_nodes(&list));
  delete_all_nodes(&list);
  EXPECT_EQ(0, count_nodes(&list));
}

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

//ogfileid:8
