output "aws-checkout-ecr-address" {
  value = aws_ecr_repository.checkout-repository.repository_url
}
