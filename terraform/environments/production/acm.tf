resource "aws_acm_certificate" "greenn-wildcard" {
  domain_name       = "*.greenn.com.br"
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
    prevent_destroy       = true
  }
  tags = {
    Name = "greenn.com.br"
  }
}

output "greenn-wildcard-dns-validation" {
  value = aws_acm_certificate.greenn-wildcard.domain_validation_options
}
