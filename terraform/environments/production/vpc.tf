module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name                 = var.environment
  cidr                 = local.cidr.production
  enable_dns_hostnames = true
  enable_dns_support   = true

  azs             = local.azs
  public_subnets  = local.public_subnets.production
  private_subnets = local.private_subnets.production


  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false
  reuse_nat_ips          = true
  external_nat_ip_ids    = aws_eip.outbound.*.id
}

# resource "aws_internet_gateway" "gateway" {
#   vpc_id = module.vpc.vpc_id
# }

output "aws_internet_gateway" {
  value = module.vpc.igw_arn
}
