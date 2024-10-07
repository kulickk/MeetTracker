class UserAlreadyExistsException(Exception):
    def __init__(self, username: str):
        self.username = username


class InvalidCredentialsException(Exception):
    def __init__(self):
        pass


class ItemNotFoundException(Exception):
    def __init__(self, item_id: int):
        self.item_id = item_id
