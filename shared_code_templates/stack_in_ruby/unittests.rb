require 'test/unit'

require_relative "./code.rb"

class TC_Stack < Test::Unit::TestCase

  def test_stack_push_pop
    stack = Stack.new()

    # Push one thing onto the stack, then pop it off
    assert_equal nil, stack.head()
    assert_equal nil, stack.pop()
    stack.push(5)
    assert_equal 5, stack.pop()
    assert_equal nil, stack.pop()

    # Push multiple things onto the stack, then pop them off
    assert_equal nil, stack.pop()
    stack.push(10)
    stack.push(20)
    stack.push(30)
    assert_equal 30, stack.pop()
    assert_equal 20, stack.pop()
    assert_equal 10, stack.pop()
    assert_equal nil, stack.pop()
  end

end
