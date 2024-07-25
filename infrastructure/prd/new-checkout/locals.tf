locals {
  default_sidecar_container_definition = [
    {
      name             = "log_router",
      image            = "730335633389.dkr.ecr.us-east-1.amazonaws.com/greenn-addons:aws-for-fluent-bit-latest",
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
      image = "730335633389.dkr.ecr.us-east-1.amazonaws.com/greenn-datadog:agent",
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
          value = "${var.dd_key_secret}"
        }

      ]
    }
  ]
}
