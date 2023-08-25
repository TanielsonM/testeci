# resource "aws_ecr_repository" "checkout-repository-v2" {
#   name                 = "checkout-repo-v2"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository_policy" "checkout-repo-policy-v2" {
#   repository = aws_ecr_repository.checkout-repository-v2.name
#   policy     = file("./policys/checkout-repo-policy.json")
# }

# output "aws-checkout-ecr-address-v2" {
#   value = aws_ecr_repository.checkout-repository-v2.repository_url
# }