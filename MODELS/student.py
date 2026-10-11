from MODELS.user import User


class Student(User):
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
        id_role=None,
        code_classroom=None
    ):
        super().__init__(
            id_user=id_user,
            name_user=name_user,
            birth_user=birth_user,
            registration_user=registration_user,
            main_email=main_email,
            personal_email=personal_email,
            password_user=password_user,
            id_gender=id_gender,
            id_role=id_role
        )

        self.code_classroom = code_classroom