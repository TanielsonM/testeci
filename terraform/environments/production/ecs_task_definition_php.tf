locals {
  cpu    = 2048
  memory = 4096
}

resource "aws_ecs_task_definition" "node" {
  family                   = "node"
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
      HealthCheck = {
        Command = [
          "CMD-SHELL",
          "curl -f http://localhost:3000/ || exit 1"
        ],
        Interval = 10,
        Timeout  = 2,
        Retries  = 2
      }
    }
  ])
}
