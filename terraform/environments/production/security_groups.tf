resource "aws_security_group" "rede-interna" {
  description = "Rede Interna"

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = "0"
    protocol    = "-1"
    self        = "false"
    to_port     = "0"
  }

  ingress {
    cidr_blocks = [
      module.vpc.vpc_cidr_block
    ]
    description = "Rede Interna"
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }

  name   = "Rede Interna"
  vpc_id = module.vpc.vpc_id
  tags = {
    Name        = "Rede Interna"
    Environment = var.environment
  }
}

resource "aws_security_group" "loadbalancer" {
  description = var.environment
  name        = var.environment
  tags = {
    Name = "loadbalancer${var.environment}"
  }
  vpc_id = module.vpc.vpc_id
  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 80
    protocol  = "tcp"
    to_port   = 80
  }
  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 443
    protocol  = "tcp"
    to_port   = 443
  }
  egress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 0
    protocol  = "-1"
    to_port   = 0
  }
}


# resource "aws_security_group" "efs" {
#   vpc_id = module.vpc.vpc_id
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port = 2049
#     to_port   = 2049
#     protocol  = "tcp"
#     cidr_blocks = [
#       module.vpc.vpc_cidr_block
#     ]
#   }
# }
