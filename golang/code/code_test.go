package code

import "testing"

func TestInsertElement(t *testing.T) {
  h := &Ele{"A", &Ele{"B", nil}}
  h.insert("C")
}

//ogfileid:31
