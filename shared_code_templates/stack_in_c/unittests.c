#include "code.h"
#include "/check-framework/src/check.h"
#include <stdio.h>

START_TEST (test_create_push_pop_delete)
{
  // Create
  Node **stack;
  fail_unless(create_stack(stack) == true, "the stack was successfully created");

  // Push
  fail_unless( push(stack, 6) == true, "6 was successfully pushed onto the stack");
  fail_unless( (*stack)->value == 6, "the internals are correct");
  fail_unless( push(stack, 10) == true, "10 was successfully pushed onto the stack");
  fail_unless( (*stack)->value == 10, "the internals are correct");

  // Pop
  int popped_value = 0;
  fail_unless(pop(stack, &popped_value) == true, "The first pop succeeded");
  fail_unless(popped_value == 10, "The most recent value");

  fail_unless(pop(stack, &popped_value) == true, "The second pop succeeded");
  fail_unless(popped_value == 6, "The initial value");
  
  fail_unless(pop(stack, &popped_value) == false, "The pop failed because the stack is empty");
  fail_unless(popped_value == 0, "The most recent value is 0");

  // Delete
  fail_unless(delete_stack(stack) == true, "The stack was successfully deleted");

}
END_TEST

Suite * stack_suite (void) {
  Suite *s = suite_create ("Stack");

  TCase *tc_core = tcase_create ("Core");
  tcase_add_test (tc_core, test_create_push_pop_delete);
  suite_add_tcase (s, tc_core);

  return s;
}

int main (void) {
  int number_failed;
  Suite *s = stack_suite ();
  SRunner *sr = srunner_create (s);
  srunner_run_all (sr, CK_NORMAL);
  number_failed = srunner_ntests_failed (sr);
  srunner_free (sr);
  return (number_failed == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}
