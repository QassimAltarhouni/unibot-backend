/**
 * @swagger
 * /sessions/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticates a user and returns an access and refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionSchema'
 *     security:
 *       - BearerAuth: []  # If needed, add global security (e.g., JWT authentication)
 *     responses:
 *       200:
 *         description: Login successful, returns user info and tokens.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request - Invalid credentials or user not verified.
 *       401:
 *         description: Unauthorized - Invalid token or missing authentication.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sessions/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token.
 *     security:
 *       - BearerAuth: []  # Token required for this route
 *     responses:
 *       200:
 *         description: Refresh successful, returns a new access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Unauthorized - Refresh token is invalid or expired.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sessions/checkAccessToken:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Check access token validity
 *     description: Verifies if the provided access token is valid.
 *     security:
 *       - BearerAuth: []  # Requires Bearer token for verification
 *     responses:
 *       200:
 *         description: Token is valid, returns user info.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckTokenResponse'
 *       404:
 *         description: Not Found - Access token is invalid or expired.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     tags:
 *       - General
 *     summary: Health check
 *     description: Checks if the API is healthy.
 *     responses:
 *       200:
 *         description: OK - Service is healthy.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "OK"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /roles/add-role:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Adds a new role with specified permissions.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Unique role name.
 *               write:
 *                 type: boolean
 *               delete:
 *                 type: boolean
 *               softDelete:
 *                 type: boolean
 *               read:
 *                 type: boolean
 *               firstPage:
 *                 type: boolean
 *               secondPage:
 *                 type: boolean
 *               thirdPage:
 *                 type: boolean
 *             required: [name]
 *             example:
 *               name: "editor"
 *               write: true
 *               read: true
 *               delete: false
 *               softDelete: false
 *               firstPage: false
 *               secondPage: false
 *               thirdPage: false
 *     responses:
 *       200:
 *         description: OK - Role created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       400:
 *         description: Bad Request - Invalid input data.
 *       409:
 *         description: Conflict - Role name already exists.
 *       401:
 *         description: Unauthorized - No valid access token provided.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /roles/assign-role:
 *   post:
 *     tags: [Roles]
 *     summary: Assign role to user
 *     description: Assigns a role to a user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user.
 *               roleId:
 *                 type: string
 *                 description: ID of the role to assign.
 *             required: [userId, roleId]
 *             example:
 *               userId: "60af8835bd1fe53b6c8e92e4"
 *               roleId: "60b8aaf4f1a2c53d5c9f9b73"
 *     responses:
 *       200:
 *         description: OK - Role assigned to user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleAssignmentResponse'
 *       404:
 *         description: Not Found - User or role not found.
 *       400:
 *         description: Bad Request - Invalid input data.
 *       401:
 *         description: Unauthorized - No valid access token provided.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /todolist/alltodolist:
 *   get:
 *     tags:
 *       - TodoList
 *     summary: Get all todo lists
 *     description: Retrieves all todo lists with permission checks for 'read' and 'firstPage'.
 *     security:
 *       - BearerAuth: []  # Ensure the token is valid (JWT required)
 *     responses:
 *       200:
 *         description: A list of all todo lists.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TodoList'
 *       401:
 *         description: Unauthorized - No valid access token or insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /todolist/get-todolist-by-id:
 *   get:
 *     tags:
 *       - TodoList
 *     summary: Get todo list by ID
 *     description: Retrieves a single todo list by its ID with permission checks for 'read' and 'secondPage'.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the todo list to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  # Ensure the token is valid (JWT required)
 *     responses:
 *       200:
 *         description: Returns the specified todo list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoList'
 *       400:
 *         description: Bad Request - Invalid ID supplied.
 *       404:
 *         description: Not Found - Todo list not found.
 *       401:
 *         description: Unauthorized - No valid access token or insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /todolist/addtodolist:
 *   post:
 *     tags:
 *       - TodoList
 *     summary: Create a new todo list
 *     description: Creates a new todo list with permission checks for 'write'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoList'
 *     security:
 *       - BearerAuth: []  # Ensure the token is valid (JWT required)
 *     responses:
 *       200:
 *         description: Todo list created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoListResponseWithMessage'
 *       400:
 *         description: Bad Request - Invalid input data.
 *       401:
 *         description: Unauthorized - No valid access token or insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully. Verification code generated.
 *       400:
 *         description: Bad Request - Invalid input data.
 *       409:
 *         description: Conflict - Email already exists.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/verify/{id}/{verificationCode}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Verify user email
 *     description: Verifies a newly registered user's email using the verification code.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to verify.
 *         schema:
 *           type: string
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         description: Verification code sent to the user's email.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully.
 *       400:
 *         description: Bad Request - User already verified.
 *       401:
 *         description: Unauthorized - Verification failed (invalid code).
 *       404:
 *         description: Not Found - User not found.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/forgotpassword:
 *   post:
 *     tags:
 *       - Users
 *     summary: Initiate password reset
 *     description: Sends a password reset code to the user's email if the account exists and is verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetInitRequest'
 *     responses:
 *       200:
 *         description: Password reset code generated and emailed.
 *       400:
 *         description: Bad Request - Email not found or not verified.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/resetpassword/{id}/{passwordResetCode}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset user password
 *     description: Resets the user's password using the password reset code.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user resetting the password.
 *         schema:
 *           type: string
 *       - in: path
 *         name: passwordResetCode
 *         required: true
 *         description: Password reset code received by email.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Bad Request - Invalid reset code or user.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user
 *     description: Retrieves the currently authenticated user's profile.
 *     responses:
 *       200:
 *         description: OK - Returns the current user's data.
 *       401:
 *         description: Unauthorized - No valid access token provided.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /category/get-categories:
 *  get:
 *    tags:
 *      - Category
 *    summary: Get all categories.
 *    responses:
 *      200:
 *        description: List of categories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Category'
 *      404:
 *        description: Not found
 */

/**
 * @swagger
 * /category/get-category-by-id/{id}:
 *  get:
 *    tags:
 *      - Category
 *    summary: Get category by ID
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The category ID
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Category found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      400:
 *        description: Invalid ID
 *      404:
 *        description: Category not found
 */

/**
 * @swagger
 * /category/edit-category-by-id/{id}:
 *  put:
 *    tags:
 *      - Category
 *    summary: Edit category by ID
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The category ID
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              systemPrompt:
 *                type: string
 *              data:
 *                type: string
 *              url:
 *                type: string
 *    responses:
 *      200:
 *        description: Category updated
 *      400:
 *        description: Invalid ID
 *      404:
 *        description: Category not found
 */

/**
 * @swagger
 * /category/delete-category-by-id/{id}:
 *  delete:
 *    tags:
 *      - Category
 *    summary: Delete category by ID
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The category ID
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Category deleted
 *      400:
 *        description: Invalid ID
 *      404:
 *        description: Category not found
 */

/**
 * @swagger
 * /category/add-category:
 *  post:
 *    tags:
 *      - Category
 *    summary: Add a new category
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: Category created
 *      400:
 *        description: Category already exists
 */
