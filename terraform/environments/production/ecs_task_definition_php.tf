locals {
  cpu    = 512
  memory = 1024
}

resource "aws_ecs_task_definition" "php" {
  family                   = "php"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = local.cpu
  memory                   = local.memory
  task_role_arn            = aws_iam_role.ecs_exec_role.arn
  execution_role_arn       = aws_iam_role.ecs_exec_role.arn
  container_definitions = jsonencode([
    {
      essential   = true
      image       = "${aws_ecr_repository.checkout-repository.repository_url}:${var.deploy_hash}",
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
      # linuxParameters = {
      #   initProcessEnabled = true
      # }
      # HealthCheck = {
      #   Command = [
      #     "CMD-SHELL",
      #     "SCRIPT_NAME=/ping SCRIPT_FILENAME=\"/ping\" REQUEST_URI=\"/ping\" REQUEST_METHOD=GET cgi-fcgi -bind -connect 127.0.0.1:9000"
      #   ],
      #   Interval = 10,
      #   Timeout  = 2,
      #   Retries  = 2
      # }
    }
  ])
}
