locals {
  cpu    = var.cpu
  memory = var.memory
}

resource "aws_ecs_task_definition" "new-checkout-td" {

  family                   = "new-checkout"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = local.cpu
  memory = local.memory

  task_role_arn      = aws_iam_role.ecs_exec_role.arn
  execution_role_arn = aws_iam_role.ecs_exec_role.arn

  container_definitions = jsonencode(concat([
    {
      essential   = true
      image       = "${var.php_default_image}",
      name        = "node"
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = 3000
        }
      ]
      volumesFrom = []
      mountPoints = []
      HealthCheck = {
        Command = [
          "CMD-SHELL",
          "curl -f http://localhost:3000/api/health || exit 1"
        ],
        Interval = 10,
        Timeout  = 2,
        Retries  = 2
      }
      firelensConfiguration = null
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          dd_message_key = "log"
          provider       = "ecs"
          dd_service     = "payfast-back"
          dd_source      = "node"
          Host           = "http-intake.logs.datadoghq.com"
          TLS            = "on"
          dd_tags        = "project:fluent-bit,environment:${var.environment}"
          Name           = "datadog"
          apikey         = "40d3f690fc42de54e11baacb1dbbbcc1"
        }
      }
    },
    {
      essential   = true
      image       = "${var.nginx_default_image}",
      name        = "nginx"
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = 80
          hostPort      = 80
        }
      ]
      volumesFrom = []
      mountPoints = []
      secrets     = []
      dependsOn = [
        {
          condition     = "HEALTHY"
          containerName = "node"
        }
      ]
      linuxParameters = {
        initProcessEnabled = true
      }
      HealthCheck = {
        Command = [
          "CMD-SHELL",
          "curl -f http://localhost/api/health || exit 1",
        ],
        Interval = 10,
        Timeout  = 2,
        Retries  = 2
      }
      firelensConfiguration = null
      logConfiguration = {
        logDriver = "awsfirelens"
        options = {
          dd_message_key = "log"
          provider       = "ecs"
          dd_service     = "payfast-nginx"
          dd_source      = "nginx"
          Host           = "http-intake.logs.datadoghq.com"
          TLS            = "on"
          dd_tags        = "project:fluent-bit,environment:${var.environment}"
          Name           = "datadog"
          apikey         = "40d3f690fc42de54e11baacb1dbbbcc1"
        }
      }
    }
  ], local.default_sidecar_container_definition))
  # lifecycle {
  #   ignore_changes = [
  #     container_definitions
  #   ]
  # }
}

