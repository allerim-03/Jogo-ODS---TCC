class User:
    def __init__(
        self,
        id_user=None,
        name_user=None,
        birth_user=None,
        registration_user=None,
        main_email=None,
        personal_email=None,
        password_user=None,
        id_gender=None,
        id_role=None
    ):
        self.id_user = id_user
        self.name_user = name_user
        self.birth_user = birth_user
        self.registration_user = registration_user
        self.main_email = main_email
        self.personal_email = personal_email
        self.password_user = password_user
        self.id_gender = id_gender
        self.id_role = id_role