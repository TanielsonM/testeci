
# resource "aws_ecs_cluster" "node_v2" {
#   name               = "node_v2"
#   capacity_providers = ["FARGATE"]
#   # default_capacity_provider_strategy {
#   #   capacity_provider = "FARGATE_SPOT"
#   #   weight            = 10
#   # }
#   default_capacity_provider_strategy {
#     capacity_provider = "FARGATE"
#     weight            = 1
#     base              = 1
#   }
# }