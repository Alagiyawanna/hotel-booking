provider "aws" {
  region = "eu-north-1"
}

data "aws_instance" "hotel_booking" {
  instance_id = "i-08eda6a6b8960c5ca"
}

resource "aws_security_group" "hotel_booking_sg" {
  name        = "hotel-booking-sg"
  description = "Security group for Hotel Booking application"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API access
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend access
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.hotel_booking_sg.id
  network_interface_id = data.aws_instance.hotel_booking.network_interface_id
}

output "instance_public_dns" {
  value = data.aws_instance.hotel_booking.public_dns
}