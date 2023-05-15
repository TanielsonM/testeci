resource "aws_security_group" "lb" {
  description = "Load Balancer"
  name        = "Load Balancer"
  tags = {
    Name        = "Load Balancer"
    Environment = var.environment
  }
  vpc_id = module.vpc.vpc_id
}

# resource "aws_security_group_rule" "ig_lb_http" {
#   security_group_id = aws_security_group.lb.id
#   type              = "ingress"
#   cidr_blocks = [
#     "0.0.0.0/0"
#   ]
#   description = "HTTP"
#   from_port   = 80
#   protocol    = "tcp"
#   to_port     = 80
# }

resource "aws_security_group_rule" "ig_lb_https" {
  security_group_id = aws_security_group.lb.id
  type              = "ingress"
  cidr_blocks = [
    "0.0.0.0/0"
  ]
  description = "HTTPS"
  from_port   = 443
  protocol    = "tcp"
  to_port     = 443
}

resource "aws_security_group_rule" "eg_lb_http" {
  security_group_id        = aws_security_group.lb.id
  type                     = "egress"
  source_security_group_id = aws_security_group.internal.id
  description              = "HTTP"
  from_port                = 3000
  protocol                 = "TCP"
  to_port                  = 3000
}
