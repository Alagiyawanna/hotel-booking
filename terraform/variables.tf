variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "aws_ami_id" {
  description = "Amazon Machine Image ID"
  type        = string
  default     = "ami-0c7217cdde317cfec" # Amazon Linux 2023 AMI (adjust as needed)
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "SSH key name"
  type        = string
}