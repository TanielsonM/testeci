resource "aws_ecr_repository" "checkout-repository" {
  name                 = "checkout-repo"
  image_tag_mutability = "MUTABLE"
}


resource "aws_ecr_repository_policy" "checkout-repo-policy" {
  repository = aws_ecr_repository.checkout-repository.name
  policy     = file("./policys/checkout-repo-policy.json")
}