package code

type Ele struct {
    Data interface{}
    Next *Ele
}

func (e *Ele) insert(data interface{}) {
    if e == nil {
        panic("attept to modify nil")
    }
    e.Next = &Ele{data, e.Next}
}

//ogfileid:30
