
resource "aws_ecs_service" "new-checkout-svc" {
  name                   = "${var.name}-${var.application}-svc"
  cluster                = var.cluster_name
  task_definition        = aws_ecs_task_definition.new-checkout-td.arn
  desired_count          = 1
  launch_type            = "FARGATE"
  enable_execute_command = true

  network_configuration {
    security_groups  = var.container_security_group
    subnets          = var.app_subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.new-checkout-tg.arn
    container_name   = "greenn-payfast-pci-nginx-pod"
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

