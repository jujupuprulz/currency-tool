#!/bin/bash
# Generate self-signed certificates for local HTTPS development

echo "Generating self-signed certificates for HTTPS..."
openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
echo "Certificates generated successfully!"
echo "server.key and server.cert files have been created."
echo "Note: These are self-signed certificates for development only."
echo "For production, use certificates from a trusted certificate authority."
