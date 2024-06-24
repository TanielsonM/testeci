resource "aws_iam_policy" "ecs_exec_policy" {
  name = "ecs_exec_policy"

  policy = file("./modules/new-checkout/policy.json")
}

data "aws_iam_policy_document" "ecs_task_execution_role_base" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}


resource "aws_iam_role" "ecs_exec_role" {
  assume_role_policy  = data.aws_iam_policy_document.ecs_task_execution_role_base.json
  managed_policy_arns = [aws_iam_policy.ecs_exec_policy.arn]
}
