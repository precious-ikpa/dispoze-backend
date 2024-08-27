# variables.tf

variable "aws_region" {
  description = "The AWS region to deploy resources."
  type        = string
  default     = "eu-west-1"
}

variable "key_name" {
  description = "SSH key name for EKS nodes."
  type        = string
  default     = "dispoze_ssh-key"
}

variable "public_key_path" {
  description = "Path to the public SSH key."
  type        = string
  default     = "~/.ssh/dispoze_ssh-key.pub"
}

variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
  default     = "dispoze-eks-cluster"
}

variable "cluster_version" {
  description = "Version of the EKS cluster."
  type        = string
  default     = "1.26"
}

variable "eks_managed_node_group_defaults" {
  description = "Default settings for the EKS managed node group."
  type        = any
  default = {
    ami_type                   = "AL2_x86_64"
    instance_types             = ["t3.medium"]
    iam_role_attach_cni_policy = true
    key_name                   = "dispoze_ssh-key"
  }
}

variable "eks_managed_node_groups" {
  description = "Configuration for EKS managed node groups."
  type        = any
  default = {
    eks_nodes = {
      min_size       = 2
      max_size       = 5
      desired_size   = 2
      instance_types = ["t3.medium"]
    }
  }
}
