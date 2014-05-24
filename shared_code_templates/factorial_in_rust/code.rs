fn factorial(value: int) -> int {
  if value == 0 {
    return 1;
  }
  else {
    return value * factorial(value-1);
  }
}

#[test]
fn test_factorial() {
  assert!(factorial(0) == 1)
  assert!(factorial(1) == 1)
  assert!(factorial(2) == 2)
  assert!(factorial(3) == 6)
  assert!(factorial(4) == 24)
}
