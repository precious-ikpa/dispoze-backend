variable "vpc_id" {
  description = "VPC ID to launch the EKS cluster in."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the EKS cluster."
  type        = list(string)
}

variable "cluster_security_group_id" {
  description = "Security group ID for the EKS cluster."
  type        = string
}

variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
}

variable "cluster_version" {
  description = "Version of the EKS cluster."
  type        = string
}

variable "eks_managed_node_group_defaults" {
  description = "Default settings for the EKS managed node group."
  type        = any
}

variable "eks_managed_node_groups" {
  description = "Configuration for EKS managed node groups."
  type        = any
}
