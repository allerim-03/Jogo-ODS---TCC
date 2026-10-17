

        function abrirModal(idModal) {

            var modal =
                document.getElementById(idModal);

            var overlay =
                document.getElementById('modal-overlay');

            if (modal && overlay) {

                overlay.classList.add('active');

                modal.classList.add('active');

            }

        }


        function fecharModal(idModal) {

            var modal =
                document.getElementById(idModal);

            var overlay =
                document.getElementById('modal-overlay');

            if (modal) {

                modal.classList.remove('active');

            }

            if (overlay) {

                overlay.classList.remove('active');

            }

        }


        function fecharTodosModais() {

            var modais =
                document.querySelectorAll('.modal-membro');

            var overlay =
                document.getElementById('modal-overlay');

            modais.forEach(function(modal) {

                modal.classList.remove('active');

            });

            if (overlay) {

                overlay.classList.remove('active');

            }

        }

    