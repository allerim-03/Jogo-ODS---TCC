
/* ==========================================================================
   API SERVICE
   --------------------------------------------------------------------------
   Centraliza toda a comunicação entre o Frontend e o Backend.

   Vantagens:
   • Evita repetir fetch() em vários arquivos.
   • Adiciona automaticamente o JWT nas requisições protegidas.
   • Padroniza tratamento de erros.
   • Facilita trocar a URL da API futuramente.

   Utilizado por:
- auth_api.js
- login.js
- register.js
- dashboard.js
- ranking.js
- quiz.js
- games.js
- profile.js
   ========================================================================== */


/* ==========================================================================
   CONFIGURAÇÃO DA API
   ========================================================================== */

const API_BASE_URL = "http://localhost:5000/api";
/* para quando colocar no ar const API_BASE_URL = "/api"; */


/* ==========================================================================
   TOKEN JWT
   ========================================================================== */

/**
 * Retorna o token salvo no navegador.
 */
function getToken() {

    return localStorage.getItem("token_usuario");

}


/**
 * Salva o token JWT.
 */
function saveToken(token) {

    localStorage.setItem("token_usuario", token);

}


/**
 * Remove o token.
 */
function removeToken() {

    localStorage.removeItem("token_usuario");

}


/* ==========================================================================
   HEADERS PADRÃO
   ========================================================================== */

/**
 * Monta os headers da requisição.
 * Caso exista um JWT, adiciona automaticamente.
 */
function getHeaders() {

    const headers = {

        "Content-Type": "application/json"

    };

    const token = getToken();

    if (token) {

        headers["Authorization"] = `Bearer ${token}`;

    }

    return headers;

}


/* ==========================================================================
   REQUISIÇÃO GENÉRICA
   ========================================================================== */

/**
 * Função base utilizada pelos métodos GET, POST,
 * PUT e DELETE.
 */
async function apiRequest(endpoint, options = {}) {
try {
    const response = await fetch(

        `${API_BASE_URL}${endpoint}`,

        {

            headers: getHeaders(),

            ...options

        }

    );
}
catch {

    throw new Error(
        "Não foi possível conectar ao servidor."
    );

}

    /*const data = await response.json();*/
    const contentType = response.headers.get("content-type");

    let data = {};

    if (contentType && contentType.includes("application/json")) {

        data = await response.json();

    }
    if (!response.ok) {

        throw new Error(

            data.message ||

            "Erro ao comunicar com o servidor."

        );

    }

    return data;

}


/* ==========================================================================
   MÉTODOS HTTP
   ========================================================================== */

/**
 * GET
 */
async function get(endpoint) {

    return apiRequest(endpoint, {

        method: "GET"

    });

}


/**
 * POST
 */
async function post(endpoint, body) {

    return apiRequest(endpoint, {

        method: "POST",

        body: JSON.stringify(body)

    });

}


/**
 * PUT
 */
async function put(endpoint, body) {

    return apiRequest(endpoint, {

        method: "PUT",

        body: JSON.stringify(body)

    });

}


/**
 * DELETE
 */
async function del(endpoint) {

    return apiRequest(endpoint, {

        method: "DELETE"

    });

}
/* metodo patch*/

async function patch(endpoint, body) {

    return apiRequest(endpoint, {

        method: "PATCH",

        body: JSON.stringify(body)

    });

}


/* ==========================================================================
   EXPORTAÇÃO GLOBAL
   ========================================================================== */

window.API = {

    get,

    post,

    put,

    patch,

    delete: del,

    getToken,

    saveToken,

    removeToken

};