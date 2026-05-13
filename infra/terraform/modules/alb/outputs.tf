output "lb_controller_role_arn" {
  description = "IAM role ARN for the AWS Load Balancer Controller"
  value       = aws_iam_role.aws_lbc.arn
}
