output "groq_api_key_arn" {
  description = "ARN of the Groq API key secret"
  value       = aws_secretsmanager_secret.groq_api_key.arn
}

output "jwt_secret_arn" {
  description = "ARN of the JWT secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "db_credentials_arn" {
  description = "ARN of the database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_username" {
  description = "Database username"
  value       = "admin"
}

output "db_password" {
  description = "Database password (auto-generated)"
  value       = random_password.db_password.result
  sensitive   = true
}
