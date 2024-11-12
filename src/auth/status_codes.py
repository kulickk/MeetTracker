class StatusCodes:
    register = {
        400: {
            "description": "Bad Request - Email or Username already registered",
            "content": {
                "application/json": {
                    "example": {"status_code": "string", "detail": "string"}
                }
            }
        },
        200: {
            "description": "User successfully registered",
            "content": {
                "application/json": {
                    "example": {"status_code": "string", "detail": "String"}
                }
            }
        }
    }

    login = {
        200: {
            "description": "User successfully get token",
            "content": {
                "application/json": {
                    "example": {"access_token": "string", 'token_type': 'string'}
                }
            }
        }

    }

    read_user_info = {
        200: {
            "description": "Read user info successfully",
            "content": {
                "application/json": {
                    "example": {
                        'user_id': 'string',
                        'email': 'string',
                        'username': 'string',
                        'is_active': 'string',
                        'is_admin': 'string',
                        'created_at': 'string',
                        'updated_at': 'string',
                    }
                }
            }
        }
    }
