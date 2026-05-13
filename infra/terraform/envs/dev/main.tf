terraform {
  required_version = ">= 1.14.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 3.1.0"
    }
  }

  # Backend configuration (uncomment and fill in bucket name)
  backend "s3" {
    bucket         = "nttkhoi44-mlops-project-tfstate"
    key            = "dev/terraform.tfstate"
    region         = "ap-southeast-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = local.default_tags
  }
}

provider "helm" {
  kubernetes = {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)

    exec = {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args = [
        "eks", "get-token",
        "--cluster-name", var.cluster_name,
        "--region", var.region,
      ]
    }
  }
}


# Local values for consistent tagging
locals {
  default_tags = {
    Project     = "mlops-course-project"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  module_tags = merge(
    var.tags,
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  )
}

# Load common modules
module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr              = var.vpc_cidr
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
  availability_zones    = var.availability_zones
  cluster_name          = var.cluster_name
  single_nat_gateway    = var.single_nat_gateway
  environment           = var.environment
  tags                  = local.module_tags
}

# Security Groups module
module "security_groups" {
  source       = "../../modules/security-groups"

  vpc_id       = module.vpc.vpc_id
  environment  = var.environment
  cluster_name = var.cluster_name
  tags         = local.module_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name               = var.cluster_name
  kubernetes_version         = var.kubernetes_version
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  cluster_log_retention_days = var.cluster_log_retention_days
  environment                = var.environment
  tags                       = local.module_tags

  # Node Group configuration
  node_instance_types        = var.node_instance_types
  node_desired_size          = var.node_desired_size
  node_min_size              = var.node_min_size
  node_max_size              = var.node_max_size
  node_disk_size             = var.node_disk_size

  depends_on = [module.vpc]
}

# ECR Module - Container repositories for all services
module "ecr" {
  source = "../../modules/ecr"

  environment = var.environment
  tags        = local.module_tags
}

# Secrets Manager Module - Application secrets
module "secrets" {
  source = "../../modules/secrets"

  environment = var.environment
  cluster_name = var.cluster_name
  tags        = local.module_tags
}

# RDS Module - PostgreSQL database
module "rds" {
  source = "../../modules/rds"

  environment        = var.environment
  cluster_name       = var.cluster_name
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_sg_id          = module.security_groups.rds_sg_id

  # db_username = module.secrets.db_username
  db_username = "appuser"
  db_password = module.secrets.db_password

  tags = local.module_tags

  depends_on = [module.secrets]
}

# IAM Roles with Pod Identity for all services
module "irsa" {
  source = "../../modules/irsa"

  cluster_name       = var.cluster_name
  environment        = var.environment
  groq_api_key_arn   = module.secrets.groq_api_key_arn
  jwt_secret_arn     = module.secrets.jwt_secret_arn
  db_credentials_arn = module.secrets.db_credentials_arn
  tags               = local.module_tags

  depends_on = [module.eks]
}

# AWS Load Balancer Controller
module "alb" {
  source = "../../modules/alb"

  cluster_name           = var.cluster_name
  cluster_endpoint       = module.eks.cluster_endpoint
  cluster_ca_certificate = module.eks.cluster_ca_certificate
  vpc_id                 = module.vpc.vpc_id
  environment            = var.environment
  tags                   = local.module_tags

  depends_on = [module.irsa]
}
