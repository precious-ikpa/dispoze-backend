provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
}

module "eks" {
  source                          = "./modules/eks"
  vpc_id                          = module.vpc.vpc_id
  private_subnet_ids              = module.vpc.private_subnet_ids
  cluster_security_group_id       = module.vpc.eks_security_group_id
  cluster_name                    = var.cluster_name
  cluster_version                 = var.cluster_version
  eks_managed_node_group_defaults = var.eks_managed_node_group_defaults
  eks_managed_node_groups         = var.eks_managed_node_groups
}


module "ecr" {
  source = "./modules/ecr"
}


resource "aws_key_pair" "dispoze_ssh-key" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}
