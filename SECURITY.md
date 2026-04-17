# Security Policy

## Supported Versions

This project currently supports the latest version on the `main` branch.

## Reporting a Vulnerability

Please do not open public GitHub issues for suspected security vulnerabilities.

Instead, report them privately to the maintainer with:

- A description of the issue
- Reproduction steps or proof of concept
- Impact assessment
- Suggested remediation, if known

Reports will be acknowledged as quickly as possible, and validated issues will be fixed in priority order based on severity and exploitability.

## Security Posture

The application is designed to:

- Validate all request input on the server
- Avoid storing resume analysis results in browser session storage
- Return `Cache-Control: no-store` on sensitive API responses
- Support shared rate limiting through Upstash Redis when configured
- Run automated security scanning through GitHub Actions
