resource "aws_ecs_cluster" "node" {
  name               = "node"
  capacity_providers = ["FARGATE"]
  # default_capacity_provider_strategy {
  #   capacity_provider = "FARGATE_SPOT"
  #   weight            = 10
  # }
  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = 1
  }
}
