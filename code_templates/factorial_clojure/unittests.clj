;[tag:note:gem] I'm positive that this test could be better using some kind of
;sequence comparison.  Please improve, and also make the code idiomatic as
;well.

(ns this.test.namespace
   (:use clojure.test))

(load-file "./code.clj")

(deftest test-adder
  (is (= 1  (fact 1)))
  (is (= 2  (fact 2)))
  (is (= 6  (fact 3)))
)

(run-tests 'this.test.namespace)

;ogfileid:25
