variable "nginx_default_image" {
  type = string
}

variable "php_default_image" {
  type = string
}

variable "container_security_group" {
  type = list(any)
}

variable "cpu" {
  type    = number
  default = 2048
}

variable "target_deployment_role" {
  type = string
}

variable "application_host_header_values" {
  type = list(any)
}

variable "memory" {
  type    = number
  default = 4096
}

variable "name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "alb_https_listener" {
  type = string
}

variable "app_subnets" {
  type = list(any)
}

variable "environment" {
  type    = string
  default = "production"
}

variable "max_capacity" {
  type    = number
  default = 20
}

variable "min_capacity" {
  type    = number
  default = 2
}

variable "cluster_name" {
  type = string
}