resource "aws_lb" "checkout-node" {
  name               = "checkout-lb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups = [
    "${aws_security_group.lb.id}"
  ]
  ip_address_type = "ipv4"
  access_logs {
    enabled = false
    bucket  = ""
    prefix  = ""
  }
  idle_timeout               = "360"
  enable_deletion_protection = "true"
  enable_http2               = "true"
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_lb_listener" "alb_listener_https" {
  load_balancer_arn = aws_lb.checkout-node.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-Ext-2018-06"
  certificate_arn   = aws_acm_certificate.greenn-wildcard.arn

  default_action {
    fixed_response {
      content_type = "text/plain"
      status_code  = "503"
    }
    type = "fixed-response"
  }
}

resource "aws_lb_target_group" "club-node-target-group" {
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
  vpc_id               = module.vpc.vpc_id
  name                 = "checkout-node-target-group"
  deregistration_delay = 5
}



resource "aws_lb_listener_rule" "checkout-https" {
  priority     = "1"
  listener_arn = aws_lb_listener.alb_listener_https.arn
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.club-node-target-group.arn
  }
  condition {
    host_header {
      values = [
        "payfast.greenn.com.br",
        "payfastdebug.greenn.com.br",
        "pay-staging.greenn.com.br"
      ]
    }
  }
}

output "elb_address" {
  value = aws_lb.checkout-node.dns_name
}
