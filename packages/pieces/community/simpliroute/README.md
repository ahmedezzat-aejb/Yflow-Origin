# SimpliRoute Piece for yflow

A comprehensive integration piece for SimpliRoute, the last-mile delivery optimization platform. This piece enables seamless automation of delivery operations within Yflowworkflows.

## Overview

SimpliRoute is a powerful logistics optimization platform that helps businesses streamline their delivery operations. This Yflowintegration provides access to all major SimpliRoute features including client management, vehicle tracking, route optimization, visit scheduling, and fleet management.

## Features

### 📋 Client Management
- **Get Clients** - Retrieve all clients with optional filtering
- **Create Clients** - Add single or multiple clients  
- **Bulk Delete Clients** - Remove multiple clients efficiently
- **Create Client Properties** - Add custom client attributes

### 🚛 Vehicle Management
- **Get Vehicles** - List all registered vehicles
- **Create Vehicle** - Register new vehicles with full configuration
- **Get Vehicle** - Retrieve detailed vehicle information
- **Delete Vehicle** - Remove vehicles from fleet

### 📍 Visit Management
- **Get Visits** - Retrieve visits by date
- **Create Visits** - Schedule single or multiple visits
- **Get Visit** - Get specific visit details
- **Update Visit** - Full or partial visit updates
- **Delete Visit** - Remove scheduled visits
- **Add Visit Items** - Attach items to existing visits
- **Get Visit Detail** - Complete visit information

### 🗺️ Route Management
- **Get Routes** - List all routes
- **Create Route** - Manual route creation
- **Get Route** - Detailed route information
- **Delete Route** - Remove routes

### 🎯 Planning & Optimization
- **Get Plans** - Retrieve routing plans
- **Create Plan** - Generate optimization plans
- **Get Plan Vehicles** - List plan-assigned vehicles
- **Create Full Plan** - Complete plan with visits and vehicles

### 👥 User Management
- **Get Drivers** - List all drivers
- **Create Users** - Add drivers and users
- **Get User** - Retrieve user information
- **Update User** - Modify user details
- **Delete User** - Remove users

### 🏷️ Metadata Management
- **Get Skills** - Available vehicle/driver skills
- **Get Observations** - System observations
- **Get Tags** - Available tags
- **Get Zones** - Delivery zones
- **Get Fleets** - Fleet information
- **Get Sellers** - Sales representatives

### ⚡ Advanced Features
- **Custom API Call** - Direct SimpliRoute API access for advanced use cases
- **Multi-language Support** - Full Spanish (es) localization
- **Comprehensive Error Handling** - Robust error management
- **Flexible Authentication** - Secure API token validation

## Authentication

This piece uses SimpliRoute API tokens for authentication:

1. Log in to your SimpliRoute account.
2. Go to the **Profile** section.
3. Copy your API token.
4. Use the token in your Yflowconnection settings.

The piece automatically validates your token against SimpliRoute's authentication endpoint.

## Supported Languages

- **English** (default)
- **Spanish** (es) - Complete translation including all actions and properties

## Installation

This piece is part of the Yflowcommunity pieces collection. To use it:

1. Create a new flow in yflow
2. Add a SimpliRoute step
3. Configure your API authentication
4. Select the desired action
5. Configure action parameters

## API Endpoints

All actions connect to the official SimpliRoute API at `https://api.simpliroute.com/v1/`


## Development

### Building

```bash
nx build pieces-simpliroute
```

### Linting

```bash
nx lint pieces-simpliroute
```

## Contributing

This piece is part of the Yflowcommunity project. Contributions are welcome!

1. Follow Yflowcoding standards
2. Update documentation
3. Ensure all linting passes

## Support

For issues related to this piece:
- [YflowGitHub Issues](https://github.com/yflow/yflow/issues)


## Version

Current version: 0.0.1

Built with ❤️ for the Yflowcommunity.
