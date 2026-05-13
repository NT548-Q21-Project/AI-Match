locals {
  base_tags = merge(
    var.tags,
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Cluster     = var.cluster_name
    }
  )

  # Common trust policy for Pod Identity
  pod_identity_trust_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "pods.eks.amazonaws.com"
      }
      Action = [
        "sts:AssumeRole",
        "sts:TagSession"
      ]
    }]
  })
}

# IAM Policy for AWS Load Balancer Controller
data "local_file" "lbc_policy" {
  filename = "${path.module}/iam/AWSLoadBalancerController.json"
}

resource "aws_iam_policy" "lbc" {
  name        = "${var.environment}-${var.cluster_name}-aws-lbc-policy"
  description = "IAM policy for AWS Load Balancer Controller"

  policy = data.local_file.lbc_policy.content

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-aws-lbc-policy"
    }
  )
}

# IAM Role for AWS Load Balancer Controller
resource "aws_iam_role" "aws_lbc" {
  name = "${var.environment}-${var.cluster_name}-aws-lbc"

  assume_role_policy = local.pod_identity_trust_policy

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-${var.cluster_name}-aws-lbc"
    }
  )
}

resource "aws_iam_role_policy_attachment" "lbc" {
  role       = aws_iam_role.aws_lbc.name
  policy_arn = aws_iam_policy.lbc.arn
}

# Pod Identity Association for Load Balancer Controller
resource "aws_eks_pod_identity_association" "aws_lbc" {
  cluster_name    = var.cluster_name
  namespace       = "kube-system"
  service_account = "aws-load-balancer-controller"
  role_arn        = aws_iam_role.aws_lbc.arn
}

# AWS Load Balancer Controller Helm Release
resource "helm_release" "aws_lbc" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  # version    = "1.15.0"

  set = [
    {
      name  = "clusterName"
      value = var.cluster_name
    },
    {
      name  = "serviceAccount.name"
      value = "aws-load-balancer-controller"
    },
    {
      name  = "vpcId"
      value = var.vpc_id
    }
  #   {
  #     name  = "region"
  #     value = "ap-southeast-1"  # hoặc "ap-southeast-1" cứng luôn
  #   },
  #   {
  #     name  = "serviceAccount.create"
  #     value = "false"  # dùng Pod Identity → không cần tạo SA mới
  #   }
  ]

  depends_on = [
    aws_iam_role_policy_attachment.lbc,
    aws_eks_pod_identity_association.aws_lbc
  ]
}
