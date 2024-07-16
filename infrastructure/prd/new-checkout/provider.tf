provider "aws" {
  region = "us-east-1"

  assume_role {
    role_arn    = var.target_deployment_role
    external_id = "AWS_DEVOPS_DEPLOYMENT"
  }
}

  # terraform {
  #   backend "s3" {
  #     bucket = "greenn-devops-state"
  #     key    = "greenn-pci-prd/container.tfstate"
  #     region = "us-east-1"
  #   }
  # }

terraform {
  backend "s3" {
    bucket = "greenn-devops-state"
    key    = "greenn-pci-prd/new-checkout/state.tfstate"
    region = "us-east-1"
  }
}