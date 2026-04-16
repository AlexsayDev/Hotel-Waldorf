export const generarCodigoReserva = () => {
    const ahora = new Date();

    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd = String(ahora.getDate()).padStart(2, '0');
    const hh = String(ahora.getHours()).padStart(2, '0');
    const min = String(ahora.getMinutes()).padStart(2, '0');
    const ss = String(ahora.getSeconds()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);

    return `RES-${yyyy}${mm}${dd}-${hh}${min}${ss}-${random}`;
};