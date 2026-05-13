output "api_gateway_role_arn" {
  description = "IAM role ARN for API Gateway service"
  value       = aws_iam_role.api_gateway.arn
}

output "identity_service_role_arn" {
  description = "IAM role ARN for Identity Service"
  value       = aws_iam_role.identity_service.arn
}

output "recruitment_service_role_arn" {
  description = "IAM role ARN for Recruitment Service"
  value       = aws_iam_role.recruitment_service.arn
}

output "ai_service_role_arn" {
  description = "IAM role ARN for AI Service"
  value       = aws_iam_role.ai_service.arn
}
