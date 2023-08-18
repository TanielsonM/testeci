output "aws-checkout-ecr-address" {
  value = aws_ecr_repository.checkout-repository.repository_url
}

output "aws-checkout-ecr-address-v2" {
  value = aws_ecr_repository.checkout-repository-v2.repository_url
}