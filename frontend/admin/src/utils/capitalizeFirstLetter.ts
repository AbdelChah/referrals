export const capitalizeFirstLetter = (str: String): String => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
