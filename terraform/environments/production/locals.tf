locals {
  vpc_id = module.vpc.vpc_id
}

locals {
  cidr = {
    production = "10.116.48.0/20"
  }
  azs = ["${var.aws-default-region}a", "${var.aws-default-region}b", "${var.aws-default-region}c", "${var.aws-default-region}d", "${var.aws-default-region}e", "${var.aws-default-region}f"]
  public_subnets = {
    production = ["10.116.48.0/24", "10.116.49.0/24", "10.116.50.0/24", "10.116.51.0/24"]
  }
  private_subnets = {
    production = ["10.116.60.0/24", "10.116.61.0/24", "10.116.62.0/24", "10.116.63.0/24"]
  }
}