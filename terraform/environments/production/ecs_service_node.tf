resource "aws_ecs_service" "node" {
  name                   = "node"
  cluster                = aws_ecs_cluster.node.id
  task_definition        = aws_ecs_task_definition.node.arn
  desired_count          = 10
  launch_type            = "FARGATE"
  enable_execute_command = true

  network_configuration {
    security_groups  = [aws_security_group.internal.id]
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.club-node-target-group.arn
    container_name   = "node"
    container_port   = "80"
  }

  lifecycle {
    create_before_destroy = false
    ignore_changes = [
      desired_count
    ]
  }

  wait_for_steady_state = true

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  depends_on = [
    aws_lb_listener_rule.checkout-https
  ]
}


resource "aws_appautoscaling_target" "node_target" {
  max_capacity       = 20 #normal
  min_capacity       = 2 #normal
  # max_capacity       = 100 #lancamento
  # min_capacity       = 40 #lancamento
  resource_id        = "service/${aws_ecs_cluster.node.name}/${aws_ecs_service.node.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"

}

resource "aws_appautoscaling_policy" "node_cpu" {
  name               = "node-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.node_target.resource_id
  scalable_dimension = aws_appautoscaling_target.node_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.node_target.service_namespace
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 15
    scale_in_cooldown  = 60
    scale_out_cooldown = 120
  }
}

resource "aws_appautoscaling_scheduled_action" "scheduled_action" {
  count               = var.environment == "production" ? 1 : 0
  name                = "scheduled_scaling"
  service_namespace   = "ecs"
  scalable_dimension  = "ecs:service:DesiredCount"
  resource_id         = "service/${aws_ecs_cluster.node.name}/${aws_ecs_service.node.name}"
  scalable_target_action {
    # min_capacity      = 2 #normal
    # max_capacity      = 20 #normal
    min_capacity      = 10 #lançamento
    max_capacity      = 50 #lançamento
  }
  schedule            = "cron(0 13,03 * * ?)"
}

resource "aws_appautoscaling_scheduled_action" "scheduled_action_min_10" {
  count               = var.environment == "production" ? 1 : 0
  name                = "scheduled_scaling_min_10"
  service_namespace   = "ecs"
  scalable_dimension  = "ecs:service:DesiredCount"
  resource_id         = "service/${aws_ecs_cluster.node.name}/${aws_ecs_service.node.name}"
  scalable_target_action {
    min_capacity      = 10
    max_capacity      = 50
  }
  schedule            = "cron(0 10 * * ?)"
}

resource "aws_appautoscaling_scheduled_action" "scheduled_action_min_40" {
  count               = var.environment == "production" ? 1 : 0
  name                = "scheduled_scaling_min_40"
  service_namespace   = "ecs"
  scalable_dimension  = "ecs:service:DesiredCount"
  resource_id         = "service/${aws_ecs_cluster.node.name}/${aws_ecs_service.node.name}"
  scalable_target_action {
    min_capacity      = 10
    max_capacity      = 50
  }
  schedule            = "cron(30 21 * * ?)"
}