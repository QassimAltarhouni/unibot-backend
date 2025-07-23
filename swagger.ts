import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Unibot API',
      description: 'API documentation for the Unibot backend.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local development server',
      },
    ],
    security: [
      {
        BearerAuth: [], // Global JWT auth (can be overridden per route)
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and session endpoints.' },
      {
        name: 'Users',
        description: 'User registration and account management endpoints.',
      },
      { name: 'Roles', description: 'User role management endpoints.' },
      { name: 'TodoList', description: 'Todo list management endpoints.' },
      { name: 'General', description: 'General or miscellaneous endpoints.' },
      {
        name: 'Category',
        description: 'Endpoints for managing chatbot categories.',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          required: ['title', 'description', 'systemPrompt', 'data', 'url'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            systemPrompt: { type: 'string' },
            data: { type: 'string' },
            url: { type: 'string' },
          },
          example: {
            title: 'Scholarships',
            description: 'Info about scholarship programs',
            systemPrompt: 'Respond with scholarship-related details',
            data: 'Here you can find all scholarship opportunities...',
            url: 'https://university.example.com/scholarships',
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier of the user.',
            },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            password: { type: 'string', format: 'date-time' },
            passwordConfirmation: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'email', 'firstName', 'lastName'],
          example: {
            email: 'user@example.com',
            firstName: 'Mohammed',
            lastName: 'Qassim',
            password: 'SecurePass123',
            passwordConfirmation: 'SecurePass123',
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            write: { type: 'boolean' },
            delete: { type: 'boolean' },
            softDelete: { type: 'boolean' },
            read: { type: 'boolean' },
            firstPage: { type: 'boolean' },
            secondPage: { type: 'boolean' },
            thirdPage: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name'],
          example: {
            id: '60b8aaf4f1a2c53d5c9f9b73',
            name: 'editor',
            write: true,
            delete: false,
            softDelete: false,
            read: true,
            firstPage: false,
            secondPage: false,
            thirdPage: false,
            createdAt: '2025-04-22T10:25:00Z',
            updatedAt: '2025-04-22T10:25:00Z',
          },
        },
        UserRoleAssignment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string', description: 'User ID.' },
            role: { type: 'string', description: 'Role ID.' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'user', 'role'],
          example: {
            id: '60b8ab65f1a2c53d5c9f9b74',
            user: '60af8835bd1fe53b6c8e92e4',
            role: '60b8aaf4f1a2c53d5c9f9b73',
            createdAt: '2025-04-22T10:26:45Z',
            updatedAt: '2025-04-22T10:26:45Z',
          },
        },
        TodoListItem: {
          type: 'object',
          properties: {
            header: { type: 'string' },
            content: { type: 'string' },
          },
          required: ['header', 'content'],
          example: {
            header: 'Task 1',
            content: 'Complete the project',
          },
        },
        TodoList: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            listItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/TodoListItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name'],
          example: {
            id: '60c0f1f8d6d3f84b1ad8b5c1',
            name: 'My Tasks',
            listItems: [
              { header: 'Task 1', content: 'Complete the project' },
              { header: 'Task 2', content: 'Review code' },
            ],
            createdAt: '2025-04-22T10:30:00Z',
            updatedAt: '2025-04-22T10:30:00Z',
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: {
                  type: 'string',
                  description: 'JWT access token.',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token.',
                },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              user: {
                id: '60af8835bd1fe53b6c8e92e4',
                email: 'user@example.com',
                firstName: 'Mohammed',
                lastName: 'Qassim',
                createdAt: '2025-04-22T10:20:30Z',
                updatedAt: '2025-04-22T10:20:30Z',
              },
              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            message: 'sign in successful',
            success: true,
          },
        },
        RefreshResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: {
                  type: 'string',
                  description: 'New JWT access token.',
                },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              user: {
                id: '60af8835bd1fe53b6c8e92e4',
                email: 'user@example.com',
                firstName: 'Mohammed',
                lastName: 'Qassim',
                createdAt: '2025-04-22T10:20:30Z',
                updatedAt: '2025-04-22T10:20:30Z',
              },
              accessToken: 'newAccessTokenJWT...',
            },
            message: 'refresh token successful',
            success: true,
          },
        },
        CheckTokenResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              user: {
                id: '60af8835bd1fe53b6c8e92e4',
                email: 'user@example.com',
                firstName: 'Mohammed',
                lastName: 'Qassim',
                createdAt: '2025-04-22T10:20:30Z',
                updatedAt: '2025-04-22T10:20:30Z',
              },
            },
            message: 'token valid',
            success: true,
          },
        },
        UserCreatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                activationCode: {
                  type: 'string',
                  description: 'Verification code for email activation.',
                },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: { activationCode: 'XyZ123abc4567890def' },
            message: 'User created successfully.',
            success: true,
          },
        },
        PasswordResetInitResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                passwordResetCode: {
                  type: 'string',
                  description: "Code sent to user's email to reset password.",
                },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: { passwordResetCode: 'abc123efg456789hij' },
            message: 'Password reset email sent.',
            success: true,
          },
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['message', 'success'],
          example: {
            message: 'User verified successfully.',
            success: true,
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/User' },
            success: { type: 'boolean' },
          },
          required: ['data', 'success'],
          example: {
            data: {
              email: 'user@example.com',
              firstName: 'Mohammed',
              lastName: 'Qassim',
              password: 'SecurePass123',
              passwordConfirmation: 'SecurePass123',
            },
            success: true,
          },
        },
        RoleResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                role: { $ref: '#/components/schemas/Role' },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              role: {
                id: '60b8aaf4f1a2c53d5c9f9b73',
                name: 'editor',
                write: true,
                delete: false,
                softDelete: false,
                read: true,
                firstPage: false,
                secondPage: false,
                thirdPage: false,
                createdAt: '2025-04-22T10:25:00Z',
                updatedAt: '2025-04-22T10:25:00Z',
              },
            },
            message: 'Role created successfully.',
            success: true,
          },
        },
        UserRoleAssignmentResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                assignRole: { $ref: '#/components/schemas/UserRoleAssignment' },
              },
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              assignRole: {
                id: '60b8ab65f1a2c53d5c9f9b74',
                user: '60af8835bd1fe53b6c8e92e4',
                role: '60b8aaf4f1a2c53d5c9f9b73',
                createdAt: '2025-04-22T10:26:45Z',
                updatedAt: '2025-04-22T10:26:45Z',
              },
            },
            message: 'Role assigned successfully.',
            success: true,
          },
        },
        TodoListResponse: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/TodoList' },
            success: { type: 'boolean' },
          },
          required: ['data', 'success'],
          example: {
            data: {
              id: '60c0f1f8d6d3f84b1ad8b5c1',
              name: 'My Tasks',
              listItems: [
                { header: 'Task 1', content: 'Complete the project' },
                { header: 'Task 2', content: 'Review code' },
              ],
              createdAt: '2025-04-22T10:30:00Z',
              updatedAt: '2025-04-22T10:30:00Z',
            },
            success: true,
          },
        },
        TodoListResponseWithMessage: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/TodoList' },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
          required: ['data', 'message', 'success'],
          example: {
            data: {
              id: '60c0f1f8d6d3f84b1ad8b5c3',
              name: 'Project Tasks',
              listItems: [
                {
                  header: 'Setup project',
                  content: 'Initialize repository and tools',
                },
                {
                  header: 'Design database',
                  content: 'Create ER diagram and schema',
                },
              ],
              createdAt: '2025-04-22T10:45:00Z',
              updatedAt: '2025-04-22T10:45:00Z',
            },
            message: 'Todo list created successfully.',
            success: true,
          },
        },
        TodoListArrayResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TodoList' },
            },
            success: { type: 'boolean' },
          },
          required: ['data', 'success'],
          example: {
            data: [
              {
                id: '60c0f1f8d6d3f84b1ad8b5c1',
                name: 'My Tasks',
                listItems: [
                  { header: 'Task 1', content: 'Complete the project' },
                  { header: 'Task 2', content: 'Review code' },
                ],
                createdAt: '2025-04-22T10:30:00Z',
                updatedAt: '2025-04-22T10:30:00Z',
              },
              {
                id: '60c0f1f8d6d3f84b1ad8b5c2',
                name: 'Shopping List',
                listItems: [],
                createdAt: '2025-04-22T09:15:00Z',
                updatedAt: '2025-04-22T09:15:00Z',
              },
            ],
            success: true,
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
          example: {
            message: 'Error description',
          },
        },
        // Additional schemas for request bodies:
        CreateSessionSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
              format: 'password',
            },
          },
          required: ['email', 'password'],
          example: {
            email: 'user@example.com',
            password: 'Password123!',
          },
        },
        PasswordResetInitRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
          },
          required: ['email'],
          example: {
            email: 'user@example.com',
          },
        },
        PasswordResetRequest: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              format: 'password',
            },
          },
          required: ['password'],
          example: {
            password: 'NewSecurePassword123',
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token authentication',
        },
      },
    },
  },
  apis: ['./src/routes/swagger.routes.ts'], // Scan all route files for annotations
};

// Generate the Swagger specification object
const swaggerSpec = swaggerJsDoc(swaggerOptions);
export { swaggerSpec };
