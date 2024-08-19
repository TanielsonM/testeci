resource "aws_appautoscaling_target" "node_target" {
  count = var.environment == "production" ? 1 : 0

  max_capacity       = 20
  min_capacity       = 2
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.payfast-svc.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "node_cpu" {
  count = var.environment == "production" ? 1 : 0

  name               = "node-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.node_target[count.index].resource_id
  scalable_dimension = aws_appautoscaling_target.node_target[count.index].scalable_dimension
  service_namespace  = aws_appautoscaling_target.node_target[count.index].service_namespace
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
  count              = var.environment == "production" ? 1 : 0
  name               = "scheduled_scaling"
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.payfast-svc.name}"
  scalable_target_action {
    min_capacity = 2  #normal
    max_capacity = 20 #normal
    # min_capacity      = 10 #lançamento
    # max_capacity      = 50 #lançamento
  }
  schedule = "cron(0 13,01 * * ?)"
}

resource "aws_appautoscaling_scheduled_action" "scheduled_action_min_10" {
  count              = var.environment == "production" ? 1 : 0
  name               = "scheduled_scaling_min_10"
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.payfast-svc.name}"
  scalable_target_action {
    min_capacity = 10
    max_capacity = 50
  }
  schedule = "cron(0 10 * * ?)"
}

resource "aws_appautoscaling_scheduled_action" "scheduled_action_min_40" {
  count              = var.environment == "production" ? 1 : 0
  name               = "scheduled_scaling_min_40"
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.payfast-svc.name}"
  scalable_target_action {
    min_capacity = 10
    max_capacity = 50
  }
  schedule = "cron(30 21 * * ?)"
}
