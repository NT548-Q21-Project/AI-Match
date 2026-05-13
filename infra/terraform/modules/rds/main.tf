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

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name        = "${var.environment}-${var.cluster_name}-subnet-group"
  description = "Subnet group for RDS instance"
  subnet_ids  = var.private_subnet_ids

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-subnet-group"
    }
  )
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "main" {
  identifier              = "${var.environment}-${var.cluster_name}"
  engine                  = "postgres"
  engine_version          = "18.3"
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  storage_type            = "gp2"
  db_name                 = "appdb"
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [var.rds_sg_id]
  skip_final_snapshot     = true
  publicly_accessible     = false
  multi_az                = false

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-rds"
    }
  )
}
