locals {
  base_tags = merge(
    var.tags,
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Cluster     = var.cluster_name
    }
  )
}

# Random passwords
resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# 1. Groq API Key Secret
resource "aws_secretsmanager_secret" "groq_api_key" {
  name        = "${var.environment}-groq-api-key"
  description = "Groq AI API key for ai-service"
  recovery_window_in_days = 0

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-groq-api-key"
    }
  )
}

resource "aws_secretsmanager_secret_version" "groq_api_key" {
  secret_id     = aws_secretsmanager_secret.groq_api_key.id
  secret_string = jsonencode({ api_key = "REPLACE_ME" })
}

# 2. JWT Secret
resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${var.environment}-jwt-secret"
  description = "JWT signing secret for identity-service"
  recovery_window_in_days = 0

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-jwt-secret"
    }
  )
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = jsonencode({ secret = random_password.jwt_secret.result })
}

# 3. Database Credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.environment}-db-credentials"
  description = "PostgreSQL credentials"
  recovery_window_in_days = 0

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-db-credentials"
    }
  )
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id     = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "appuser"
    password = random_password.db_password.result
  })
}
