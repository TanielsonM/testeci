output "aws-checkout-ecr-address" {
  value = aws_ecr_repository.checkout-repository.repository_url
}

output "aws-checkout-nginx-ecr-address" {
  value = aws_ecr_repository.checkout-nginx-repository.repository_url
}