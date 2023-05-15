resource "aws_security_group" "internal" {
  description = "Internal"
  name        = "Internal"
  vpc_id      = module.vpc.vpc_id
  tags = {
    Name        = "Internal"
    Environment = var.environment
  }
}

resource "aws_security_group_rule" "ig_internal_self" {
  security_group_id = aws_security_group.internal.id
  type              = "ingress"
  description       = "self"
  from_port         = 0
  protocol          = "-1"
  self              = true
  to_port           = 0
}

resource "aws_security_group_rule" "eg_internal_self" {
  security_group_id = aws_security_group.internal.id
  type              = "egress"
  description       = "self"
  from_port         = 0
  protocol          = "-1"
  self              = true
  to_port           = 0
}

resource "aws_security_group_rule" "ig_internal_lb" {
  security_group_id        = aws_security_group.internal.id
  type                     = "ingress"
  source_security_group_id = aws_security_group.lb.id
  description              = "Load Balancer"
  from_port                = 3000
  protocol                 = "TCP"
  to_port                  = 3000
}

# resource "aws_security_group_rule" "eg_internal_http" {
#   security_group_id = aws_security_group.internal.id
#   type              = "egress"
#   cidr_blocks = [
#     "0.0.0.0/0"
#   ]
#   description = "HTTP"
#   from_port   = 80
#   protocol    = "TCP"
#   to_port     = 80
# }

resource "aws_security_group_rule" "eg_internal_https" {
  security_group_id = aws_security_group.internal.id
  type              = "egress"
  cidr_blocks = [
    "0.0.0.0/0"
  ]
  description = "HTTPS"
  from_port   = 443
  protocol    = "TCP"
  to_port     = 443
}

resource "aws_security_group_rule" "eg_internal_dns" {
  security_group_id = aws_security_group.internal.id
  type              = "egress"
  cidr_blocks = [
    "0.0.0.0/0"
  ]
  description = "DNS"
  from_port   = 53
  protocol    = "TCP"
  to_port     = 53
}

resource "aws_security_group_rule" "eg_internal_dns_udp" {
  security_group_id = aws_security_group.internal.id
  type              = "egress"
  cidr_blocks = [
    "0.0.0.0/0"
  ]
  description = "DNS"
  from_port   = 53
  protocol    = "UDP"
  to_port     = 53
}

resource "aws_security_group_rule" "eg_internal_ntp" {
  security_group_id        = aws_security_group.internal.id
  type                     = "egress"
   cidr_blocks = [
    "0.0.0.0/0"
  ]
  description              = "NTP"
  from_port                = 123
  protocol                 = "UDP"
  to_port                  = 123
}
