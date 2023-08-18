locals {
  cpu_node_v2    = 1024
  memory_node_v2 = 2048
}

resource "aws_ecs_task_definition" "node_v2" {
  family                   = "node_v2"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = local.cpu
  memory                   = local.memory
  task_role_arn            = aws_iam_role.ecs_exec_role.arn
  execution_role_arn       = aws_iam_role.ecs_exec_role.arn
  container_definitions = jsonencode(concat([
    {
      essential   = true
      image       = "${aws_ecr_repository.checkout-repository-v2.repository_url}:${var.deploy_hash}",
      name        = "node"
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = 80
        }
      ]
      volumesFrom = []
      mountPoints = []
      HealthCheck = {
        Command = [
          "CMD-SHELL",
          "curl -f http://localhost:80/ || exit 1"
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
          dd_tags        = "project:fluent-bit"
          Name           = "datadog"
          apikey         = "40d3f690fc42de54e11baacb1dbbbcc1"
        }
      }
    }
  ], local.default_sidecar_container_definition))
}
