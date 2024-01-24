variable "aws-default-region" {
  type        = string
  default     = "us-east-1"
  description = "Região dos recursos da AWS"
}

variable "environment" {
  type        = string
  description = "Ambiente"
}

variable "deploy_hash" {
  type = string
}

variable "host_lb" {
  type        = string
  description = "Host do loadbalancer"
}


 