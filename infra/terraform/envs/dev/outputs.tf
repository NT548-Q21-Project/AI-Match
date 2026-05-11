output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = module.vpc.nat_gateway_ids
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint of the EKS cluster"
  value       = module.eks.cluster_endpoint
}

output "cluster_ca_certificate" {
  description = "Base64-encoded certificate authority data for the cluster"
  value       = module.eks.cluster_ca_certificate
}

output "node_group_role_arn" {
  description = "IAM role ARN for the managed node group"
  value       = module.eks.node_group_role_arn
}

output "cluster_security_group_id" {
  description = "Security group ID of the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key used for secrets encryption"
  value       = module.eks.kms_key_arn
}

output "kubeconfig_instructions" {
  description = "Instructions to update kubeconfig"
  value = <<EOT
To configure kubectl to connect to the cluster, run:

aws eks update-kubeconfig \
  --region ${var.region} \
  --name ${module.eks.cluster_name} \
  --kubeconfig ~/.kube/config-${var.environment}

Or set the KUBECONFIG environment variable:
export KUBECONFIG=~/.kube/config-${var.environment}
EOT
}

# Security Groups Outputs
output "alb_sg_id" {
  description = "ID of the ALB security group"
  value       = module.security_groups.alb_sg_id
}

output "api_gateway_sg_id" {
  description = "ID of the API Gateway security group"
  value       = module.security_groups.api_gateway_sg_id
}

output "services_sg_id" {
  description = "ID of the services security group"
  value       = module.security_groups.services_sg_id
}

output "rds_sg_id" {
  description = "ID of the RDS security group"
  value       = module.security_groups.rds_sg_id
}
