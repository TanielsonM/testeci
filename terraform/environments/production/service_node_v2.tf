resource "aws_ecs_service" "node_v2" {
  name                   = "node_v2"
  cluster                = aws_ecs_cluster.node_v2.id
  task_definition        = aws_ecs_task_definition.node_v2.arn
  desired_count          = 2
  launch_type            = "FARGATE"
  enable_execute_command = true

  network_configuration {
    security_groups  = [aws_security_group.internal.id]
    subnets          = module.vpc.private_subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.club-node-v2-target-group.arn
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


resource "aws_appautoscaling_target" "node_target_v2" {
  max_capacity       = 20
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.node_v2.name}/${aws_ecs_service.node_v2.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"

}

resource "aws_appautoscaling_policy" "node_cpu" {
  name               = "node-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.node_target_v2.resource_id
  scalable_dimension = aws_appautoscaling_target.node_target_v2.scalable_dimension
  service_namespace  = aws_appautoscaling_target.node_target_v2.service_namespace
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 120
  }
}
