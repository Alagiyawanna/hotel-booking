provider "aws" {
  region = var.aws_region
}

# Use data source to get information about the existing EC2 instance
data "aws_instance" "staysphere_instance" {
  instance_id = var.instance_id
}

# Output the instance details
output "instance_id" {
  value = data.aws_instance.staysphere_instance.id
}

output "instance_public_ip" {
  value = data.aws_instance.staysphere_instance.public_ip
}

output "instance_public_dns" {
  value = data.aws_instance.staysphere_instance.public_dns
}