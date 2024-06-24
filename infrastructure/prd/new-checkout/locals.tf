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
