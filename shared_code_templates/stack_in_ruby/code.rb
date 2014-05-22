class Node

  attr_accessor :nxt, :value

  def initialize(value)
    @value = value
    @nxt = nil
  end

end


class Stack

  attr_reader :head

  def initialize()
    @head = nil 
  end

  def push(value)
    node = Node.new(value)
    if @head != nil
      node.nxt = @head
    end
    @head = node
  end

  def pop
    if @head == nil
      return nil
    else
      old = @head
      @head = @head.nxt
      value = old.value
      # [tag:todo:gem] Need to delete "old"
      return value
    end
  end

end
