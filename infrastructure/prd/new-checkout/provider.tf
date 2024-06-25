provider "aws" {
  region = "us-east-1"

  assume_role {
    role_arn    = var.target_deployment_role
    external_id = "AWS_DEVOPS_DEPLOYMENT"
  }
}