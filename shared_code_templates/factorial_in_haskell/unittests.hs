import Code

import Test.HUnit

test0 = TestCase (assertEqual "factorial for 0" (1) (fac 0))
test1 = TestCase (assertEqual "factorial for 1" (1) (fac 1))
test2 = TestCase (assertEqual "factorial for 2" (2) (fac 2))
test3 = TestCase (assertEqual "factorial for 3" (6) (fac 3))
test4 = TestCase (assertEqual "factorial for 4" (24) (fac 4))
test5 = TestCase (assertEqual "factorial for 5" (120) (fac 5))

main = runTestTT $ TestList [test0, test1, test2, test3, test4, test5]
