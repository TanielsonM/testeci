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

locals {
  default_sidecar_container_definition = [
    {
      name             = "log_router",
      image            = "amazon/aws-for-fluent-bit",
      logConfiguration = null,
      firelensConfiguration = {
        type = "fluentbit",
        options = {
          "enable-ecs-log-metadata" : "true"
        }
      }
    },
    {
      name  = "datadog-agent",
      image = "public.ecr.aws/datadog/agent:latest",
      environment = [
        {
          name  = "ECS_FARGATE",
          value = "true"
        },
        {
          name  = "DD_CONTAINER_EXCLUDE",
          value = "name:log_router name:datadog-agent"
        },
        {
          name  = "DD_APM_ENABLED",
          value = "true"
        },
        {
          name  = "DD_API_KEY",
          value = "40d3f690fc42de54e11baacb1dbbbcc1"
        }

      ]
    }
  ]
}
