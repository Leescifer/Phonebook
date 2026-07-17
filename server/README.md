# Phonebook Server API

This backend provides authentication, user management, and contact management for the phonebook application.

## Base URL

- Local development: http://localhost:3000

## Postman Setup

### 1. Create a collection

Create a new Postman collection named `Phonebook API`.

### 2. Add a collection variable

Add a variable named `base_url` with the value:

```text
http://localhost:3000
```

Add another variable named `token` and leave it empty until you log in.

### 3. Auth Header

For protected routes, set the authorization header as:

```text
Authorization: Bearer {{token}}
```

---

## Auth Endpoints

### Register a user

- Method: POST
- URL: `{{base_url}}/auth/register`
- Body (JSON):

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "password": "Abc123!@"
}
```

### Login

- Method: POST
- URL: `{{base_url}}/auth/login`
- Body (JSON):

```json
{
  "email": "jane@example.com",
  "password": "Abc123!@"
}
```

After a successful login, copy the returned `token` into the `token` Postman variable.

### Get current user

- Method: GET
- URL: `{{base_url}}/auth/me`
- Headers: `Authorization: Bearer {{token}}`

### Forgot password

- Method: POST
- URL: `{{base_url}}/auth/forgot-password`
- Body (JSON):

```json
{
  "email": "jane@example.com",
  "newPassword": "NewPass123!"
}
```

---

## User Management Endpoints

### Get all users

- Method: GET
- URL: `{{base_url}}/users`
- Headers: `Authorization: Bearer {{token}}`

### Get a single user

- Method: GET
- URL: `{{base_url}}/users/1`
- Headers: `Authorization: Bearer {{token}}`

### Approve a user

- Method: PUT
- URL: `{{base_url}}/users/1/approve`
- Headers: `Authorization: Bearer {{token}}`

### Deactivate a user

- Method: PUT
- URL: `{{base_url}}/users/1/deactivate`
- Headers: `Authorization: Bearer {{token}}`

### Update a user

- Method: PUT
- URL: `{{base_url}}/users/1`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "status": "ACTIVE"
}
```

### Delete a user

- Method: DELETE
- URL: `{{base_url}}/users/1`
- Headers: `Authorization: Bearer {{token}}`

---

## Contact Management Endpoints

### Get all visible contacts

- Method: GET
- URL: `{{base_url}}/contacts`
- Headers: `Authorization: Bearer {{token}}`

### Get one contact

- Method: GET
- URL: `{{base_url}}/contacts/1`
- Headers: `Authorization: Bearer {{token}}`

### Create a contact

- Method: POST
- URL: `{{base_url}}/contacts`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "contactNumber": "+1234567890",
  "email": "john@example.com",
  "profilePhoto": "https://example.com/photo.jpg"
}
```

### Update a contact

- Method: PUT
- URL: `{{base_url}}/contacts/1`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "firstName": "Johnny"
}
```

### Delete a contact

- Method: DELETE
- URL: `{{base_url}}/contacts/1`
- Headers: `Authorization: Bearer {{token}}`

### Share a contact

- Method: POST
- URL: `{{base_url}}/contacts/1/share`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "userId": 2
}
```

### Unshare a contact

- Method: POST
- URL: `{{base_url}}/contacts/1/unshare`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):

```json
{
  "userId": 2
}
```

---

## Health Check

- Method: GET
- URL: `{{base_url}}/api/health`

---

## Notes

- Only authenticated users can access protected routes.
- Approval is required before a newly registered user can sign in.
- Contacts are stored in MongoDB and user records are stored in MySQL.
