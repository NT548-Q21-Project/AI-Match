locals {
  # Merge base tags with environment and managed_by
  base_tags = merge(
    var.tags,
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  )

  # EKS-specific tags for subnets
  eks_public_subnet_tags = {
    "kubernetes.io/role/elb"              = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }

  eks_private_subnet_tags = {
    "kubernetes.io/role/internal-elb"     = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

# 1. VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-vpc-${var.cluster_name}"
    }
  )
}

# 2. Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-igw-${var.cluster_name}"
    }
  )
}

# 3. Public Subnets
resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    local.base_tags,
    local.eks_public_subnet_tags,
    {
      Name = "${var.environment}-public-subnet-${count.index + 1}-${var.cluster_name}"
    }
  )
}

# 4. Private Subnets
resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    local.base_tags,
    local.eks_private_subnet_tags,
    {
      Name = "${var.environment}-private-subnet-${count.index + 1}-${var.cluster_name}"
    }
  )
}

# 5. Elastic IPs for NAT Gateways (only needed if not using single NAT)
resource "aws_eip" "nat" {
  count = var.single_nat_gateway ? 1 : 2

  domain = "vpc"

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-nat-eip-${count.index + 1}-${var.cluster_name}"
    }
  )

  depends_on = [aws_internet_gateway.main]
}

# 6. NAT Gateways
resource "aws_nat_gateway" "main" {
  count = var.single_nat_gateway ? 1 : 2

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-nat-gw-${count.index + 1}-${var.cluster_name}"
    }
  )

  depends_on = [aws_eip.nat]
}

# 7. Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-public-rt-${var.cluster_name}"
    }
  )
}

# 8. Private Route Tables
# Use for_each to properly assign NAT gateways based on subnet index
resource "aws_route_table" "private" {
  count = var.single_nat_gateway ? 1 : 2

  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[var.single_nat_gateway ? 0 : count.index].id
  }

  tags = merge(
    local.base_tags,
    {
      Name = "${var.environment}-private-rt-${count.index + 1}-${var.cluster_name}"
    }
  )
}

# 9. Public Route Table Associations
resource "aws_route_table_association" "public" {
  count = 2

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# 10. Private Route Table Associations
resource "aws_route_table_association" "private" {
  count = 2

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[var.single_nat_gateway ? 0 : count.index].id
}
