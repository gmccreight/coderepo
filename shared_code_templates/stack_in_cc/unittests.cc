#include "code.h"
#include <gtest/gtest.h>

TEST(StackTestGrouping, PushAndPop) {
    Stack *stack = new Stack;

    // Trying to pop off of an empty list causes an exception.
    try {
        stack->pop();
        FAIL() << "The pop should have thrown an exception";
    }
    catch (...) {
        //[tag:todo:gem]: rather than using a catchall, it would be great to
        //actually catch the particular type of exception.
        //[tag:todo:gem]: This failure is tested below, too.  Potentially refactor.
        SUCCEED() << "An exception was thrown, as expected.";
    }

    stack->push(4);
    EXPECT_EQ(4, stack->pop());

    stack->push(6);
    stack->push(7);
    EXPECT_EQ(7, stack->pop());
    EXPECT_EQ(6, stack->pop());

    // Trying to pop off of an empty list causes an exception.
    try {
        stack->pop();
        FAIL() << "The pop should have thrown an exception";
    }
    catch (...) {
        //[tag:todo:gem]: rather than using a catchall, it would be great to
        //actually catch the particular type of exception.
        SUCCEED() << "An exception was thrown, as expected.";
    }

    //[tag:todo:gem] we should somehow test the destructor, too
}

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}

//ogfileid:21
