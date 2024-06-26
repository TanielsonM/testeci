resource "aws_lb_target_group" "payfast-pci-tg" {
  health_check {
    interval            = 30
    path                = "/api/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 29
    unhealthy_threshold = 2
    healthy_threshold   = 5
    matcher             = "200"
  }
  port                 = 80
  protocol             = "HTTP"
  target_type          = "ip"
  vpc_id               = var.vpc_id
  name                 = "payfast-pci-tg"
  deregistration_delay = 5
}


resource "aws_lb_listener_rule" "payfast-https" {
  priority     = "20"
  listener_arn = var.alb_https_listener
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.payfast-pci-tg.arn
  }
  condition {
    host_header {
      values = var.application_host_header_values
    }
  }
}
