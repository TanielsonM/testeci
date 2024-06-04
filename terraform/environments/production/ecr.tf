resource "aws_ecr_repository" "checkout-repository" {
  name                 = "checkout-repo"
  image_tag_mutability = "MUTABLE"
}


resource "aws_ecr_repository_policy" "checkout-repo-policy" {
  repository = aws_ecr_repository.checkout-repository.name
  policy     = file("./policys/checkout-repo-policy.json")
}

resource "aws_ecr_repository" "checkout-nginx-repository" {
  name                 = "checkout-nginx-repo"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository_policy" "checkout-nginx-repo-policy" {
  repository = aws_ecr_repository.checkout-nginx-repository.name
  policy     = file("./policies/checkout-repo-policy.json")
}