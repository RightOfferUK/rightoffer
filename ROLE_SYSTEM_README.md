# RightOffer Role-Based System

This document describes the new three-tier role-based system implemented in RightOffer.

## Overview

The system now supports three distinct user roles with hierarchical access control:

1. **Admin** - System administrators
2. **Real Estate Admin** - Real estate company administrators  
3. **Agent** - Individual real estate agents

## User Roles & Permissions

### Admin
- **Dashboard**: `/dashboard` (renders admin components)
- **Capabilities**:
  - Create and manage real estate companies
  - Set listing limits for companies
  - View system-wide analytics
  - Access all listings across the platform
  - Manage user accounts

### Real Estate Admin
- **Dashboard**: `/dashboard` (renders real estate admin components)
- **Capabilities**:
  - Create and manage agents under their company
  - View all listings from their agents
  - Monitor company listing usage vs. limits
  - Company-level analytics

### Agent
- **Dashboard**: `/dashboard` (renders agent components)
- **Capabilities**:
  - Create listings (subject to company limits)
  - Manage their own listings
  - Access buyer codes and offers
  - View company branding in dashboard

## Authentication Changes

### Sign-up Removed
- Users can no longer self-register
- Only existing users in the system can sign in
- New users must be created by:
  - Admin creates Real Estate Admins
  - Real Estate Admins create Agents

### Role-Based Dashboard Rendering
All users are redirected to `/dashboard` after sign-in, but the dashboard dynamically renders different components based on their role:
- `admin` → Admin dashboard components (company management, system KPIs)
- `real_estate_admin` → Real estate admin components (agent management, company analytics)
- `agent` → Agent dashboard components (listing management, company branding)

## Property Listing Limits

### How It Works
1. **Admin** sets `maxListings` for each Real Estate Admin
2. **Real Estate Admin** and their **Agents** share this pool of listings
3. When an Agent creates a listing, it counts against their company's limit
4. When a listing is deleted, the count is decremented

### Enforcement
- Listing creation is blocked when limits are reached
- API returns appropriate error messages
- Dashboards show usage vs. limits

## Database Schema

### User Model
```javascript
{
  email: String,
  name: String,
  role: 'admin' | 'real_estate_admin' | 'agent',
  isActive: Boolean,
  
  // Real Estate Admin fields
  companyName: String,
  maxListings: Number,
  usedListings: Number,
  
  // Agent fields  
  realEstateAdminId: ObjectId,
  
  // Metadata
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## API Changes

### Role-Based Access Control
All listing endpoints now enforce role-based permissions:

- **Admin**: Access to all listings
- **Real Estate Admin**: Access to listings from their agents
- **Agent**: Access to only their own listings

### New API Endpoints

#### Admin Endpoints
- `GET /api/admin/kpi` - System-wide KPIs
- `GET /api/admin/real-estate-admins` - List real estate companies
- `POST /api/admin/real-estate-admins` - Create real estate company
- `PATCH /api/admin/real-estate-admins/[id]` - Update company
- `DELETE /api/admin/real-estate-admins/[id]` - Delete company

#### Real Estate Admin Endpoints  
- `GET /api/real-estate-admin/kpi` - Company KPIs
- `GET /api/real-estate-admin/agents` - List company agents
- `POST /api/real-estate-admin/agents` - Create agent
- `PATCH /api/real-estate-admin/agents/[id]` - Update agent
- `DELETE /api/real-estate-admin/agents/[id]` - Delete agent

#### Agent Endpoints
- `GET /api/agent/company-info` - Get company information

## Setup Instructions

### 1. Initial Admin Setup
Run the setup script to create your first admin user:

```bash
node scripts/setup-admin.js admin@yourcompany.com
```

### 2. Database Migration
Existing users will need to be assigned roles. The system defaults to 'agent' role for users without a specified role.

### 3. Company Setup
1. Sign in as admin at `/login` (redirects to `/dashboard`)
2. Create real estate companies via the admin dashboard
3. Set appropriate listing limits for each company
4. Real estate admins can then create their agents

## Dashboard Features

### Admin Dashboard
- Real estate company management table
- System-wide KPIs (companies, agents, listings)
- Quick actions for system management

### Real Estate Admin Dashboard  
- Agent management table
- Company listing usage tracking
- Agent performance metrics
- Company-specific actions

### Agent Dashboard
- Enhanced with company branding
- Listing limit awareness
- Company information display

## Migration Notes

### Existing Data
- Existing users will default to 'agent' role
- Existing listings remain associated with their original agents
- No data loss during migration

### Backward Compatibility
- Agent dashboard functionality remains unchanged
- Existing API endpoints continue to work for agents
- Listing creation/management flows are preserved

## Security Considerations

### Access Control
- All API endpoints validate user roles
- Cross-company data access is prevented
- Proper ownership validation on all operations

### Authentication
- No self-registration prevents unauthorized access
- Email-based magic link authentication retained
- Session includes role information for client-side routing

## Troubleshooting

### Common Issues

1. **User can't sign in**: Ensure user exists in database with `isActive: true`
2. **Wrong dashboard redirect**: Check user's role in database
3. **Can't create listings**: Verify company hasn't reached listing limit
4. **Missing company name**: Ensure agent has valid `realEstateAdminId`

### Debug Commands

Check user role:
```javascript
// In MongoDB
db.users.findOne({email: "user@example.com"}, {role: 1, isActive: 1})
```

Check listing limits:
```javascript
// In MongoDB  
db.users.findOne({role: "real_estate_admin"}, {maxListings: 1, usedListings: 1})
```

## Support

For issues with the role system, check:
1. User exists in database with correct role
2. Real estate admin has sufficient listing limits
3. Agent is properly associated with real estate admin
4. All users have `isActive: true`
