class Node
  
  constructor: (value) ->
    @value = value || "default"
    @pointer = null

class LinkedList
  
  constructor: ->
    @length = 0
    @head = null

  append: (node) ->
    if @head is null
      @head = node
    else
      tmp = @head
      tmp = tmp.pointer  while tmp.pointer isnt null
      tmp.pointer = node

  list_values: ->
    values = []
    if @head is null
      return []
    else
      tmp = @head
      values.push tmp.value
      while tmp.pointer isnt null
        tmp = tmp.pointer
        values.push tmp.value
    values
