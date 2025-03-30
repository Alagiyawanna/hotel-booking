provider "aws" {
  region = "us-east-1"
}

data "aws_instance" "hotel_booking" {
  instance_id = "i-016d05fdf5fd9623c"
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.hotel_booking_sg.id
  network_interface_id = data.aws_instance.hotel_booking.network_interface_id
}

output "instance_public_dns" {
  value = data.aws_instance.hotel_booking.public_dns
}