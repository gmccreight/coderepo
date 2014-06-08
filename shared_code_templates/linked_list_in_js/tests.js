describe("Node", function() {

  it("should set a default value on a node", function() {
    var node = new Node();
    expect(node.value).toEqual("default");
  });

  it("should be able to set a value on the node during creation", function() {
    var node = new Node("defined value");
    expect(node.value).toEqual("defined value");
  });

});

describe("LinkedList", function() {
  var linked_list;

  beforeEach(function() {
    linked_list = new LinkedList();
  });

  it("should have a length of 0 by default", function() {
    expect(linked_list.list_values().length).toEqual(0);
  });

  it("should be able to add some nodes", function() {
    linked_list.append(new Node("foo"));
    linked_list.append(new Node("bar"));
    linked_list.append(new Node("baz"));
    expect(linked_list.list_values().length).toEqual(3);
    expect(linked_list.list_values()[0]).toEqual("foo");
    expect(linked_list.list_values()[1]).toEqual("bar");
    expect(linked_list.list_values()[2]).toEqual("baz");
  });

});
