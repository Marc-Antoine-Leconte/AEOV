/**
 * Récupère les données associées à un cookie
 * @param {string} name Nom du cookie à récupérer
 * @return {string|null} 
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ')
    const value = cookies
        .find(c => c.startsWith(name + "="))
        ?.split('=')[1]
    if (value === undefined) {
        return null
    } 
    return decodeURIComponent(value)
}

/**
 * Créer ou modifie la valeur d'un cookie avec une durée spécifique
 * @param {string} name 
 * @param {string} value 
 * @param {number} days Durée de vie du cookie (en jours)
 */
function setCookie(name, value, days) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()};` 
}

function deleteCookie(name) {
   setCookie(name, "", -1);
} 