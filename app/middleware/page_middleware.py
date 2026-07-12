from functools import wraps



def page_login_required(view):

    @wraps(view)
    def wrapper(*args, **kwargs):

        return view(*args, **kwargs)

        # TODO
        # Quando migrarmos para JWT em cookies
        # validar sessão aqui.

    return wrapper