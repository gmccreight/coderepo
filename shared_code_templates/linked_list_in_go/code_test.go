package code

import "testing"

func TestInsertElement(t *testing.T) {

  h := &Ele{"A", nil}
  if h.Data != "A" {
    t.Errorf("data should be A but was %v", h.Data)
  }

  h.insert("B")
  if h.Next.Data != "B" {
    t.Errorf("data should be B but was %v", h.Next.Data)
  }

  h.Next.insert("C")
  if h.Next.Next.Data != "C" {
    t.Errorf("data should be C but was %v", h.Next.Next.Data)
  }

}

//cffileid:31
