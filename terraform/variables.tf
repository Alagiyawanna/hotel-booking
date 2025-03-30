variable "aws_region" {
  description = "AWS region where resources are deployed"
  type        = string
  default     = "us-east-1"
}

variable "instance_id" {
  description = "ID of the existing EC2 instance"
  type        = string
}