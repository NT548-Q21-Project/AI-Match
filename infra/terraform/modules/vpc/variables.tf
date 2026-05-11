variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (2 required)"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (2 required)"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones to use (2 required)"
  type        = list(string)
}

variable "cluster_name" {
  description = "Name of the EKS cluster (used for EKS tags)"
  type        = string
}

variable "single_nat_gateway" {
  description = "Use a single NAT Gateway for all private subnets (cost saving for dev)"
  type        = bool
  default     = true
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
