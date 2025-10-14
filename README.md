# Nginx WAF Desktop Client

A desktop application for managing Nginx Web Application Firewall (WAF) configurations, providing a user-friendly interface for monitoring, configuring, and maintaining WAF settings. [HomePage Product](https://github.com/TinyActive/nginx-love/)

## Features

- **Dashboard**: Overview of system status, alerts, and performance metrics.
- **Domain Management**: Add, edit, and remove protected domains.
- **ModSecurity Rules**: Custom rule creation and management for security policies.
- **Network Load Balancer**: Configure and monitor load balancing settings.
- **Logs**: View and analyze access and error logs.
- **SSL/TLS Management**: Handle certificates and SSL configurations.
- **User Management**: Account settings, authentication, and permissions.
- **Backup & Restore**: Data backup and recovery functionalities.

## Prerequisites

- **Node.js** (v16 or later)
- **Rust** (latest stable version)
- **Tauri CLI**: Install with `npm install -g @tauri-apps/cli`

## Installation & Build

1. Clone the repository:
   ```bash
   git clone https://github.com/TinyActive/nginx-waf-apps-client.git
   cd nginx-waf-apps-client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run tauri build
   ```

The built application will be available in `src-tauri/target/release/bundle/`.

## Development

To run in development mode:
```bash
npm run tauri dev
```

This starts the frontend dev server and Tauri application.

## Usage

After building, run the executable from the bundle directory. The app provides a GUI for all WAF management tasks. Ensure your Nginx WAF server is running and accessible.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

### Guidelines
- Follow the existing code style.
- Add tests for new features.
- Update documentation as needed.
- Ensure builds pass on all platforms.

## License

This project is licensed under the License - see the [LICENSE](LICENSE) file for details.
