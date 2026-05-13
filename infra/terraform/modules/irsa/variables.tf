variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "groq_api_key_arn" {
  description = "ARN of the Groq API key secret"
  type        = string
}

variable "jwt_secret_arn" {
  description = "ARN of the JWT secret"
  type        = string
}

variable "db_credentials_arn" {
  description = "ARN of the database credentials secret"
  type        = string
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
