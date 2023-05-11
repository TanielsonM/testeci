resource "aws_eip" "outbound" {
  count = 1
  vpc   = true
}
