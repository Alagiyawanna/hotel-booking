provider "aws" {
  region = var.aws_region
}

# Get information about the existing EC2 instance
data "aws_instance" "staysphere_instance" {
  instance_id = var.instance_id
}

# Create a security group for the application
resource "aws_security_group" "staysphere_sg" {
  name        = "staysphere-sg"
  description = "Security group for StaySphere hotel booking application"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }
  
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Frontend access"
  }
  
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API access"
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
  
  tags = {
    Name = "staysphere-sg"
  }
}

# Attach the security group to the existing instance
resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.staysphere_sg.id
  network_interface_id = data.aws_instance.staysphere_instance.network_interface_ids[0]
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