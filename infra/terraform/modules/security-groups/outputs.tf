output "alb_sg_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "api_gateway_sg_id" {
  description = "ID of the API Gateway security group"
  value       = aws_security_group.api_gateway.id
}

output "services_sg_id" {
  description = "ID of the services security group"
  value       = aws_security_group.services.id
}

output "rds_sg_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}
