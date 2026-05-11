locals {
  # Merge base tags with environment, managed_by, and cluster name
  base_tags = merge(
    var.tags,
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Cluster     = var.cluster_name
    }
  )
}

# 1. ALB Security Group
resource "aws_security_group" "alb" {
  name_prefix = "${var.environment}-${var.cluster_name}-alb-"
  description = "Security group for Application Load Balancer"
  vpc_id      = var.vpc_id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-alb-sg"
    }
  )
}

# ALB Inbound Rules
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTP from internet"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow HTTPS from internet"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

# ALB Outbound Rules (allow all)
resource "aws_vpc_security_group_egress_rule" "alb_all" {
  security_group_id = aws_security_group.alb.id
  description       = "Allow all outbound traffic"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# 2. API Gateway Security Group
resource "aws_security_group" "api_gateway" {
  name_prefix = "${var.environment}-${var.cluster_name}-api-gateway-"
  description = "Security group for API Gateway (8080)"
  vpc_id      = var.vpc_id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-api-gateway-sg"
    }
  )
}

# API Gateway Inbound Rules
resource "aws_vpc_security_group_ingress_rule" "api_gateway_from_alb" {
  security_group_id            = aws_security_group.api_gateway.id
  description                  = "Allow traffic from ALB security group on port 8080"
  referenced_security_group_id = aws_security_group.alb.id
  from_port                    = 8080
  ip_protocol                  = "tcp"
  to_port                      = 8080
}

# API Gateway Outbound Rules
resource "aws_vpc_security_group_egress_rule" "api_gateway_to_services" {
  security_group_id            = aws_security_group.api_gateway.id
  description                  = "Allow traffic to services security group on all ports"
  referenced_security_group_id = aws_security_group.services.id
  ip_protocol                  = "-1"
}

resource "aws_vpc_security_group_egress_rule" "api_gateway_to_internet_443" {
  security_group_id = aws_security_group.api_gateway.id
  description       = "Allow outbound HTTPS to internet (for Groq AI API)"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

# 3. Services Security Group
resource "aws_security_group" "services" {
  name_prefix = "${var.environment}-${var.cluster_name}-services-"
  description = "Security group for microservices (identity, recruitment, AI)"
  vpc_id      = var.vpc_id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-services-sg"
    }
  )
}

# Services Inbound Rules
resource "aws_vpc_security_group_ingress_rule" "services_from_api_gateway" {
  security_group_id            = aws_security_group.services.id
  description                  = "Allow traffic from API Gateway security group on all ports"
  referenced_security_group_id = aws_security_group.api_gateway.id
  ip_protocol                  = "-1"
}

# Services Outbound Rules
resource "aws_vpc_security_group_egress_rule" "services_to_rds" {
  security_group_id            = aws_security_group.services.id
  description                  = "Allow traffic to RDS security group on port 5432"
  referenced_security_group_id = aws_security_group.rds.id
  from_port                    = 5432
  ip_protocol                  = "tcp"
  to_port                      = 5432
}

resource "aws_vpc_security_group_egress_rule" "services_to_internet_443" {
  security_group_id = aws_security_group.services.id
  description       = "Allow outbound HTTPS to internet (for Groq AI API)"
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

# 4. RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "${var.environment}-${var.cluster_name}-rds-"
  description = "Security group for RDS PostgreSQL database"
  vpc_id      = var.vpc_id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-rds-sg"
    }
  )
}

# RDS Inbound Rules
resource "aws_vpc_security_group_ingress_rule" "rds_from_api_gateway" {
  security_group_id            = aws_security_group.rds.id
  description                  = "Allow PostgreSQL traffic from API Gateway security group"
  referenced_security_group_id = aws_security_group.api_gateway.id
  from_port                    = 5432
  ip_protocol                  = "tcp"
  to_port                      = 5432
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_services" {
  security_group_id            = aws_security_group.rds.id
  description                  = "Allow PostgreSQL traffic from services security group"
  referenced_security_group_id = aws_security_group.services.id
  from_port                    = 5432
  ip_protocol                  = "tcp"
  to_port                      = 5432
}

# RDS has no outbound rules (default allow all egress is fine, but we can be explicit)
# By default, AWS security groups allow all outbound. We don't need to create any egress rules.
